# Hospital Management API

This project is a Node.js + Express API for managing patients, doctors, and appointments in a hospital system.

## Run the project

1. Open the project folder.
2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:5000
```

---

## Required database setup

This app connects to MySQL database named `hospital_management`.

Make sure MySQL is running locally and create the database:

```sql
CREATE DATABASE hospital_management;
```

Then create the required tables.

### patients table

```sql
CREATE TABLE patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  gender VARCHAR(20) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  illness VARCHAR(255) NOT NULL
);
```

### doctors table

```sql
CREATE TABLE doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialization VARCHAR(100) NOT NULL
);
```

### appointments table

```sql
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed',
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);
```

> Update the MySQL connection details in `app.js` if your username/password/database settings differ.

---

## API endpoints

### 1) Add patient

- Method: `POST`
- URL: `/api/patients`

Request body:

```json
{
  "name": "Rahul Sharma",
  "age": 30,
  "gender": "Male",
  "contact": "9876543210",
  "illness": "Fever"
}
```

---

### 2) Get all patients

- Method: `GET`
- URL: `/api/patients`

---

### 3) Get patient by ID

- Method: `GET`
- URL: `/api/patients/:id`

---

### 4) Update patient by ID

- Method: `PUT`
- URL: `/api/patients/:id`

Request body:

```json
{
  "name": "Rahul Sharma",
  "age": 32,
  "gender": "Male",
  "contact": "9876543210",
  "illness": "Cold"
}
```

---

### 5) Delete patient by ID

- Method: `DELETE`
- URL: `/api/patients/:id`

---

### 6) Get all doctors

- Method: `GET`
- URL: `/api/doctors`

---

### 7) Book appointment

- Method: `POST`
- URL: `/api/appointments`

Request body:

```json
{
  "patient_id": 1,
  "doctor_id": 1,
  "slot_date": "2026-09-10",
  "slot_time": "10:30:00"
}
```

---

### 8) Get all appointments

- Method: `GET`
- URL: `/api/appointments`

---

### 9) Get appointment by ID

- Method: `GET`
- URL: `/api/appointments/:id`

---

### 10) Update appointment by ID

- Method: `PUT`
- URL: `/api/appointments/:id`

Example request body:

```json
{
  "slot_date": "2026-09-12",
  "slot_time": "11:00:00",
  "status": "confirmed"
}
```

---

### 11) Cancel appointment by ID

- Method: `DELETE`
- URL: `/api/appointments/:id`

This action sets the appointment status to `cancelled`.

---

## Example curl commands

### Add patient

```bash
curl -X POST http://localhost:5000/api/patients \
  -H "Content-Type: application/json" \
  -d '{"name":"Rahul Sharma","age":30,"gender":"Male","contact":"9876543210","illness":"Fever"}'
```

### Get all patients

```bash
curl http://localhost:5000/api/patients
```

### Book appointment

```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"patient_id":1,"doctor_id":1,"slot_date":"2026-09-10","slot_time":"10:30:00"}'
```

---

## Notes

- The server listens on port `5000`.
- The app uses MySQL, so the database must be configured before running the API.
- If there are database connection errors, check the MySQL username/password in `app.js`.
