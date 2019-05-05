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

 Date: 04/05/2019 13:08:52
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `matricola` char(6) NOT NULL,
  `cognome` varchar(100) DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `punteggio` int(2) DEFAULT NULL,
  `bonus` int(2) DEFAULT NULL,
  `malus` int(2) DEFAULT NULL,
  `start` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `end` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`matricola`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES ('568254', 'Rizzi', 'Marco', NULL, NULL, NULL, NULL, NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
