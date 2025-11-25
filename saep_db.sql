DROP DATABASE IF EXISTS gerenciaEstoque;
CREATE DATABASE gerenciaEstoque;
USE gerenciaEstoque;

CREATE TABLE Usuarios (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nomeUsuario VARCHAR(100) NOT NULL,
    login VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE Produtos (
    idProduto INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    unidadeMedida VARCHAR(20),
    estoqueAtual INT DEFAULT 0,
    estoqueMinimo INT NOT NULL,
    dataValidade DATE,
    caracteristicaVariacao VARCHAR(100)
);

CREATE TABLE Movimentacao (
    idMovimentacao INT PRIMARY KEY AUTO_INCREMENT,
    tipoMovimentacao ENUM('Entrada', 'Saida') NOT NULL,
    quantidade INT NOT NULL,
    dataMovimentacao DATE NOT NULL,
    idProduto INT,
    idUsuario INT,
    FOREIGN KEY (idProduto) REFERENCES Produtos(idProduto),
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario)
);

-- Inserts: Usuários (5) com e-mails @gmail.com
INSERT INTO Usuarios (nomeUsuario, login, senha) VALUES
('Joana Almoxarifado', 'joana.almoxarifado@gmail.com', 'senha_hash1'),
('Rafael Gerente', 'rafael.gerente@gmail.com', 'senha_hash2'),
('Carlos Estagiario', 'carlos.estagiario@gmail.com', 'senha_hash3'),
('Mariana Supervisora', 'mariana.supervisora@gmail.com', 'senha_hash4'),
('Bruno Operacional', 'bruno.operacional@gmail.com', 'senha_hash5');

-- Inserts: Produtos (5)
INSERT INTO Produtos (nome, descricao, unidadeMedida, estoqueAtual, estoqueMinimo, dataValidade, caracteristicaVariacao) VALUES
('Cimento CP II-F 50kg', 'Cimento para construção estrutural', 'Saco', 12, 20, '2026-08-30', 'Tipo: Estrutural'),
('Tinta Acrílica Premium 18L', 'Acabamento fosco, uso interno', 'Lata', 8, 5, NULL, 'Cor: Branco Neve'),
('Barra de Aço CA-50 8mm', 'Barra metálica para vigas', 'Barra', 100, 50, NULL, 'Diâmetro: 8mm'),
('Areia Média Ensacada 20kg', 'Areia tratada e peneirada', 'Saco', 30, 15, NULL, 'Granulação: Média'),
('Brita 1 Ensacada 25kg', 'Pedra britada para concreto', 'Saco', 18, 10, NULL, 'Tipo: N° 1');

-- Inserts: Movimentações (5)
INSERT INTO Movimentacao (tipoMovimentacao, quantidade, dataMovimentacao, idProduto, idUsuario) VALUES
('Entrada', 50,  '2025-11-20', 1, 1),
('Saida',   10,  '2025-11-21', 2, 2),
('Entrada', 40,  '2025-11-22', 3, 4),
('Saida',   15,  '2025-11-23', 4, 5),
('Entrada', 20,  '2025-11-24', 5, 3);
