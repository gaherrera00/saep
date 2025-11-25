import ProdutoModel from '../models/ProdutoModel.js';
import { fileURLToPath } from 'url';
import path from 'path';
import { removerArquivoAntigo } from '../middlewares/uploadMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Controller para operações com produtos
class ProdutoController {
    
    // GET /produtos - Listar todos os produtos (com paginação)
    static async listarTodos(req, res) {
        try {
            // Obter parâmetros de paginação da query string
            const paginaParam = req.query.pagina;
            const limiteParam = req.query.limite;
            
            // Validar e converter página
            let pagina = 1;
            if (paginaParam !== undefined && paginaParam !== null && paginaParam !== '') {
                pagina = parseInt(paginaParam);
                if (isNaN(pagina) || pagina <= 0) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Página inválida',
                        mensagem: 'A página deve ser um número maior que zero'
                    });
                }
            }
            
            // Validar e converter limite
            let limite = 10;
            if (limiteParam !== undefined && limiteParam !== null && limiteParam !== '') {
                limite = parseInt(limiteParam);
                if (isNaN(limite) || limite <= 0) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Limite inválido',
                        mensagem: 'O limite deve ser um número maior que zero'
                    });
                }
            }
            
            const limiteMaximo = parseInt(process.env.PAGINACAO_LIMITE_MAXIMO) || 100;
            if (limite > limiteMaximo) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: `O limite deve ser um número entre 1 e ${limiteMaximo}`
                });
            }
            
            const resultado = await ProdutoModel.listarTodos(pagina, limite);
            
            res.status(200).json({
                sucesso: true,
                dados: resultado.produtos,
                paginacao: {
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    total: resultado.total,
                    totalPaginas: resultado.totalPaginas
                }
            });
        } catch (error) {
            console.error('Erro ao listar produtos:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar os produtos'
            });
        }
    }

    // GET /produtos/:id - Buscar produto por ID
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            
            // Validação básica do ID
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            const produto = await ProdutoModel.buscarPorId(id);
            
            if (!produto) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Produto não encontrado',
                    mensagem: `Produto com ID ${id} não foi encontrado`
                });
            }

            res.status(200).json({
                sucesso: true,
                dados: produto
            });
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível buscar o produto'
            });
        }
    }

    // POST /produtos - Criar novo produto
    static async criar(req, res) {
        try {
            const { nome, descricao, preco, categoria } = req.body;
            
            // Validações manuais - coletar todos os erros
            const erros = [];
            
            // Validar nome
            if (!nome || nome.trim() === '') {
                erros.push({
                    campo: 'nome',
                    mensagem: 'Nome é obrigatório'
                });
            } else {
                if (nome.trim().length < 3) {
                    erros.push({
                        campo: 'nome',
                        mensagem: 'O nome deve ter pelo menos 3 caracteres'
                    });
                }
                
                if (nome.trim().length > 255) {
                    erros.push({
                        campo: 'nome',
                        mensagem: 'O nome deve ter no máximo 255 caracteres'
                    });
                }
            }

            // Validar preço
            if (!preco || isNaN(preco) || preco <= 0) {
                erros.push({
                    campo: 'preco',
                    mensagem: 'Preço deve ser um número positivo'
                });
            }

            // Se houver erros, retornar todos de uma vez
            if (erros.length > 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Dados inválidos',
                    detalhes: erros
                });
            }

            // Preparar dados do produto
            const dadosProduto = {
                nome: nome.trim(),
                descricao: descricao ? descricao.trim() : null,
                preco: parseFloat(preco),
                categoria: categoria ? categoria.trim() : 'Geral'
            };

            // Adicionar imagem se foi enviada
            if (req.file) {
                dadosProduto.imagem = req.file.filename;
            }

            const produtoId = await ProdutoModel.criar(dadosProduto);
            
            res.status(201).json({
                sucesso: true,
                mensagem: 'Produto criado com sucesso',
                dados: {
                    id: produtoId,
                    ...dadosProduto
                }
            });
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível criar o produto'
            });
        }
    }

    // PUT /produtos/:id - Atualizar produto
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao, preco, categoria } = req.body;
            
            // Validação do ID
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            // Verificar se o produto existe
            const produtoExistente = await ProdutoModel.buscarPorId(id);
            if (!produtoExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Produto não encontrado',
                    mensagem: `Produto com ID ${id} não foi encontrado`
                });
            }

            // Preparar dados para atualização
            const dadosAtualizacao = {};
            
            if (nome !== undefined) {
                if (nome.trim() === '') {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Nome inválido',
                        mensagem: 'O nome não pode estar vazio'
                    });
                }
                dadosAtualizacao.nome = nome.trim();
            }

            if (preco !== undefined) {
                if (isNaN(preco) || preco <= 0) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Preço inválido',
                        mensagem: 'O preço deve ser um número maior que zero'
                    });
                }
                dadosAtualizacao.preco = parseFloat(preco);
            }

            if (descricao !== undefined) {
                dadosAtualizacao.descricao = descricao ? descricao.trim() : null;
            }

            if (categoria !== undefined) {
                dadosAtualizacao.categoria = categoria ? categoria.trim() : 'Geral';
            }

            // Adicionar nova imagem se foi enviada
            if (req.file) {
                // Remover imagem antiga se existir
                if (produtoExistente.imagem) {
                    await removerArquivoAntigo(produtoExistente.imagem, 'imagem');
                }
                dadosAtualizacao.imagem = req.file.filename;
            }

            // Verificar se há dados para atualizar
            if (Object.keys(dadosAtualizacao).length === 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nenhum dado para atualizar',
                    mensagem: 'Forneça pelo menos um campo para atualizar'
                });
            }

            const resultado = await ProdutoModel.atualizar(id, dadosAtualizacao);
            
            res.status(200).json({
                sucesso: true,
                mensagem: 'Produto atualizado com sucesso',
                dados: {
                    linhasAfetadas: resultado.affectedRows || 1
                }
            });
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível atualizar o produto'
            });
        }
    }

    // DELETE /produtos/:id - Excluir produto
    static async excluir(req, res) {
        try {
            const { id } = req.params;
            
            // Validação do ID
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            // Verificar se o produto existe
            const produtoExistente = await ProdutoModel.buscarPorId(id);
            if (!produtoExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Produto não encontrado',
                    mensagem: `Produto com ID ${id} não foi encontrado`
                });
            }

            // Remover imagem do produto se existir
            if (produtoExistente.imagem) {
                await removerArquivoAntigo(produtoExistente.imagem, 'imagem');
            }

            const resultado = await ProdutoModel.excluir(id);
            
            res.status(200).json({
                sucesso: true,
                mensagem: 'Produto excluído com sucesso',
                dados: {
                    linhasAfetadas: resultado || 1
                }
            });
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível excluir o produto'
            });
        }
    }

    // POST /produtos/upload - Upload de imagem para produto
    static async uploadImagem(req, res) {
        try {
            const { produto_id } = req.body;
            
            // Validações básicas
            if (!produto_id || isNaN(produto_id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID de produto inválido',
                    mensagem: 'O ID do produto é obrigatório e deve ser um número válido'
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Imagem não fornecida',
                    mensagem: 'É necessário enviar uma imagem'
                });
            }

            // Verificar se o produto existe
            const produtoExistente = await ProdutoModel.buscarPorId(produto_id);
            if (!produtoExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Produto não encontrado',
                    mensagem: `Produto com ID ${produto_id} não foi encontrado`
                });
            }

            // Remover imagem antiga se existir
            if (produtoExistente.imagem) {
                await removerArquivoAntigo(produtoExistente.imagem, 'imagem');
            }

            // Atualizar produto com a nova imagem
            await ProdutoModel.atualizar(produto_id, { imagem: req.file.filename });
            
            res.status(200).json({
                sucesso: true,
                mensagem: 'Imagem enviada com sucesso',
                dados: {
                    nomeArquivo: req.file.filename,
                    caminho: `/uploads/imagens/${req.file.filename}`
                }
            });
        } catch (error) {
            console.error('Erro ao fazer upload de imagem:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível fazer upload da imagem'
            });
        }
    }
}

export default ProdutoController;

