-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2026-09-08 00:00:00
-- Server version: 8.0.0
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `hospital_management`
--
CREATE DATABASE IF NOT EXISTS `hospital_management` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hospital_management`;

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--
CREATE TABLE `patients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `age` int NOT NULL,
  `gender` varchar(20) NOT NULL,
  `contact` varchar(20) NOT NULL,
  `illness` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--
CREATE TABLE `doctors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `specialization` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--
CREATE TABLE `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `slot_date` date NOT NULL,
  `slot_time` time NOT NULL,
  `status` varchar(50) DEFAULT 'confirmed',
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Insert sample data
--
INSERT INTO `patients` (`id`, `name`, `age`, `gender`, `contact`, `illness`) VALUES
(1, 'Rahul Sharma', 30, 'Male', '9876543210', 'Fever'),
(2, 'Anita Verma', 28, 'Female', '9123456780', 'Cold'),
(3, 'Rohit Kumar', 45, 'Male', '9988776655', 'Back Pain');

INSERT INTO `doctors` (`id`, `name`, `specialization`) VALUES
(1, 'Dr. Meera Singh', 'Cardiology'),
(2, 'Dr. Arjun Patel', 'Neurology'),
(3, 'Dr. Sneha Rao', 'Orthopedic');

INSERT INTO `appointments` (`id`, `patient_id`, `doctor_id`, `slot_date`, `slot_time`, `status`) VALUES
(1, 1, 1, '2026-09-10', '10:30:00', 'confirmed'),
(2, 2, 2, '2026-09-11', '11:00:00', 'confirmed'),
(3, 3, 3, '2026-09-12', '09:15:00', 'cancelled');

COMMIT;
