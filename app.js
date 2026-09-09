let express = require("express")
let mysql = require('mysql');
const cors = require('cors');
let app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hospital_management"
});

con.connect((err) => {
    if(err) throw err;
    console.log("Connected to database!");
});

// add patient done
app.post("/api/patients", (req, res) => {
    const { name, age, gender, contact, illness } = req.body;

    if (!name || !age || !gender || !contact || !illness) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const sql = `INSERT INTO patients(name, age, gender, contact, illness) VALUES (?, ?, ?, ?, ?)`;

    con.query(sql, [name, age, gender, contact, illness], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(201).json({
            success: true,
            message: "Patient added successfully",
            id: result
        });
    }
    );
});


// get patients done
app.get("/api/patients", (req, res) => {
    con.query(
        "SELECT * FROM patients", (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "patients fetched successfully",
                data: result
            });
        }
    );
});


//get patients by id done
app.get("/api/patients/:id", (req, res) => {
    const { id } = req.params;

    con.query("SELECT * FROM patients WHERE id = ?", [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.json({
            success: true,
            data: result[0]
        });
    }
    );
});

// update patients by id done
app.put("/api/patients/:id", (req, res) => {
    const { id } = req.params;
    const { name, age, gender, contact, illness } = req.body;

    if (!name || !age || !gender || !contact || !illness) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const sql = `UPDATE patients SET name = ?, age = ?, gender = ?, contact = ?, illness = ? WHERE id = ? `;

    con.query(sql, [name, age, gender, contact, illness, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.json({
            success: true,
            message: "Patient updated successfully"
        });
    }
    );
});

// delete patient by id done
app.delete("/api/patients/:id", (req, res) => {
    const { id } = req.params;

    con.query("DELETE FROM patients WHERE id = ?", [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.json({
            success: true,
            message: "Patient deleted successfully"
        });
    }
    );
});

// get doctors done
app.get("/api/doctors", (req, res) => {
    con.query("SELECT * FROM doctors ORDER BY name", (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            data: result
        });
    }
    );
});


// book apoointment done
app.post("/api/appointments", (req, res) => {
    const { patient_id, doctor_id, slot_date, slot_time } = req.body;

    if (!patient_id || !doctor_id || !slot_date || !slot_time) {
        return res.status(400).json({
            success: false,
            message: "All appointment fields are required"
        });
    }

    con.query("SELECT id FROM patients WHERE id = ?", [patient_id], (err, patient) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (patient.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        con.query(
            "SELECT id FROM doctors WHERE id = ?",
            [doctor_id],
            (err, doctor) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                if (doctor.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Doctor not found"
                    });
                }

                const checkSlot = `SELECT id FROM appointments WHERE doctor_id = ? AND slot_date = ? AND slot_time = ? AND status != 'cancelled' `;

                con.query(
                    checkSlot,
                    [doctor_id, slot_date, slot_time],
                    (err, booked) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err.message
                            });
                        }

                        if (booked.length > 0) {
                            return res.status(409).json({
                                success: false,
                                message: "This doctor slot is already booked"
                            });
                        }

                        const insertSql = `INSERT INTO appointments (patient_id, doctor_id, slot_date, slot_time, status)
                                VALUES (?, ?, ?, ?, 'confirmed')`;

                        con.query(insertSql, [patient_id, doctor_id, slot_date, slot_time
                        ],
                            (err, result) => {
                                if (err) {
                                    return res.status(500).json({
                                        success: false,
                                        message: err.message
                                    });
                                }

                                res.status(201).json({
                                    success: true,
                                    message: "Appointment booked successfully",
                                    id: result.insertId
                                });
                            }
                        );
                    }
                );
            }
        );
    }
    );
});

// get apointments done
app.get("/api/appointments", (req, res) => {
    const sql = `
        SELECT
            a.id,
            a.patient_id,
            p.name AS patient_name,
            p.illness,
            a.doctor_id,
            d.name AS doctor_name,
            d.specialization,
            a.slot_date,
            a.slot_time,
            a.status
        FROM appointments a
        INNER JOIN patients p ON a.patient_id = p.id
        INNER JOIN doctors d ON a.doctor_id = d.id
        ORDER BY a.slot_date ASC, a.slot_time ASC
    `;

    con.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            data: result
        });
    });
});

//get Appointment by id done
app.get("/api/appointments/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            a.id,
            p.id AS patient_id,
            p.name AS patient_name,
            p.age,
            p.gender,
            p.contact,
            p.illness,
            d.id AS doctor_id,
            d.name AS doctor_name,
            d.specialization,
            a.slot_date,
            a.slot_time,
            a.status
        FROM appointments a
        INNER JOIN patients p ON a.patient_id = p.id
        INNER JOIN doctors d ON a.doctor_id = d.id
        WHERE a.id = ?
    `;

    con.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        res.json({
            success: true,
            data: result[0]
        });
    });
});

// update appointment by id
app.put("/api/appointments/:id", (req, res) => {
    const { id } = req.params;
    const { slot_date, slot_time, status } = req.body;

    if (!slot_date && !slot_time && !status) {
        return res.status(400).json({
            success: false,
            message: "Provide slot_date, slot_time or status"
        });
    }

    con.query("SELECT * FROM appointments WHERE id = ?", [id], (err, appointment) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (appointment.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        const old = appointment[0];

        const newDate = slot_date || old.slot_date;
        const newTime = slot_time || old.slot_time;
        const newStatus = status || old.status;

        const checkSlot = `
                SELECT id
                FROM appointments
                WHERE doctor_id = ?
                AND slot_date = ?
                AND slot_time = ?
                AND id != ?
                AND status != 'cancelled'
            `;

        con.query(
            checkSlot,
            [old.doctor_id, newDate, newTime, id],
            (err, booked) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                if (booked.length > 0) {
                    return res.status(409).json({
                        success: false,
                        message: "New slot is already booked"
                    });
                }

                const updateSql = `
                        UPDATE appointments
                        SET slot_date = ?, slot_time = ?, status = ?
                        WHERE id = ?
                    `;

                con.query(
                    updateSql,
                    [newDate, newTime, newStatus, id],
                    (err) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err.message
                            });
                        }

                        res.json({
                            success: true,
                            message: "Appointment updated successfully"
                        });
                    }
                );
            }
        );
    }
    );
});

// delete appointment
app.delete("/api/appointments/:id", (req, res) => {
    const { id } = req.params;

    con.query(
        "UPDATE appointments SET status = 'cancelled' WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Appointment not found"
                });
            }

            res.json({
                success: true,
                message: "Appointment cancelled successfully"
            });
        }
    );
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});