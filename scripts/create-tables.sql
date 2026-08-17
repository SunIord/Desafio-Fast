-- Workshop Tracker - Script de criação das tabelas

CREATE TABLE IF NOT EXISTS `colaboradores` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Nome` varchar(255) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `workshops` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Nome` varchar(255) NOT NULL,
  `DataRealizacao` datetime NOT NULL,
  `Descricao` text NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `presencas` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `WorkshopId` int NOT NULL,
  `ColaboradorId` int NOT NULL,
  `DataRegistro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `WorkshopId` (`WorkshopId`,`ColaboradorId`),
  KEY `ColaboradorId` (`ColaboradorId`),
  CONSTRAINT `presencas_ibfk_1` FOREIGN KEY (`WorkshopId`) REFERENCES `workshops` (`Id`) ON DELETE RESTRICT,
  CONSTRAINT `presencas_ibfk_2` FOREIGN KEY (`ColaboradorId`) REFERENCES `colaboradores` (`Id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `usuarios` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(100) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Username` (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Usuário padrão para login (username: admin / senha: admin123)
INSERT INTO `usuarios` (`Username`, `PasswordHash`) 
VALUES ('admin', '$2a$11$/xMnFLVNPhjK7dEnEUVJvONYeMiGNM.QIv3dKbeCsp/nNTVcTvvrm');