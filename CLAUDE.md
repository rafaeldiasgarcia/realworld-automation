# Visão Geral

Automação E2E + API Testing para **Assistente Inteligente de Fluxo de Caixa para PJ**.
Stack: Java/Spring Boot (backend), Angular (frontend), PostgreSQL, IA (CWI CLAUDE).
Time: Rafael Garcia, Mateus Junior.
*Nota: Arquitetura em estruturação. Nomes de arquivos podem ser temporários.*

## Stack de Testes
- **Framework**: Playwright
- **Linguagem**: JavaScript (ES Modules, `import/export` obrigatório, sem `require`)
- **Dados**: @faker-js/faker
- **DB**: pg (node-postgres)
- **Relatórios**: Playwright HTML
- **JWT**: jwt-decode

## Estrutura Alvo (Padrão)
- `CLAUDE.md`: Spec viva (fonte da verdade)
- `pages/`: Page Objects (só frontend: `[tela].page.js`)
- `services/`: Service Objects (API/DB: `[recurso].service.js`)
- `fixtures/`: Setup Playwright (`frontend.fixture.js`, `api.fixture.js`)
- `tests/frontend/`: Specs E2E e arquivos estáticos `[contexto].data.js`
- `tests/api/`: Specs API e massa de dados API

## Separação
- `pages/` (Front) e `services/` (Back/API/DB) jamais devem se misturar.
- Frontend validado pelas pages, API validada pelos services e fixtures.

---

# Convenções

## Regras Gerais
- Playwright com ES Modules (`import/export` exclusivamente).
- Idioma principal: **Português do Brasil** (funções, variáveis, arquivos, testes).
- Sintaxe e APIs da linguagem obrigatoriamente em inglês.
- Clareza importa mais que tamanho do nome. Seja descritivo.
- Use padrões Page/Service Objects e Fixtures já estabelecidos.

## Nomes e Prefixos
- Arquivos: `[tela/contexto].[tipo].js` (`login.page.js`, `cadastro.data.js`, `usuario.service.js`).
- Prefixos visuais nas pages: `input*`, `botao*`, `link*`, `lista*`, `modal*`, `loader*`, `checkbox*`, `feedback*`.
- Métodos preferencialmente como funções assíncronas padrão.

## Seletores de UI

Usar sempre o seletor mais alto na hierarquia disponível. Declarar no `constructor` da page.

| Prioridade | Seletor | Quando usar |
|---|---|---|
| 1 | `data-testid` | Quando o atributo existe no HTML |
| 2 | `getByRole` | Elementos semânticos (button, link, heading, textbox…) |
| 3 | `getByLabel` | Inputs associados a um `<label>` |
| 4 | `getByPlaceholder` | Inputs sem label mas com placeholder descritivo |
| 5 | `getByText` | Elementos identificados por texto visível estável |
| 6 | CSS class / atributo | Apenas classes estáveis e sem significado de estilo |
| 7 | XPath | Último recurso. Justificar em comentário o motivo |

- `data-testid` segue o formato `[contexto]-[elemento]-[descrição]` (ex: `login-input-email`).
- Nunca misturar níveis sem necessidade: se `getByRole` resolve, não desça para CSS.

---

# Page Objects

## Responsabilidades
- Usar APENAS para interagir com o DOM (frontend).
- Contém locators e ações visuais.
- JAMAIS faça chamadas de API, de DB ou monte payloads de regras restritas no Page Object.

## Regras
1. Todo locator DEVE estar definido no `constructor(page)`.
2. Nas funções/métodos da page, referencie usando `this.*`. NUNCA instancie com `page.locator()` no meio do escopo do método.
3. Uma page por tela (`[tela].page.js`).
4. Priorize seletor `data-testid`.
5. Última etapa do teste visual tira screenshot em `test-results/evidencias/...` se necessário.

## Validações de Erro

- **PROIBIDO**: assertar texto literal de mensagem de erro (`toContainText('has already been taken')`).
- Mensagens são implementação do backend — mudam sem aviso e quebram testes por razão errada.
- **CORRETO**: validar o **estado observável** — o elemento de feedback está visível E o usuário continua na mesma página (não foi redirecionado).

```js
// ✅ correto — valida o que importa funcionalmente
async validarErroExibido() {
  await expect(this.feedbackErros).toBeVisible();
  await expect(this.page).toHaveURL('/register');
}

// ❌ errado — frágil, quebra se o wording mudar
async validarMensagemErro(mensagem) {
  await expect(this.feedbackErros).toContainText(mensagem);
}
```

- Exceção aceitável: validar texto **somente** quando o requisito é exatamente a mensagem exibida (ex: erro de formato de e-mail vs. e-mail duplicado precisam ser distinguidos no mesmo campo).

## Esperas (Timeouts)
- **PROIBIDO**: `waitForTimeout` ou delays explícitos chumbeados.
- **PERMITIDO**: Esperas via estado DOM observável.
- Exemplo certo: `await this.loader.waitFor({ state: 'hidden' });`
- Use thresholds de timeout `toPass({ timeout: X })` para retries falhos e não como sleeps manuais.

---

# Service Objects (API e DB)

## Responsabilidades
- Usar para abstrair endpoints REST, chamadas de serviço, validations de payload e queries no banco.
- JAMAIS interagir com páginas HTML, locators ou DOM aqui.

## Padrão API (`[recurso].service.js`)
- Recebimento obrigatório de `request` no `constructor`.
- Preservar estado na classe: `this.response` e `this.responseBody`.
- Ação faz fetch e salva propriedades; outros métodos assertam sobre elas verificando regra de negócio.

## Padrão Banco de Dados (`db.service.js`)
- Uso do driver `pg`.
- Gestão de lifecycle (conectar/desconectar) fica sempre em Fixture, jamais in-line no teste.
- Validação assíncrona: use blocks com `toPass({ timeout: 10000 })` para assertar que dados assíncronos (como log de auditoria) caíram na tabela sem usar sleeps curtos estáticos.

## JWT (Decoding)
- Tokens decodificados são responsabilidade única do `AutenticacaoService` (ex: `obterRole`, `obterIdEmpresa`). Não espalhar métodos decode.

---

# Fixtures

## Responsabilidades
- Injeção controlada de dependências (pages, services, dados).
- Gestão do ciclo de vida de conexões do Banco (ex: startup/shutdown DB).
- Preparo de estado complexo massificador base (Setup isolado). Ex: Logar o usuário antes (`contaAutenticada`).
- JAMAIS escreva regras de negócio complexas soltas na fixture.

## Padrões
- Um arquivo por contexto: `frontend.fixture.js`, `api.fixture.js`.
- Exportar extendido (`test`) e asserções padrão (`expect`).
- Pages aceitam objeto `page`, services de API aceitam argumento `request`.
- Lifecycle Services DB requer `conectar`, `usar`, `desconectar`.

## Nomenclatura de Fixtures e Chaves de Dados

| Tipo | Padrão | Exemplo |
|---|---|---|
| Fixture de page | `[tela]Page` | `registerPage`, `loginPage` |
| Import de dados no spec | `dados[Tela]` | `dadosRegister`, `dadosLogin` |
| Chave de caso válido | `valido` | `dadosRegister.valido` |
| Chave de conjunto parametrizado | `[dominio][Cenário]` | `conflitoCadastro`, `erroLogin` |
| Entrada dentro de conjunto | `{ descricao, dadosTeste }` | — |

- Dados são importados diretamente no spec (`import dadosRegister from './data/register.data.js'`), não via fixture.
- Fixtures carregam apenas pages e estado de contexto (ex: conta autenticada).
- Nunca use nomes genéricos como `dados`, `casos` ou `lista`.
- O nome deve comunicar domínio: `conflitoCadastro` deixa claro que são dados que causam conflito no cadastro.

## Setup de Contextos
- `contaAutenticada` por exemplo: cria registro, executa login em background silencioso e injeta os ids no escopo do teste logado isoladamente do teste do worker par.
- Não substituem resources (pages/services), entregam contexto.

---

# Testes e Massa de Dados

## Regras de Testes (`*.spec.js`)
- Testes orquestram steps de chamadas de interfaces/services limpas. Apenas define a intenção do fluxo.
- ZERO lógica solta: sem `if`, sem mock inline, sem `page.locator()` inline, sem montadores complexos. Tudo em PO/SO/Fixtures.
- ZERO `expect` no arquivo de spec. 100% das asserções devem ser encapsuladas nos Page Objects ou Service Objects (ex: `await loginPage.validarMensagemSucesso()`).
- Sempre importar `{ test }` do arquivo `.fixture.js`, nunca direto do npm `@playwright`.
- Hierarquia via `describe()`. Para workflows grandes em APIs iterativas, fragmentar via `test.step()`.

### `for` fora do `test()` — testes parametrizados
Quando múltiplos casos testam **o mesmo comportamento com dados diferentes**, use um `for` **dentro do `describe()` mas fora do `test()`**. Cada iteração gera um `test()` independente com nome descritivo — o Playwright recomenda esse padrão pois cada caso vira uma entrada separada no relatório, com retry, trace e screenshot próprios.

Os dados do loop devem ser importados **diretamente no spec** no nível de módulo (fixtures não estão acessíveis fora de `test()`).

```js
import dadosRegister from './data/register.data.js';

test.describe('Register', () => {
  test.beforeEach(async ({ registerPage }) => {
    await registerPage.abrirPagina(); // roda para cada test gerado pelo for
  });

  for (const { descricao, dadosTeste } of dadosRegister.conflitoCadastro) {
    test(`deve exibir erro ao tentar cadastrar — ${descricao}`, async ({ registerPage }) => {
      await registerPage.cadastrar(dadosTeste);
      await registerPage.validarErroExibido();
    });
  }
});
```

> **Regra**: `for` parametrizador fica dentro de `describe()`, nunca dentro de `test()`. Dados de loop vêm de import direto no spec, não de fixture. `beforeEach` já é reaproveitado automaticamente por cada test gerado.

## Massa de Dados (`*.data.js`)
- Previsibilidade total.
- Nunca fixe (hardcode) payloads longos no meio do describe. Exporte obj default nos arquivos `.data.js`.
- Arquivos de faker como `@faker-js/faker` devem popular esses dados por lá, e a injeção acontece preferencialmente limpa pelo teste chamando o `.data.js` central, isolando worker variables.

---

# Banco de Dados

Tabelas em PostgreSQL: `empresa`, `usuario`, `categoria`, `transacao`, `auditoria`.

- **`empresa`**: `id` (SERIAL PK), `razao_social` (VAR), `cnpj` (VAR 14, UK), `data_cadastro`, `status`, `nome_fantasia` (VAR)
- **`usuario`**: `id` (SERIAL PK), `nome` (VAR), `email` (VAR UK), `senha`, `id_empresa` (INT FK), `role`, `data_cadastro`, `status`
- **`categoria`**: `id` (SERIAL PK), `id_empresa` (INT FK), `nome` (VAR, UK p/ ID)
- **`transacao`**: `id` (SERIAL PK), `id_empresa` (INT FK), `descricao` (VAR), `valor` (NUM 15,2), `data_criacao`, `data_fechamento`, `granularidade`, `id_categoria` (INT FK), `id_usuario_criador` (INT FK NULL), `parcelas`, `status`, `tipo_transacao`
- **`auditoria`**: `id` (SERIAL PK), `id_usuario` (INT FK UR), `id_empresa` (INT FK UR), `acao` (VAR), `saldo_atual` (NUM 15,2), `detalhes_message` (VAR NULL), `data_hora_criacao`, `tabela_afetada` (VAR), `registro_afetado_id` (INT)

---

# Regras Agente IA

## Permissões e Escopo
- **Escopo Restrito:** Aja SÓ na exata tarefa exigida. Sem devaneios/refatorações colaterais se não ditas. Priorizar infraestrutura/padrão vigente da source (CLAUDE.md).
- **Ações Proibidas (sem aprovação via chat):** instanciar novas dependências, criar pastas exóticas de pattern estranho ao fixado, refatorar código legado em lote sem request formal via user manual, comittar no git.

## Fluxo
1. Ler regras listadas do path docs rules base (`**/*.md`). Analisar a raiz.
2. Analisar reusabilidade (fixtures/services em stock).
3. Propor ação/mudanças e justificar novo file se precisar.
4. Codar obedecendo aos preceitos rigorosamente.
5. Sumarizar na entrega.

## Checklist Faça / N.F
- **Fazer:** Reuso maciço. Termos aportuguesados. Locators limitados ao `constructor` de pages. Services com controle restrito a calls HTTP. `import/export`. Retries de db via `toPass()`.
- **NÃO Fazer:** Misturar specs/dados. Espalhar `page.locator()` nos function scopes. `require(x)`. Timeouts Fixos (`waitForTimeout`) (proibidíssimos!). Colocar fetch API no `[x].page.js`.
