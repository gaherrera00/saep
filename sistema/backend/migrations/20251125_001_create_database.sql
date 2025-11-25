-- ENTREGA 3: SCRIPT DE CRIAÇÃO E POPULAÇÃO DO BANCO DE DADOS

DROP DATABASE IF EXISTS saep_db;
CREATE DATABASE saep_db;
USE saep_db;

-- 2. CRIAÇÃO DA TABELA USUARIO
CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome_usuario VARCHAR(100) NOT NULL,
    login VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

-- 3. CRIAÇÃO DA TABELA PRODUTOs
CREATE TABLE Produtos (
    id_produto INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    unidade_medida VARCHAR(20),
    estoque_atual INT DEFAULT 0,
    estoque_minimo INT NOT NULL,
    data_validade DATE,
    caracteristica_variacao VARCHAR(100) 
);

-- 4. CRIAÇÃO DA TABELA MOVIMENTACAO (RF14 - Histórico/Rastreabilidade)
CREATE TABLE Movimentacao (
    id_movimentacao INT PRIMARY KEY AUTO_INCREMENT,
    tipo_movimentacao ENUM('Entrada', 'Saida') NOT NULL, 
    quantidade INT NOT NULL,
    data_movimentacao DATE NOT NULL,
    
    -- Chaves Estrangeiras para Rastreabilidade
    id_produto INT,
    id_usuario INT, -- Responsável pela movimentação
    
    FOREIGN KEY (id_produto) REFERENCES Produtos(id_produto),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);


-- 5. POPULAÇÃO INICIAL (Mínimo de 3 registros por tabela)

-- 5.1. Usuários
INSERT INTO Usuarios (nome_usuario, login, senha) VALUES
('Joana Almoxarifado', 'joana.a', 'senha_hashed_1'),
('Rafael Gerente', 'rafael.g', 'senha_hashed_2'),
('Carlos Estagiario', 'carlos.e', 'senha_hashed_3');

-- 5.2. Produtos (com estoque mínimo e variações)
-- Obs: O estoque_atual inicia baixo para facilitar o teste de entrada/saída.
INSERT INTO Produtos (nome, descricao, unidade_medida, estoque_atual, estoque_minimo, data_validade, caracteristica_variacao) VALUES
('Cimento CP II-F 50kg', 'Cimento Portland composto, resistente a sulfatos', 'Saco', 5, 20, '2026-08-30', 'Tipo: Estrutural'),
('Tinta Acrílica Premium', 'Lata 18L, acabamento acetinado', 'Lata', 15, 10, NULL, 'Cor: Branco Gelo'),
('Barra de Aço CA-50 3/8"', 'Barra de Aço para estruturas', 'Barra', 50, 50, NULL, 'Diâmetro: 9.5mm');

-- 5.3. Movimentações (Ligando Usuário e Produto)
-- Movimentação 1: Entrada de Cimento por Joana
INSERT INTO Movimentacao (tipo_movimentacao, quantidade, data_movimentacao, id_produto, id_usuario) VALUES
('Entrada', 100, '2025-11-20', 1, 1); -- Produto 1 (Cimento), Usuário 1 (Joana)

-- Movimentação 2: Entrada de Tinta por Rafael
INSERT INTO Movimentacao (tipo_movimentacao, quantidade, data_movimentacao, id_produto, id_usuario) VALUES
('Entrada', 15, '2025-11-21', 2, 2); -- Produto 2 (Tinta), Usuário 2 (Rafael)

-- Movimentação 3: Saída de Aço por Carlos
INSERT INTO Movimentacao (tipo_movimentacao, quantidade, data_movimentacao, id_produto, id_usuario) VALUES
('Saida', 10, '2025-11-24', 3, 3); -- Produto 3 (Aço), Usuário 3 (Carlos)