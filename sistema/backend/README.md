# API de Produtos - Sistema de Gestão

Uma API RESTful completa para gestão de produtos desenvolvida com Node.js, Express e MySQL.

## Características

- Arquitetura MVC completa
- Autenticação JWT com middleware
- Upload de imagens com validação
- Validações manuais robustas
- Migrations com padrão timestamp
- Configuração .env para ambiente
- Tratamento de erros centralizado
- Documentação completa das rotas

## Instalação e Configuração

### 1. Pré-requisitos
- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)
- npm ou yarn

### 2. Instalação das Dependências
```bash
npm install
```

### 3. Configuração do Banco de Dados

#### 3.1. Configurar arquivo .env
Copie o arquivo `env.example` para `.env` e configure suas credenciais:

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações do MySQL (ou use `env.example` como base):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=produtos_api
PORT=3001
NODE_ENV=development
JWT_SECRET=change_me_for_production
JWT_EXPIRES_IN=1h
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif
PAGINACAO_LIMITE_MAXIMO=100
```

### 4. Executar Migrations

Execute os arquivos SQL na ordem correta no MySQL:

1. **20251028_001_create_database.sql** - Cria o banco de dados
2. **20251028_002_create_table_usuarios.sql** - Cria tabela de usuários
3. **20251028_003_create_table_produtos.sql** - Cria tabela de produtos
4. **20251028_004_insert_dados_iniciais.sql** - Insere dados iniciais
5. **20251028_005_create_table_logs.sql** - Cria tabela de logs


### 5. Iniciar o Servidor

```bash
npm start
```

O servidor estará rodando em `http://localhost:3001`

## Credenciais de Teste

Após executar as migrations, você terá os seguintes usuários:

- **Admin**: `admin@produtos.com` / `123456`
- **Usuário comum**: `joao@email.com` / `123456`
- **Usuária comum**: `maria@email.com` / `123456`

## Testes da API

### Teste 1: Login (Autenticação)

/* Este teste realiza o login do usuário administrador para obter o token JWT necessário para acessar as rotas protegidas da API */
// Login do usuário admin para obter token JWT
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@produtos.com",
    "senha": "123456"
  }'
```
/*
Resultado esperado:
{
  "sucesso": true,
  "mensagem": "Login realizado com sucesso",
  "dados": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 1,
      "nome": "Administrador",
      "email": "admin@produtos.com",
      "tipo": "admin"
    }
  }
}
*/

-----

### Teste 2: Listar Todos os Produtos (GET)

/* Este teste lista todos os produtos cadastrados no sistema, não requer autenticação */
// Listar todos os produtos
```bash
curl -X GET http://localhost:3001/api/produtos
```

/* Listar produtos com paginacao (pagina 1, 5 itens por pagina) */
```bash
curl -X GET "http://localhost:3001/api/produtos?pagina=1&limite=5"
```
/*
Resultado esperado (com paginacao):
{
  "sucesso": true,
  "dados": [
    {
      "id": 1,
      "nome": "Smartphone Galaxy",
      "descricao": "Celular Samsung Galaxy com 128GB",
      "preco": 1299.99,
      "categoria": "Eletronicos",
      "imagem": "smartphone.jpg"
    },
    {
      "id": 2,
      "nome": "Notebook Dell",
      "descricao": "Notebook Dell Inspiron 15 polegadas",
      "preco": 2499.99,
      "categoria": "Eletronicos",
      "imagem": "notebook.jpg"
    }
  ],
  "paginacao": {
    "pagina": 1,
    "limite": 5,
    "total": 16,
    "totalPaginas": 4
  }
}
*/

-----

### Teste 3: Buscar Produto por ID (GET)

/* Este teste busca um produto específico pelo seu ID, não requer autenticação */
// Buscar produto por ID
```bash
curl -X GET http://localhost:3001/api/produtos/1
```
/*
Resultado esperado:
{
  "sucesso": true,
  "dados": {
    "id": 1,
    "nome": "Smartphone Galaxy",
    "descricao": "Celular Samsung Galaxy com 128GB",
    "preco": 1299.99,
    "categoria": "Eletrônicos",
    "imagem": "smartphone.jpg"
  }
}
*/

-----

### Teste 4: Criar Novo Produto (POST)

/* Este teste cria um novo produto no sistema, requer autenticação com token JWT */
// Criar novo produto (requer token JWT)
```bash
curl -X POST http://localhost:3001/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "Mouse Gamer",
    "descricao": "Mouse gamer com 5 botoes programaveis",
    "preco": 89.90,
    "categoria": "Perifericos"
  }'
```
/*
Resultado esperado:
{
  "sucesso": true,
  "mensagem": "Produto criado com sucesso",
  "dados": {
    "id": 5,
    "nome": "Mouse Gamer",
    "descricao": "Mouse gamer com 5 botoes programaveis",
    "preco": 89.90,
    "categoria": "Perifericos",
    "imagem": null
  }
}
*/

-----

### Teste 5: Atualizar Produto (PUT)

/* Este teste atualiza um produto existente, requer autenticação com token JWT */
// Atualizar produto existente (requer token JWT)
```bash
curl -X PUT http://localhost:3001/api/produtos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "Smartphone Galaxy Pro",
    "preco": 1399.99
  }'
```
/*
Resultado esperado:
{
  "sucesso": true,
  "mensagem": "Produto atualizado com sucesso",
  "dados": {
    "linhasAfetadas": 1
  }
}
*/

-----

### Teste 6: Excluir Produto (DELETE)

/* Este teste exclui um produto do sistema, requer autenticação com token JWT */
// Excluir produto (requer token JWT)
```bash
curl -X DELETE http://localhost:3001/api/produtos/5 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```
/*
Resultado esperado:
{
  "sucesso": true,
  "mensagem": "Produto excluído com sucesso",
  "dados": {
    "linhasAfetadas": 1
  }
}
*/

-----

### Teste 7: Upload de Imagem (POST)

/* Este teste faz upload de uma imagem para um produto, requer autenticação com token JWT */
// Upload de imagem para produto (requer token JWT)
```bash
curl -X POST http://localhost:3001/api/produtos/upload \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "imagem=@caminho/para/sua/imagem.jpg" \
  -F "produto_id=1"
```
/*
Resultado esperado:
{
  "sucesso": true,
  "mensagem": "Imagem enviada com sucesso",
  "dados": {
    "nomeArquivo": "imagem-1234567890.jpg",
    "caminho": "/uploads/imagem-1234567890.jpg"
  }
}
*/

-----

### Teste 8: Listar Usuários (GET)

/* Este teste lista todos os usuários cadastrados, requer autenticação com token JWT de admin */
// Listar usuários (requer token JWT de admin)
```bash
curl -X GET http://localhost:3001/api/usuarios \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```
/*
Resultado esperado (com paginacao):
{
  "sucesso": true,
  "dados": [
    {
      "id": 1,
      "nome": "Administrador",
      "email": "admin@produtos.com",
      "tipo": "admin"
    },
    {
      "id": 2,
      "nome": "João Silva",
      "email": "joao@email.com",
      "tipo": "comum"
    }
  ],
  "paginacao": {
    "pagina": 1,
    "limite": 10,
    "total": 3,
    "totalPaginas": 1
  }
}
*/

/* Listar usuarios com paginacao (pagina 1, 2 itens por pagina) */
```bash
curl -X GET "http://localhost:3001/api/usuarios?pagina=1&limite=2" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

-----

### Teste 9: Criar Novo Usuário (POST)

/* Este teste cria um novo usuário no sistema, requer autenticação com token JWT de admin */
// Criar novo usuário (requer token JWT de admin)
```bash
curl -X POST http://localhost:3001/api/usuarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "Pedro Santos",
    "email": "pedro@email.com",
    "senha": "123456",
    "tipo": "comum"
  }'
```
/*
Resultado esperado:
{
  "sucesso": true,
  "mensagem": "Usuário criado com sucesso",
  "dados": {
    "id": 4,
    "nome": "Pedro Santos",
    "email": "pedro@email.com",
    "tipo": "comum"
  }
}
*/

-----

### Teste 10: Teste de Validação (POST com dados inválidos)

/* Este teste demonstra como a API valida dados inválidos e retorna erros apropriados */
// Teste de validação com dados inválidos
```bash
curl -X POST http://localhost:3001/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "",
    "preco": -100
  }'
```
/*
Resultado esperado:
{
  "sucesso": false,
  "erro": "Dados inválidos",
  "detalhes": [
    {
      "campo": "nome",
      "mensagem": "Nome é obrigatório"
    },
    {
      "campo": "preco",
      "mensagem": "Preço deve ser um número positivo"
    }
  ]
}
*/

-----

### Teste 11: Acesso Negado (Token Inválido)

/* Este teste demonstra como a API responde quando um token JWT inválido é fornecido */
// Teste de acesso negado com token inválido
```bash
curl -X GET http://localhost:3001/api/usuarios \
  -H "Authorization: Bearer token_invalido"
```
/*
Resultado esperado:
{
  "sucesso": false,
  "erro": "Token inválido",
  "mensagem": "Token de acesso inválido ou expirado"
}
*/

-----

### Teste 12: Preflight Request (OPTIONS)

/* Este teste demonstra como fazer uma requisição OPTIONS para verificar permissões CORS antes de fazer requisições reais */
// Verificar permissoes CORS antes de criar produto
```bash
curl -X OPTIONS http://localhost:3001/api/produtos \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization"
```
/*
Resultado esperado:
Status: 200 OK
Headers:
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
*/

-----

## Rotas da API

### Autenticação
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/registrar` - Registrar novo usuário
- `GET /api/auth/perfil` - Obter perfil do usuário logado

### Produtos
- `GET /api/produtos` - Listar todos os produtos (suporta paginação: ?pagina=1&limite=10)
- `GET /api/produtos/:id` - Buscar produto por ID
- `POST /api/produtos` - Criar novo produto (requer autenticação)
- `PUT /api/produtos/:id` - Atualizar produto (requer autenticação)
- `DELETE /api/produtos/:id` - Excluir produto (requer autenticação)
- `POST /api/produtos/upload` - Upload de imagem (requer autenticação)

### Usuários (Apenas Admin)
- `GET /api/usuarios` - Listar usuários (requer autenticação admin, suporta paginação: ?pagina=1&limite=10)
- `POST /api/usuarios` - Criar usuário (requer autenticação admin)
- `PUT /api/usuarios/:id` - Atualizar usuário (requer autenticação admin)
- `DELETE /api/usuarios/:id` - Excluir usuário (requer autenticação admin)

### Criptografia (Educacional)
- `GET /api/criptografia/info` - Informações sobre criptografia de senhas
- `POST /api/criptografia/cadastrar-usuario` - Cadastrar usuário com demonstração de criptografia

### CORS (OPTIONS)
- `OPTIONS /api/*` - Requisições preflight para verificar permissões CORS

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autenticado
- `403` - Acesso negado
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

## Estrutura do Projeto

```
api-produtos/
├── config/
│   ├── database.js
│   └── jwt.js
├── controllers/
│   ├── AuthController.js
│   ├── ProdutoController.js
│   └── CriptografiaController.js
├── middlewares/
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
├── models/
│   ├── ProdutoModel.js
│   └── UsuarioModel.js
├── routes/
│   ├── authRotas.js
│   ├── produtoRotas.js
│   └── criptografiaRotas.js
├── migrations/
│   ├── 20250115_001_create_database.sql
│   ├── 20250115_002_create_table_usuarios.sql
│   ├── 20250115_003_create_table_produtos.sql
│   └── 20250115_004_insert_dados_iniciais.sql
├── uploads/
├── app.js
├── package.json
└── README.md
```