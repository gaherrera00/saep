// Classe de erro customizada para a API
export class ApiError extends Error {
    constructor(mensagem, statusCode = 500, detalhes = null) {
        super(mensagem);
        this.statusCode = statusCode;
        this.detalhes = detalhes;
        this.timestamp = new Date().toISOString();
        this.name = 'ApiError';
        
        // Mantém o stack trace
        Error.captureStackTrace(this, this.constructor);
    }
    
    // Método estático para erros de validação
    static validacao(mensagem, detalhes = null) {
        return new ApiError(mensagem, 400, detalhes);
    }
    
    // Método estático para erros não encontrados
    static naoEncontrado(recurso = 'Recurso') {
        return new ApiError(`${recurso} não encontrado`, 404);
    }
    
    // Método estático para erros de autenticação
    static naoAutorizado(mensagem = 'Não autorizado') {
        return new ApiError(mensagem, 401);
    }
    
    // Método estático para erros de acesso negado
    static acessoNegado(mensagem = 'Acesso negado') {
        return new ApiError(mensagem, 403);
    }
    
    // Método estático para erros internos
    static erroInterno(mensagem = 'Erro interno do servidor') {
        return new ApiError(mensagem, 500);
    }
    
    // Converter para formato JSON de resposta
    toJSON() {
        return {
            sucesso: false,
            erro: this.name,
            mensagem: this.message,
            statusCode: this.statusCode,
            timestamp: this.timestamp,
            ...(this.detalhes && { detalhes: this.detalhes })
        };
    }
}

