-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`floor`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`floor` ;

CREATE TABLE IF NOT EXISTS `mydb`.`floor` (
  `floorID` INT NOT NULL,
  PRIMARY KEY (`floorID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`cell`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`cell` ;

CREATE TABLE IF NOT EXISTS `mydb`.`cell` (
  `cellsID` INT NOT NULL,
  `floorID` INT NOT NULL,
  `longitude` INT NULL,
  `latitude` INT NULL,
  PRIMARY KEY (`cellsID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`room`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`room` ;

CREATE TABLE IF NOT EXISTS `mydb`.`room` (
  `roomID` INT NOT NULL,
  `nodeID` INT NULL,
  `floorID` INT NULL,
  `roomNumber` INT NOT NULL,
  `roomName` VARCHAR(45) NOT NULL,
  `isPopular` BOOL NOT NULL,
  PRIMARY KEY (`roomID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Inserting values into room
-- -----------------------------------------------------

INSERT INTO room (roomID, nodeID, floorID, roomNumber, roomName, isPopular) VALUES
		(1, null, null, 1000, 'Theater', true),
		(2, null, null, 1001, 'Room 1001', false),
		(3, null, null, 1002, 'Room 1002', false),
		(4, null, null, 1003, 'Restroom - Men', false),
		(5, null, null, 1004, 'Restroom - Women', false),
		(6, null, null, 1005, 'Room 1005', false),
		(7, null, null, 1006, 'Room 1006', false),
		(8, null, null, 1007, 'Room 1007', false),
		(9, null, null, 1008, 'Room 1008', false),
		(10, null, null, 1009, 'Room 1009', false),
		(11, null, null, 1010, 'Room 1010', false),
		(12, null, null, 1011, 'Room 1011', false),
		(13, null, null, 1012, 'Room 1012', false),
		(14, null, null, 1013, 'Room 1013', false),
		(15, null, null, 1014, 'Room 1014', false),
		(16, null, null, 1015, 'Room 1015', false),
		(17, null, null, 1016, 'Room 1016', false),
		(18, null, null, 1017, 'Restroom - Women', false),
		(19, null, null, 1018, 'Restroom - Men', false),
		(20, null, null, 1019, 'Room 1019', false),
		(21, null, null, 1020, 'Room 1020', false),
		(22, null, null, 1021, 'Room 1021', false),
		(23, null, null, 1022, 'Office Suite', true),
		(24, null, null, 1023, 'Room 1023', false),
		(25, null, null, 1024, 'Restroom - Men', false),
		(26, null, null, 1025, 'Restroom - Women', false),
		(27, null, null, 1026, 'Dividends', true),
		(28, null, null, 1027, 'Room 1027', false),
		(29, null, null, 1028, 'Room 1028', false),
		(30, null, null, 1029, 'Restroom', false),
		(31, null, null, 1030, 'Room 1030', false),
		(32, null, null, 1031, 'Room 1031', false),
		(33, null, null, 1032, 'Room 1032', false),
		(34, null, null, 1033, 'Room 1033', false),
		(35, null, null, 1034, 'Room 1034', false),
		(36, null, null, 1035, 'Room 1035', false),
		(37, null, null, 1036, 'Room 1036', false),
		(38, null, null, 1037, 'Room 1037', false),
		(39, null, null, 1038, 'Room 1038', false),
		(40, null, null, 1039, 'Entrance Hall - West', true),
		(41, null, null, 1040, 'Entrance Hall - Central', true),
		(42, null, null, 1041, 'Entrance Hall - East', true);

-- -----------------------------------------------------
-- Table `mydb`.`node`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`node` ;

CREATE TABLE IF NOT EXISTS `mydb`.`node` (
  `nodeID` INT NOT NULL,
  `cellID` INT NULL,
  PRIMARY KEY (`nodeID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`transition`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`transition` ;

CREATE TABLE IF NOT EXISTS `mydb`.`transition` (
  `transitionID` INT NOT NULL,
  `nodeID` INT NOT NULL,
  `floorID` INT NOT NULL,
  PRIMARY KEY (`transitionID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`beacon`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`beacon` ;

CREATE TABLE IF NOT EXISTS `mydb`.`beacon` (
  `beaconID` INT NOT NULL,
  `cellID` INT NULL,
  PRIMARY KEY (`beaconID`))
ENGINE = InnoDB;

USE `mydb` ;

-- -----------------------------------------------------
-- Placeholder table for view `mydb`.`view1`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`view1` (`id` INT);

-- -----------------------------------------------------
-- View `mydb`.`view1`
-- -----------------------------------------------------
DROP VIEW IF EXISTS `mydb`.`view1` ;
DROP TABLE IF EXISTS `mydb`.`view1`;
USE `mydb`;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
