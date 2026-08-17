-- Workshop Tracker - Seed de dados para demonstração

USE WorkshopTracker;

-- ============================================
-- Colaboradores
-- ============================================
INSERT INTO colaboradores (Nome) VALUES
('Ana Paula Santos'),
('Carlos Eduardo Lima'),
('Marina Ferreira Costa'),
('Rafael Oliveira'),
('Juliana Martins'),
('Fernando Almeida'),
('Beatriz Rocha'),
('Lucas Pereira');

-- ============================================
-- Workshops
-- ============================================
INSERT INTO workshops (Nome, DataRealizacao, Descricao) VALUES
('Clean Code na Prática', '2025-02-20 16:00:00', 'Workshop sobre princípios de código limpo e boas práticas de refatoração.'),
('Testes Automatizados com xUnit', '2025-05-15 17:00:00', 'Introdução a testes unitários e de integração com xUnit e Moq.'),
('Arquitetura de Microsserviços', '2025-08-14 16:00:00', 'Conceitos de arquitetura distribuída, comunicação entre serviços e desafios.'),
('DevOps e CI/CD', '2025-11-13 17:00:00', 'Pipeline de integração contínua, deploy automatizado e ferramentas de monitoramento.'),
('React e Performance', '2026-02-19 16:00:00', 'Técnicas para otimização de aplicações React: memoização, lazy loading e code-splitting.'),
('Banco de Dados para Devs', '2026-05-14 17:00:00', 'Modelagem de dados, índices, consultas otimizadas e boas práticas com MySQL.');

-- ============================================
-- Presencas
-- ============================================
-- Workshop 1 (Clean Code)
INSERT INTO presencas (WorkshopId, ColaboradorId, DataRegistro) VALUES
(1, 1, '2025-02-20 16:00:00'), (1, 2, '2025-02-20 16:00:00'), (1, 3, '2025-02-20 16:00:00'), (1, 5, '2025-02-20 16:00:00');

-- Workshop 2 (Testes Automatizados)
INSERT INTO presencas (WorkshopId, ColaboradorId, DataRegistro) VALUES
(2, 1, '2025-05-15 17:00:00'), (2, 2, '2025-05-15 17:00:00'), (2, 4, '2025-05-15 17:00:00'), (2, 6, '2025-05-15 17:00:00'), (2, 7, '2025-05-15 17:00:00');

-- Workshop 3 (Microsserviços)
INSERT INTO presencas (WorkshopId, ColaboradorId, DataRegistro) VALUES
(3, 2, '2025-08-14 16:00:00'), (3, 3, '2025-08-14 16:00:00'), (3, 5, '2025-08-14 16:00:00'), (3, 8, '2025-08-14 16:00:00');

-- Workshop 4 (DevOps)
INSERT INTO presencas (WorkshopId, ColaboradorId, DataRegistro) VALUES
(4, 1, '2025-11-13 17:00:00'), (4, 4, '2025-11-13 17:00:00'), (4, 6, '2025-11-13 17:00:00'), (4, 7, '2025-11-13 17:00:00'), (4, 8, '2025-11-13 17:00:00');

-- Workshop 5 (React e Performance)
INSERT INTO presencas (WorkshopId, ColaboradorId, DataRegistro) VALUES
(5, 1, '2026-02-19 16:00:00'), (5, 2, '2026-02-19 16:00:00'), (5, 3, '2026-02-19 16:00:00'), (5, 5, '2026-02-19 16:00:00'), (5, 6, '2026-02-19 16:00:00'), (5, 7, '2026-02-19 16:00:00');

-- Workshop 6 (Banco de Dados para Devs)
INSERT INTO presencas (WorkshopId, ColaboradorId, DataRegistro) VALUES
(6, 1, '2026-05-14 17:00:00'), (6, 3, '2026-05-14 17:00:00'), (6, 4, '2026-05-14 17:00:00'), (6, 8, '2026-05-14 17:00:00');