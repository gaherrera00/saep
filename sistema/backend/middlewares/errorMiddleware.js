import { ApiError } from '../utils/ApiError.js';

// Middleware centralizado para tratamento de erros
export const errorMiddleware = (error, req, res, next) => {
    // Se for um ApiError, usar seus dados
    if (error instanceof ApiError) {
        return res.status(error.statusCode).json(error.toJSON());
    }
    
    // Se for erro de validação do multer (upload)
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            sucesso: false,
            erro: 'Arquivo muito grande',
            mensagem: `Tamanho máximo permitido: ${error.limit / 1024 / 1024}MB`
        });
    }
    
    // Se for erro de token JWT
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            sucesso: false,
            erro: 'Token inválido',
            mensagem: 'Token de autenticação inválido'
        });
    }
    
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            sucesso: false,
            erro: 'Token expirado',
            mensagem: 'Faça login novamente'
        });
    }
    
    // Se for erro de sintaxe JSON
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({
            sucesso: false,
            erro: 'JSON inválido',
            mensagem: 'O JSON enviado está malformado'
        });
    }
    
    // Erro genérico - logar detalhes mas não expor para o cliente
    console.error('Erro não tratado:', {
        mensagem: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    
    // Retornar erro genérico
    res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
        mensagem: process.env.NODE_ENV === 'development' 
            ? error.message 
            : 'Ocorreu um erro inesperado no servidor'
    });
};

