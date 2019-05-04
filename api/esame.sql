/*
 Navicat Premium Data Transfer

 Source Server         : mampdatabase
 Source Server Type    : MySQL
 Source Server Version : 50725
 Source Host           : localhost:8889
 Source Schema         : esame

 Target Server Type    : MySQL
 Target Server Version : 50725
 File Encoding         : 65001

 Date: 03/05/2019 10:53:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for answers
-- ----------------------------
DROP TABLE IF EXISTS `answers`;
CREATE TABLE `answers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(700) NOT NULL,
  `id_question` int(255) NOT NULL,
  `correct` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of answers
-- ----------------------------
BEGIN;
INSERT INTO `answers` VALUES (1, 'prova1_1', 1, 1);
INSERT INTO `answers` VALUES (2, 'prova2_1', 1, 0);
INSERT INTO `answers` VALUES (3, 'prova3_1', 1, 0);
INSERT INTO `answers` VALUES (4, 'prova1_3', 3, 1);
INSERT INTO `answers` VALUES (5, 'prova2_3', 3, 0);
INSERT INTO `answers` VALUES (6, 'prova3_3', 3, 0);
INSERT INTO `answers` VALUES (7, 'prova4_1', 1, 0);
INSERT INTO `answers` VALUES (8, 'prova4_3', 3, 0);
COMMIT;

-- ----------------------------
-- Table structure for questions
-- ----------------------------
DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(600) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of questions
-- ----------------------------
BEGIN;
INSERT INTO `questions` VALUES (1, 'The Harvard architecture for micro-controllers added which additional bus??');
INSERT INTO `questions` VALUES (3, 'In any programming language, what is the most common way to iterate through an array??');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;