import express from 'express';
import ProdutoController from '../controllers/ProdutoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { uploadImagens, handleUploadError } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Rotas públicas (não precisam de autenticação)
router.get('/', ProdutoController.listarTodos);
router.get('/:id', ProdutoController.buscarPorId);

// Rotas protegidas (precisam de autenticação)
router.post('/', authMiddleware, uploadImagens.single('imagem'), handleUploadError, ProdutoController.criar);
router.post('/upload', authMiddleware, uploadImagens.single('imagem'), handleUploadError, ProdutoController.uploadImagem);
router.put('/:id', authMiddleware, uploadImagens.single('imagem'), handleUploadError, ProdutoController.atualizar);
router.delete('/:id', authMiddleware, ProdutoController.excluir);

// Rotas OPTIONS para CORS (preflight requests)
router.options('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

router.options('/upload', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

router.options('/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

export default router;

