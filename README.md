# RealWorld Automation Lab

Repositório de prática de automação de testes E2E e API usando o projeto [RealWorld](https://realworld-apps.github.io/) como aplicação alvo — uma plataforma de blog chamada **Conduit**, com funcionalidades reais de autenticação, artigos, comentários e perfis.

Este projeto foi criado para consolidar e evoluir as habilidades de QA que desenvolvi durante meu estágio na **[CWI Software](https://cwi.com.br)**, colocando em prática os padrões e técnicas aprendidos em um ambiente controlado e do zero.

---

## Aplicações utilizadas

| Camada | Repositório | Stack |
|---|---|---|
| Frontend | [realworld-apps/angular-realworld-example-app](https://github.com/realworld-apps/angular-realworld-example-app) | Angular 21, TypeScript, Bun |
| Backend | [gothinkster/spring-boot-realworld-example-app](https://github.com/gothinkster/spring-boot-realworld-example-app) | Java, Spring Boot, MyBatis, Flyway |
| Banco | PostgreSQL 15 | — |

---

## Stack de Automação

- **Framework:** [Playwright](https://playwright.dev/)
- **Linguagem:** JavaScript (ES Modules)
- **Dados:** [@faker-js/faker](https://fakerjs.dev/)
- **Banco:** [pg](https://node-postgres.com/) (node-postgres)
- **Relatórios:** Allure + Playwright HTML Report
- **Infraestrutura:** Docker Compose

---

## Estrutura do projeto

```
realworld-automation/
├── automation/              # Projeto Playwright
│   ├── pages/               # Page Objects (frontend)
│   ├── services/            # Service Objects (API + DB)
│   ├── fixtures/            # Setup de contextos e injeção de dependências
│   └── tests/
│       ├── frontend/        # Specs E2E
│       └── api/             # Specs de API
├── angular-realworld-example-app/   # Frontend (fonte)
├── spring-boot-realworld-example-app/  # Backend (fonte)
└── docker-compose.yml       # Orquestra todos os serviços
```

---

## Como rodar

**Pré-requisitos:** Docker Desktop instalado e rodando.

```bash
# Subir toda a stack (primeira vez demora ~5-10 min pelo build)
docker-compose up --build

# Frontend → http://localhost:4200
# Backend  → http://localhost:8080
```

```bash
# Rodar os testes (com a stack no ar)
cd automation
npx playwright test

# Relatório visual
npx playwright show-report
```

```bash
# Resetar o banco (zera todos os dados)
docker-compose down -v
```

---

## Objetivo

Treinar na prática os padrões de automação aprendidos no estágio:

- Page Object Model e Service Object Model
- Fixtures para gerenciamento de estado e contexto
- Testes E2E e de API desacoplados
- Boas práticas: sem waits fixos, sem lógica nos specs, asserções encapsuladas
- Uso de dados dinâmicos com Faker
- Validação direto no banco de dados com `pg`

---

## Licença

O código de automação deste repositório é de uso livre.
As aplicações frontend e backend utilizadas como alvo pertencem aos seus respectivos repositórios originais, ambos sob licença **MIT**.

- [Licença Angular RealWorld](https://github.com/realworld-apps/angular-realworld-example-app/blob/main/LICENSE)
- [Licença Spring Boot RealWorld](https://github.com/gothinkster/spring-boot-realworld-example-app)
