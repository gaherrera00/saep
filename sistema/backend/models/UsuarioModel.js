import { create, read, update, deleteRecord, comparePassword, hashPassword, getConnection } from '../config/database.js';

// Model para operações com usuários
class UsuarioModel {
    // Listar todos os usuários (com paginação)
    static async listarTodos(pagina = 1, limite = 10) {
        try {
            const offset = (pagina - 1) * limite;
            
            // Buscar usuários com paginação (usando prepared statements para segurança)
            const connection = await getConnection();
            try {
                const sql = 'SELECT * FROM usuarios ORDER BY id DESC LIMIT ? OFFSET ?';
                const [usuarios] = await connection.execute(sql, [limite, offset]);
                
                // Contar total de registros
                const [totalResult] = await connection.execute('SELECT COUNT(*) as total FROM usuarios');
                const total = totalResult[0].total;
                
                return {
                    usuarios,
                    total,
                    pagina,
                    limite,
                    totalPaginas: Math.ceil(total / limite)
                };
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            throw error;
        }
    }

    // Buscar usuário por ID
    static async buscarPorId(id) {
        try {
            const rows = await read('usuarios', `id = ${id}`);
            return rows[0] || null;
        } catch (error) {
            console.error('Erro ao buscar usuário por ID:', error);
            throw error;
        }
    }

    // Buscar usuário por email
    static async buscarPorEmail(email) {
        try {
            const rows = await read('usuarios', `email = '${email}'`);
            return rows[0] || null;
        } catch (error) {
            console.error('Erro ao buscar usuário por email:', error);
            throw error;
        }
    }

    // Criar novo usuário
    static async criar(dadosUsuario) {
        try {
            // Hash da senha antes de salvar
            const senhaHash = await hashPassword(dadosUsuario.senha);
            const dadosComHash = {
                ...dadosUsuario,
                senha: senhaHash
            };
            
            return await create('usuarios', dadosComHash);
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    }

    // Atualizar usuário
    static async atualizar(id, dadosUsuario) {
        try {
            // Se a senha foi fornecida, fazer hash
            if (dadosUsuario.senha) {
                dadosUsuario.senha = await hashPassword(dadosUsuario.senha);
            }
            
            return await update('usuarios', dadosUsuario, `id = ${id}`);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    }

    // Excluir usuário
    static async excluir(id) {
        try {
            return await deleteRecord('usuarios', `id = ${id}`);
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            throw error;
        }
    }

    // Verificar credenciais de login
    static async verificarCredenciais(email, senha) {
        try {
            const usuario = await this.buscarPorEmail(email);
            
            if (!usuario) {
                return null;
            }

            const senhaValida = await comparePassword(senha, usuario.senha);
            
            if (!senhaValida) {
                return null;
            }

            // Retornar usuário sem a senha
            const { senha: _, ...usuarioSemSenha } = usuario;
            return usuarioSemSenha;
        } catch (error) {
            console.error('Erro ao verificar credenciais:', error);
            throw error;
        }
    }
}

export default UsuarioModel;
