-- ============================================================
-- MASSA DE DADOS - RealWorld Conduit
-- ============================================================
-- Rode via DBeaver, psql ou qualquer cliente PostgreSQL.
-- Comando psql:
--   docker exec -i realworld-postgres psql -U realworld -d realworld < data/insert.sql
--
-- CREDENCIAIS DOS USUÁRIOS (todos com a mesma senha):
--   rafael@conduit.com  /  Test@1234
--   jane@conduit.com    /  Test@1234
--   bob@conduit.com     /  Test@1234
--
-- Senha hash gerada com BCrypt cost 10 (compatível com Spring Security).
-- ============================================================


-- USUÁRIOS
INSERT INTO users (id, username, password, email, bio, image) VALUES
  ('user-rafael', 'rafael',
   '$2b$10$MmVOSGSuct.7.loqMeg29uguR7TUQb4vX18NhdSx5X/8euUKrcB4m',
   'rafael@conduit.com',
   'Engenheiro de qualidade apaixonado por automação e boas práticas de teste.',
   'https://i.pravatar.cc/150?u=rafael'),

  ('user-jane', 'jane',
   '$2b$10$ECIxm9JVDHxGo6ykE92RJ.P6syRq22JCYqQXtJ5NeMyisePBBhZga',
   'jane@conduit.com',
   'Desenvolvedora frontend especialista em Angular e TypeScript.',
   'https://i.pravatar.cc/150?u=jane'),

  ('user-bob', 'bob',
   '$2b$10$XhmGgZCm5zo4YdtJGoTcgu5txwcae8dBImPqg82n.g8uUoRJ./wiu',
   'bob@conduit.com',
   'Backend developer com foco em Java e Spring Boot.',
   'https://i.pravatar.cc/150?u=bob');


-- TAGS
INSERT INTO tags (id, name) VALUES
  ('tag-playwright',  'playwright'),
  ('tag-testing',     'testing'),
  ('tag-angular',     'angular'),
  ('tag-spring',      'spring-boot'),
  ('tag-java',        'java'),
  ('tag-typescript',  'typescript');


-- ARTIGOS
INSERT INTO articles (id, user_id, slug, title, description, body, created_at, updated_at) VALUES
  ('art-1', 'user-rafael',
   'how-to-use-playwright-for-e2e-testing',
   'How to Use Playwright for E2E Testing',
   'A hands-on guide to writing reliable end-to-end tests with Playwright.',
   '## Getting Started\n\nPlaywright is a Node.js library to automate Chromium, Firefox and WebKit. It enables cross-browser web automation.\n\n## Setup\n\nInstall with:\n\n```bash\nnpm init playwright@latest\n```\n\n## Writing Your First Test\n\n```js\ntest(''homepage'', async ({ page }) => {\n  await page.goto(''https://example.com'');\n  await expect(page).toHaveTitle(/Example/);\n});\n```\n\n## Best Practices\n\n- Use Page Object Model\n- Prefer `getByRole` over CSS selectors\n- Avoid hard-coded waits',
   '2025-01-10 09:00:00', '2025-01-10 09:00:00'),

  ('art-2', 'user-jane',
   'angular-signals-deep-dive',
   'Angular Signals: A Deep Dive',
   'Understanding Angular Signals and how they change reactive programming in Angular apps.',
   '## What Are Signals?\n\nSignals are a new reactivity primitive introduced in Angular 16. They provide a simple way to track state changes.\n\n## Creating a Signal\n\n```ts\nconst count = signal(0);\ncount.set(1);\ncount.update(v => v + 1);\n```\n\n## Computed Signals\n\n```ts\nconst doubled = computed(() => count() * 2);\n```\n\n## Effects\n\nUse `effect()` to run side effects when signals change.\n\n```ts\neffect(() => console.log(count()));\n```',
   '2025-01-15 14:30:00', '2025-01-15 14:30:00'),

  ('art-3', 'user-bob',
   'spring-boot-with-postgresql-getting-started',
   'Spring Boot with PostgreSQL: Getting Started',
   'Step-by-step guide to connecting Spring Boot with PostgreSQL using Flyway migrations.',
   '## Dependencies\n\nAdd to your `build.gradle`:\n\n```groovy\nruntimeOnly ''org.postgresql:postgresql''\nimplementation ''org.flywaydb:flyway-core''\n```\n\n## Configuration\n\n```properties\nspring.datasource.url=jdbc:postgresql://localhost:5432/mydb\nspring.datasource.username=myuser\nspring.datasource.password=mypassword\n```\n\n## Migrations\n\nCreate `src/main/resources/db/migration/V1__create_tables.sql` and Flyway handles the rest automatically.',
   '2025-01-20 11:00:00', '2025-01-20 11:00:00'),

  ('art-4', 'user-rafael',
   'test-automation-best-practices',
   'Test Automation Best Practices',
   'Key principles to make your test suite fast, reliable and maintainable.',
   '## 1. Use the Testing Pyramid\n\nMore unit tests, fewer E2E tests. E2E tests are slow and expensive.\n\n## 2. Page Object Model\n\nEncapsulate UI interactions in page objects to avoid duplication.\n\n## 3. No Hard-Coded Waits\n\nNever use `sleep()` or `waitForTimeout()`. Use observable DOM state instead.\n\n## 4. Independent Tests\n\nEach test should set up and tear down its own state.\n\n## 5. Meaningful Assertions\n\nAssert on business outcomes, not implementation details.',
   '2025-02-01 10:00:00', '2025-02-01 10:00:00'),

  ('art-5', 'user-jane',
   'typescript-tips-and-tricks',
   'TypeScript Tips and Tricks',
   'Practical TypeScript patterns that will make your code safer and more readable.',
   '## 1. Use `satisfies` Operator\n\n```ts\nconst palette = { red: [255, 0, 0] } satisfies Record<string, number[]>;\n```\n\n## 2. Discriminated Unions\n\n```ts\ntype Result = { ok: true; value: string } | { ok: false; error: Error };\n```\n\n## 3. Template Literal Types\n\n```ts\ntype EventName = `on${Capitalize<string>}`;\n```\n\n## 4. `infer` in Conditional Types\n\nExtracts type information at the type level — very powerful for utilities.',
   '2025-02-10 16:00:00', '2025-02-10 16:00:00');


-- ARTICLE TAGS
INSERT INTO article_tags (article_id, tag_id) VALUES
  ('art-1', 'tag-playwright'),
  ('art-1', 'tag-testing'),
  ('art-2', 'tag-angular'),
  ('art-2', 'tag-typescript'),
  ('art-3', 'tag-spring'),
  ('art-3', 'tag-java'),
  ('art-4', 'tag-playwright'),
  ('art-4', 'tag-testing'),
  ('art-4', 'tag-typescript'),
  ('art-5', 'tag-typescript'),
  ('art-5', 'tag-angular');


-- FAVORITOS
INSERT INTO article_favorites (article_id, user_id) VALUES
  ('art-1', 'user-jane'),
  ('art-1', 'user-bob'),
  ('art-2', 'user-rafael'),
  ('art-3', 'user-rafael'),
  ('art-4', 'user-jane');


-- FOLLOWS (user_id segue follow_id)
INSERT INTO follows (user_id, follow_id) VALUES
  ('user-rafael', 'user-jane'),
  ('user-rafael', 'user-bob'),
  ('user-jane',   'user-rafael'),
  ('user-bob',    'user-jane');


-- COMENTÁRIOS
INSERT INTO comments (id, body, article_id, user_id, created_at, updated_at) VALUES
  ('com-1', 'Great tutorial! Really helped me understand Playwright. I especially liked the section on Page Objects.',
   'art-1', 'user-jane', '2025-01-11 10:00:00', '2025-01-11 10:00:00'),

  ('com-2', 'Tried this in my project and it worked perfectly. One tip: make sure to install the browser binaries with `npx playwright install`.',
   'art-1', 'user-bob', '2025-01-12 09:30:00', '2025-01-12 09:30:00'),

  ('com-3', 'Angular Signals are game-changing! Finally a clean way to handle reactivity without RxJS boilerplate.',
   'art-2', 'user-rafael', '2025-01-16 08:00:00', '2025-01-16 08:00:00'),

  ('com-4', 'Very clear explanation of the Flyway setup. Saved me hours of debugging.',
   'art-3', 'user-jane', '2025-01-21 15:00:00', '2025-01-21 15:00:00'),

  ('com-5', 'The discriminated unions pattern is something every TypeScript developer should know.',
   'art-5', 'user-bob', '2025-02-11 11:00:00', '2025-02-11 11:00:00');
