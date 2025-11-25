import express from 'express';
import CriptografiaController from '../controllers/CriptografiaController.js';

const router = express.Router();

/**
 * ROTAS EDUCACIONAIS PARA DEMONSTRAÇÃO DE CRIPTOGRAFIA
 * 
 * Estas rotas são específicas para ensinar aos alunos como implementar
 * criptografia de senhas de forma segura.
 */

// GET /criptografia/info - Informações sobre criptografia
router.get('/info', CriptografiaController.obterInfoCriptografia);

// POST /criptografia/cadastrar-usuario - Demonstração completa de cadastro com criptografia
router.post('/cadastrar-usuario', CriptografiaController.cadastrarUsuario);

// Rotas OPTIONS para CORS (preflight requests)
router.options('/info', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

router.options('/cadastrar-usuario', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

export default router;

