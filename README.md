<p align="center">
    <img src="public/favicon.svg" width="80" alt="Finance Logo">
</p>

<h1 align="center">Finance</h1>

<p align="center">
    Aplicativo web de controle financeiro pessoal completo, com gestão de ganhos, despesas, dívidas, investimentos e metas financeiras.
</p>

<p align="center">
    <a href="https://github.com/ViniiCh4g4s/finance/actions/workflows/laravel.yml">
        <img src="https://github.com/ViniiCh4g4s/finance/actions/workflows/laravel.yml/badge.svg?branch=main" alt="CI Main">
    </a>
    <a href="https://github.com/ViniiCh4g4s/finance/actions/workflows/laravel.yml">
        <img src="https://github.com/ViniiCh4g4s/finance/actions/workflows/laravel.yml/badge.svg?branch=develop" alt="CI Develop">
    </a>
    <img src="https://img.shields.io/badge/PHP-8.4-777BB4?logo=php&logoColor=white" alt="PHP 8.4">
    <img src="https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel&logoColor=white" alt="Laravel 11">
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19">
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
</p>

---

## Sobre o Projeto

O **Finance** é uma aplicacao web para controle financeiro pessoal, permitindo que o usuario gerencie toda sua vida financeira em um unico lugar. O sistema oferece uma visao completa e organizada das financas atraves de um dashboard interativo com filtros por mes, ano e categorias.

### Funcionalidades

- **Ganhos** — Registro de receitas com fonte de renda e recorrencia mensal
- **Despesas Fixas** — Contas recorrentes com controle de status (pendente/pago) e forma de pagamento
- **Despesas Variaveis** — Gastos do dia a dia com suporte a parcelamento e assinaturas recorrentes
- **Dividas** — Acompanhamento de dividas com vencimento, destino e recorrencia
- **Investimentos** — Carteira de investimentos com tipo de ativo, proventos e frequencia
- **Metas Financeiras** — Definicao de metas com acompanhamento visual de progresso e investimento direto
- **Dashboard** — Visao consolidada com balanco mensal, graficos por categoria, fonte e forma de pagamento
- **Filtros** — Navegacao por mes/ano e filtros por coluna em todas as tabelas
- **Paginacao** — Tabelas com paginacao automatica (15 registros por pagina)
- **Recorrencia** — Criacao de registros mensais automaticos ate uma data limite
- **Dados iniciais** — Ao se cadastrar, o usuario recebe categorias, fontes de renda, formas de pagamento e metas pre-configuradas

## Screenshots

<p align="center">
    <img src=".github/screenshots/landing.png" width="100%" alt="Landing Page">
</p>

<p align="center">
    <img src=".github/screenshots/dashboard.png" width="100%" alt="Dashboard">
</p>

<p align="center">
    <img src=".github/screenshots/modal.png" width="100%" alt="Modal de Registro">
</p>

> Para adicionar as screenshots, salve as imagens em `.github/screenshots/` com os nomes `landing.png`, `dashboard.png` e `modal.png`.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Laravel 11, PHP 8.4 |
| Frontend | React 19, TypeScript, Inertia.js |
| Estilizacao | Tailwind CSS 4, shadcn/ui |
| Banco de Dados | MySQL |
| Autenticacao | Laravel Fortify (2FA, verificacao de email) |
| Rotas Tipadas | Wayfinder |
| Testes | Pest (88 testes, 336 assertions) |
| CI | GitHub Actions |
| Qualidade | Laravel Pint (pre-commit hook via Husky) |

## Estrutura do Projeto

```
app/
├── Http/Controllers/     # Controllers de CRUD (Ganho, Despesa, Divida, Investimento, Meta)
├── Models/               # Eloquent models com relacionamentos
└── Actions/Fortify/      # Registro com seed automatico

resources/js/
├── pages/                # Paginas React (home, welcome, auth, settings)
├── components/           # Modais, tabelas, sidebar, inputs customizados
└── routes/               # Helpers tipados gerados pelo Wayfinder

tests/Feature/            # Testes de integracao para todos os controllers
database/migrations/      # Schema do banco de dados
```

## Licenca

Este projeto e de codigo aberto sob a licenca [MIT](LICENSE).
