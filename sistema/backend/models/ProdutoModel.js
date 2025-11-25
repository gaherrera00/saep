import { create, read, update, deleteRecord, getConnection } from '../config/database.js';

// Model para operações com produtos
class ProdutoModel {
    // Listar todos os produtos (com paginação)
    static async listarTodos(pagina = 1, limite = 10, search = null) {
        try {
            const offset = (pagina - 1) * limite;
            
            // Buscar produtos com paginação (usando prepared statements para segurança)
            const connection = await getConnection();
            try {
                // Suporta busca por nome (case-insensitive) e ordenação alfabética A-Z
                let sql;
                let params = [];
                if (search && search.trim() !== '') {
                    sql = 'SELECT * FROM Produtos WHERE nome LIKE ? ORDER BY nome ASC LIMIT ? OFFSET ?';
                    params = [`%${search.trim()}%`, limite, offset];
                } else {
                    sql = 'SELECT * FROM Produtos ORDER BY nome ASC LIMIT ? OFFSET ?';
                    params = [limite, offset];
                }

                const [produtos] = await connection.execute(sql, params);
                
                // Contar total de registros
                let totalResult;
                if (search && search.trim() !== '') {
                    [totalResult] = await connection.execute('SELECT COUNT(*) as total FROM Produtos WHERE nome LIKE ?', [`%${search.trim()}%`]);
                } else {
                    [totalResult] = await connection.execute('SELECT COUNT(*) as total FROM Produtos');
                }
                const total = totalResult[0].total;
                
                return {
                    produtos,
                    total,
                    pagina,
                    limite,
                    totalPaginas: Math.ceil(total / limite)
                };
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao listar produtos:', error);
            throw error;
        }
    }

    // Buscar produto por ID
    static async buscarPorId(id) {
        try {
            const rows = await read('Produtos', `idProduto = ${id}`);
            return rows[0] || null;
        } catch (error) {
            console.error('Erro ao buscar produto por ID:', error);
            throw error;
        }
    }

    // Criar novo produto
    static async criar(dadosProduto) {
        try {
            return await create('Produtos', dadosProduto);
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            throw error;
        }
    }

    // Atualizar produto
    static async atualizar(id, dadosProduto) {
        try {
            return await update('Produtos', dadosProduto, `idProduto = ${id}`);
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            throw error;
        }
    }

    // Excluir produto
    static async excluir(id) {
        try {
            return await deleteRecord('Produtos', `idProduto = ${id}`);
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            throw error;
        }
    }

    // Buscar produtos por categoria
    static async buscarPorCategoria(categoria) {
        try {
            return await read('Produtos', `categoria = '${categoria}'`);
        } catch (error) {
            console.error('Erro ao buscar produtos por categoria:', error);
            throw error;
        }
    }
}

export default ProdutoModel;
