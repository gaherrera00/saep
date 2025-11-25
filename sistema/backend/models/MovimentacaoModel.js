import { create } from '../config/database.js';

class MovimentacaoModel {
    // Inserir movimentação simples (não transacional)
    static async criar(dadosMovimentacao) {
        try {
            // Espera-se campos: tipo_movimentacao, quantidade, data_movimentacao, id_produto, id_usuario
            return await create('movimentacao', dadosMovimentacao);
        } catch (error) {
            console.error('Erro ao criar movimentacao:', error);
            throw error;
        }
    }
}

export default MovimentacaoModel;
