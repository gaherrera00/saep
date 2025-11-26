# SAEP – Sistema de Administração de Estoque e Produtos

Aplicação completa para controle de estoque e catálogo de produtos, com API Node.js/Express e frontend Next.js. O projeto foi pensado para demonstrar boas práticas de autenticação, validação e UX em um fluxo moderno de gestão de inventário.

## Competências e destaques
- **Arquitetura full-stack**: backend REST em Express/MySQL e frontend em Next.js 16 com Tailwind.
- **Autenticação segura**: fluxo JWT com proteção de rotas e armazenamento seguro de sessão no cliente.
- **Gestão de estoque e produtos**: cadastros, listagens, filtros, movimentações e upload de imagens.
- **UX focada em clareza**: formulários validados, feedbacks rápidos e componentes reutilizáveis.
- **Configuração rápida**: scripts simples para instalar dependências e subir ambos os serviços.

## Estrutura do repositório
- **Branch principal**: `main` concentra todas as melhorias alinhadas entre backend e frontend.
- `sistema/backend`: API REST com Express, MySQL, autenticação JWT e upload de imagens.
- `sistema/frontend`: Frontend em Next.js (App Router), Tailwind CSS e componentes otimizados para desktop/mobile.
- `saep_db.sql`: dump SQL do banco para popular ambiente local.

## Requisitos
- Node.js 18+ (para compatibilidade com Next.js 16 e o watcher do backend)
- MySQL 5.7+ ou MariaDB
- npm

## Como executar
1. **Clonar repositório e instalar dependências**
   ```bash
   npm install --prefix sistema/backend
   npm install --prefix sistema/frontend
   ```

2. **Configurar backend**
   - Copie `sistema/backend/env.example` para `.env` e ajuste credenciais do MySQL.
   - Importe `saep_db.sql` ou rode as migrations em `sistema/backend/migrations`.

3. **Subir serviços**
   - Backend: `npm run start --prefix sistema/backend` (porta padrão: 3001)
   - Frontend: `npm run dev --prefix sistema/frontend` (porta padrão: 3000 — ajuste se necessário)

4. **Acessar aplicação**
   - Frontend: `http://localhost:3000`
   - API base: `http://localhost:3001/api`

## Credenciais de teste
Após importar o banco ou executar as migrations, use:
- **Admin**: `admin@produtos.com` / `123456`
- **Usuário**: `joao@email.com` / `123456`

## Referências rápidas
- Backend detalhado: [`sistema/backend/README.md`](sistema/backend/README.md)
- Frontend detalhado: [`sistema/frontend/README.md`](sistema/frontend/README.md)

## Próximos passos sugeridos
- Adicionar lint/testes automatizados (frontend e backend).
- Publicar imagem Docker para facilitar onboarding.
- Configurar CI para checagem de build e qualidade de código.
