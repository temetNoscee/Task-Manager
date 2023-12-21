CREATE DATABASE task_manager

CREATE TABLE `account` (
  `username` varchar(45) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(45) NOT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
)

CREATE TABLE `session` (
  `session_id` varchar(255) NOT NULL,
  `username` varchar(45) NOT NULL,
  PRIMARY KEY (`session_id`),
  KEY `username1_idx` (`username`),
  CONSTRAINT `username1` FOREIGN KEY (`username`) REFERENCES `account` (`username`)
) 

CREATE TABLE `tasks` (
  `task_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `task` text NOT NULL,
  PRIMARY KEY (`task_id`),
  KEY `username3_idx` (`username`),
  CONSTRAINT `username3` FOREIGN KEY (`username`) REFERENCES `account` (`username`)
) 