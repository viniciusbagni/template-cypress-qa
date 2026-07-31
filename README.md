# Template de Automação E2E

Template de automação E2E com **Cypress** + **JavaScript**, com specs de UI e API e reutilização via **custom commands**.

Use este repositório como base para criar `qa-<produto>-tests` (GitHub **Use this template** ou clone).

---

## Stack

| Tecnologia | Uso |
|------------|-----|
| Cypress 15 | Runner E2E (UI e API) |
| JavaScript | Specs e support |
| dotenv | Variáveis de ambiente |
| faker-br | Dados fake nos testes |
| cypress-multi-reporters + mochawesome | Relatórios |

---

## Quick start

```bash
# 1. Criar o repo a partir do template (ou clonar) e entrar na pasta
# 2. Configurar ambiente
cp .env.example .env
# Edite .env com BASE_URL, USERNAME e PASSWORD do seu env (dev ou hom)

# 3. Instalar dependências
npm install

# 4. Rodar os testes
npm run cy:run
```

Checklist pós-clone:

- [ ] Renomear `"name"` em `package.json` para `qa-<produto>-tests`
- [ ] Preencher `.env` (nunca commitar esse arquivo)
- [ ] Configurar secrets de CI em `dev` / `hom` (ver seção CI/CD)

### Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run cy:open` | Abre o Cypress em modo interativo (UI) |
| `npm run cy:run` | Roda todos os testes headless com multi-reporters |

---

## Estrutura do repositório

```text
qa-<produto>-tests/
├── cypress/
│   ├── e2e/
│   │   ├── ui/                         # Specs de interface (GUI)
│   │   │   └── spec.cy.js
│   │   └── api/                        # Specs de API
│   │       └── validate_login_routes.cy.js
│   ├── fixtures/
│   │   ├── example.json
│   │   └── faker.js
│   └── support/
│       ├── e2e.js                      # Entry: reporter + imports de commands
│       ├── ui/
│       │   └── commands.js             # Custom commands de UI
│       └── api/
│           └── commands_login.js       # Custom command authLogin
├── devops/
│   ├── dev/azure-pipelines.yml         # Pipeline ambiente dev
│   └── hom/azure-pipelines.yml         # Pipeline ambiente hom
├── cypress.config.js
├── reporter-config.json
├── package.json
├── .env.example
├── .env                                # Local (não versionado)
├── .gitignore
└── README.md
```

Artefatos gerados em runtime (não editar / não versionar):

- `cypress/reports/` — relatórios mochawesome (JSON/HTML)
- `cypress/screenshots/` — screenshots de falha
- `cypress/videos/` — vídeos das execuções
- `results/` — resultados auxiliares de reporters
- `node_modules/` — dependências

---

## Mapa detalhado: pastas e arquivos

### `cypress/support/` — Custom commands

Encapsulam ações reutilizáveis de UI e API. Specs devem preferir commands em vez de repetir `cy.request` / fluxos longos inline.

#### `cypress/support/e2e.js`

Entry do support do Cypress. Registra o reporter mochawesome e importa os arquivos de custom commands.

#### `cypress/support/api/commands_login.js`

Custom command de autenticação via API:

- `cy.authLogin(email, password)` — faz `cy.request` na `baseUrl` com headers de credenciais e armazena o token em `globalThis.token`

#### `cypress/support/ui/commands.js`

Custom commands de interface. Cada time adiciona commands de UI do produto aqui (ou em arquivos irmãos sob `support/ui/`), e registra o import em `support/e2e.js`.

---

### `cypress/fixtures/` — Dados de teste

#### `cypress/fixtures/example.json`

Fixture JSON de exemplo do Cypress.

#### `cypress/fixtures/faker.js`

Helpers com `faker-br`:

- `generateCEP()` — gera CEP aleatório

Usado para dados dinâmicos nos testes quando necessário.

---

### `cypress/e2e/` — Specs

Separação por tipo de teste:

| Pasta | Responsabilidade |
|-------|------------------|
| `cypress/e2e/ui/` | Fluxos de browser (GUI) via `cy.*` / custom commands |
| `cypress/e2e/api/` | Contratos HTTP (`cy.request` / custom commands de API) |

#### `cypress/e2e/ui/spec.cy.js`

Spec de UI de exemplo do template. Cada time substitui/adiciona specs em `cypress/e2e/ui/<feature>.cy.js`.

#### `cypress/e2e/api/validate_login_routes.cy.js`

Spec de API de exemplo: autentica via `cy.authLogin` usando `Cypress.config('email')` e `Cypress.config('password')`, e valida status/token. Cada time adiciona specs em `cypress/e2e/api/<feature>.cy.js`.

---

### Configuração e ambiente

#### `cypress.config.js`

Configuração do runner:

- Carrega variáveis via `dotenv`
- `baseUrl` ← `process.env.BASE_URL`
- `email` ← `process.env.USERNAME` (lido nos specs via `Cypress.config('email')`)
- `password` ← `process.env.PASSWORD` (lido via `Cypress.config('password')`)
- `retries: 3`
- Reporter: `cypress-multi-reporters` + plugin `cypress-mochawesome-reporter`
- `experimentalRunAllSpecs: true`

#### `reporter-config.json`

Opções do `cypress-multi-reporters` / mochawesome (`reportDir: cypress/reports`, screenshots embutidos, etc.).

#### `.env.example`

Modelo de variáveis. Copie para `.env` e preencha:

| Variável | Descrição |
|----------|-----------|
| `BASE_URL` | URL do login / app no ambiente alvo |
| `USERNAME` | Usuário / e-mail de autenticação |
| `PASSWORD` | Senha |

#### `.env`

Arquivo local com credenciais reais. **Não versionar** (já está no `.gitignore`).

#### `package.json`

Nome do projeto, scripts npm e dependências de desenvolvimento. Após clonar o template, altere `"name"` para `qa-<produto>-tests`.

#### `.gitignore`

Ignora `.env`, `node_modules/`, `cypress/reports/`, screenshots, videos e artefatos de report.

---

### `devops/` — CI/CD por ambiente

Pipelines modularizados: **um YAML por ambiente** (Azure DevOps).

| Arquivo | Ambiente |
|---------|----------|
| `devops/dev/azure-pipelines.yml` | Desenvolvimento |
| `devops/hom/azure-pipelines.yml` | Homologação |

**Contrato esperado de cada pipeline:** checkout, setup Node, `npm install`, `npm run cy:run` e publicação dos artefatos de report (`cypress/reports/`, screenshots/videos quando houver).

**Contrato com o app:** o CI injeta `BASE_URL`, `USERNAME` e `PASSWORD` do ambiente (variáveis / secrets do Azure). O repo de QA não empacota a aplicação — só aponta para a URL do env.

---

## O que alterar vs o que manter

| Ação | Itens |
|------|--------|
| **Alterar quase sempre** | `.env`, secrets de CI, `package.json` → `name`, specs e commands do produto |
| **Customizar se necessário** | `commands_login.js` / commands de UI para o fluxo correspondente |

---

## Como adicionar uma feature

1. **Custom command** — `cypress/support/ui/<feature>_commands.js` ou `cypress/support/api/<feature>_commands.js` + import em `cypress/support/e2e.js`
2. **Fixture / dados** (se necessário) — `cypress/fixtures/`
3. **Spec**
   - GUI: `cypress/e2e/ui/<feature>.cy.js`
   - API: `cypress/e2e/api/<feature>.cy.js`

---

## Convenções rápidas

- Specs usam `describe` / `it`; UI via `cy.*` / custom commands; API via `cy.request` / custom commands
- Reutilize lógica em `cypress/support/`; evite duplicar requests e fluxos longos nos specs
- Credenciais e URLs só via `.env` / secrets de CI
- Nomeie specs com o padrão `*.cy.js`
