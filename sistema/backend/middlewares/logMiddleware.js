import { create } from '../config/database.js';

// Middleware para registrar logs de acesso
export const logMiddleware = async (req, res, next) => {
    const startTime = Date.now();
    
    // Capturar dados da requisição (sem usuario_id ainda, será capturado na resposta)
    const logData = {
        rota: req.originalUrl,
        metodo: req.method,
        ip_address: req.ip || req.connection.remoteAddress || req.socket.remoteAddress,
        user_agent: req.get('User-Agent'),
        dados_requisicao: {
            headers: {
                'content-type': req.get('Content-Type'),
                'authorization': req.get('Authorization') ? 'Bearer [REDACTED]' : null,
                'user-agent': req.get('User-Agent')
            },
            body: req.method !== 'GET' ? sanitizeRequestBody(req.body) : null,
            query: Object.keys(req.query).length > 0 ? req.query : null
        }
    };

    // Interceptar a resposta para capturar status code, tempo e usuário (após authMiddleware executar)
    const originalSend = res.send;
    const originalJson = res.json;
    
    res.send = function(data) {
        // Capturar dados atualizados no momento da resposta (após todos os middlewares executarem)
        const finalLogData = {
            ...logData,
            status_code: res.statusCode,
            tempo_resposta_ms: Date.now() - startTime
        };
        
        // Capturar usuário se autenticado (após authMiddleware ter executado)
        if (req.usuario && req.usuario.id) {
            finalLogData.usuario_id = req.usuario.id;
        }
        
        // Capturar dados da resposta (limitado para evitar logs muito grandes)
        if (res.statusCode >= 400) {
            finalLogData.dados_resposta = {
                error: true,
                status: res.statusCode,
                message: typeof data === 'string' ? data.substring(0, 500) : data
            };
        }
        
        
        return originalSend.call(this, data);
    };
    
    res.json = function(data) {
        // Capturar dados atualizados no momento da resposta (após todos os middlewares executarem)
        const finalLogData = {
            ...logData,
            status_code: res.statusCode,
            tempo_resposta_ms: Date.now() - startTime
        };
        
        // Capturar usuário se autenticado (após authMiddleware ter executado)
        if (req.usuario && req.usuario.id) {
            finalLogData.usuario_id = req.usuario.id;
        }
        
        // Capturar dados da resposta (limitado para evitar logs muito grandes)
        if (res.statusCode >= 400) {
            finalLogData.dados_resposta = {
                error: true,
                status: res.statusCode,
                message: typeof data === 'object' ? JSON.stringify(data).substring(0, 500) : data
            };
        }
        
        
        return originalJson.call(this, data);
    };

    next();
};

// Função para sanitizar dados sensíveis do body
function sanitizeRequestBody(body) {
    if (!body || typeof body !== 'object') return body;
    
    const sanitized = { ...body };
    
    // Remover campos sensíveis
    const sensitiveFields = ['senha', 'password', 'token', 'authorization'];
    sensitiveFields.forEach(field => {
        if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
        }
    });
    
    return sanitized;
}

// Middleware para logs simples (apenas console)
export const simpleLogMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const usuario = req.usuario ? `[${req.usuario.email}]` : '[Anônimo]';
    
    console.log(`${timestamp} - ${req.method} ${req.originalUrl} ${usuario} - IP: ${req.ip || 'N/A'}`);
    
    next();
};
