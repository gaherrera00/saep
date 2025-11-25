import { getConnection } from '../config/database.js';
import MovimentacaoModel from '../models/MovimentacaoModel.js';

class MovimentacaoController {
    // POST /produtos/:id/movimentacoes
    static async criarMovimentacao(req, res) {
        const connection = await getConnection();
        try {
            const { id } = req.params;
            const { tipo, quantidade, observacao } = req.body;

            // Validações básicas
            if (!id || isNaN(id)) {
                return res.status(400).json({ sucesso: false, erro: 'ID inválido', mensagem: 'ID do produto inválido' });
            }

            const tipoLower = (tipo || '').toString().toLowerCase();
            if (tipoLower !== 'entrada' && tipoLower !== 'saida') {
                return res.status(400).json({ sucesso: false, erro: 'Tipo inválido', mensagem: "O campo 'tipo' deve ser 'entrada' ou 'saida'" });
            }

            const qtd = parseInt(quantidade);
            if (isNaN(qtd) || qtd <= 0) {
                return res.status(400).json({ sucesso: false, erro: 'Quantidade inválida', mensagem: 'A quantidade deve ser um número inteiro maior que zero' });
            }

            await connection.beginTransaction();

            const [rows] = await connection.execute('SELECT * FROM Produtos WHERE idProduto = ? FOR UPDATE', [id]);
            const produto = rows[0];

            if (!produto) {
                await connection.rollback();
                return res.status(404).json({ sucesso: false, erro: 'Produto não encontrado', mensagem: `Produto com ID ${id} não encontrado` });
            }

            const estoqueAtual = parseInt(produto.estoqueAtual || 0);
            const estoqueMinimo = parseInt(produto.estoqueMinimo || 0);

            let novoEstoque = estoqueAtual;
            if (tipoLower === 'entrada') {
                novoEstoque = estoqueAtual + qtd;
            } else {
                // saída
                if (qtd > estoqueAtual) {
                    await connection.rollback();
                    return res.status(409).json({ sucesso: false, erro: 'Estoque insuficiente', mensagem: 'Quantidade maior que o estoque atual' });
                }
                novoEstoque = estoqueAtual - qtd;
            }

            await connection.execute('UPDATE Produtos SET estoqueAtual = ? WHERE idProduto = ?', [novoEstoque, id]);

            // Inserir movimentação
            const tipoDb = tipoLower === 'entrada' ? 'Entrada' : 'Saida';
            const dataMov = new Date();
            const [insertResult] = await connection.execute(
                'INSERT INTO Movimentacao (tipoMovimentacao, quantidade, dataMovimentacao, idProduto, idUsuario) VALUES (?, ?, ?, ?, ?)',
                [tipoDb, qtd, dataMov, id, req.usuario ? req.usuario.id : null]
            );

            await connection.commit();

            const alerta = novoEstoque < estoqueMinimo;

            res.status(201).json({
                sucesso: true,
                mensagem: 'Movimentação registrada com sucesso',
                dados: {
                    movimentacaoId: insertResult.insertId,
                    id_produto: parseInt(id),
                    tipo: tipoDb,
                    quantidade: qtd,
                    data_movimentacao: dataMov,
                    estoque_atual: novoEstoque,
                    alerta,
                    mensagem_alerta: alerta ? 'Produto abaixo do estoque mínimo' : null
                }
            });
        } catch (error) {
            try { await connection.rollback(); } catch (e) { /* ignore */ }
            console.error('Erro ao criar movimentacao:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno', mensagem: 'Não foi possível registrar a movimentação' });
        } finally {
            connection.release();
        }
    }
}

export default MovimentacaoController;
