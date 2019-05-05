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

 Date: 04/05/2019 14:47:32
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for users_answers
-- ----------------------------
DROP TABLE IF EXISTS `users_answers`;
CREATE TABLE `users_answers` (
  `matricola_user` char(6) NOT NULL,
  `id_answer` int(11) DEFAULT NULL,
  `id_question` int(11) NOT NULL,
  PRIMARY KEY (`matricola_user`,`id_question`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users_answers
-- ----------------------------
BEGIN;
INSERT INTO `users_answers` VALUES ('568254', 4, 4);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
