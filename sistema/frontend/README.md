# Frontend – SAEP

Interface web do Sistema de Administração de Estoque e Produtos, construída com Next.js 16 (App Router) e estilizada com Tailwind CSS.

## Principais recursos
- Login e guarda de rotas com JWT armazenado de forma segura.
- Listagem, filtro e edição de produtos e estoque com feedbacks instantâneos.
- Componentes reutilizáveis, formulários validados e diálogos modais para fluxos críticos.
- Utilização de `next-themes`, animações leves e ícones Lucide para uma UX mais clara.

## Requisitos
- Node.js 18+
- npm

## Como rodar
1. Instalar dependências:
   ```bash
   npm install
   ```
2. Definir a URL da API em `src/lib/utils.js` (variável `API_BASE_URL`, padrão `http://localhost:3001`) se precisar apontar para outro host/porta.
3. Iniciar o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acessar `http://localhost:3000` no navegador.

## Estrutura rápida
- `src/app` — rotas e páginas (App Router).
- `src/components` — componentes reutilizáveis e guardas de autenticação.
- `src/lib/utils.js` — helpers compartilhados (ex.: base da API e formatadores).

## Boas práticas recomendadas
- Mantenha o token apenas em cookies/headers e evite armazenamento persistente inseguro.
- Valide dados antes de enviar para a API e exiba mensagens claras de erro.
- Utilize o fluxo de toast e loading para manter o usuário informado sobre ações longas.
