-- Seed data para ambiente de desenvolvimento e testes E2E.
-- Credenciais: rafael@conduit.com | jane@conduit.com | bob@conduit.com — senha: Test@1234
-- ON CONFLICT DO NOTHING garante idempotência (seguro re-executar).

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
   'https://i.pravatar.cc/150?u=bob')
ON CONFLICT DO NOTHING;

INSERT INTO tags (id, name) VALUES
  ('tag-playwright',  'playwright'),
  ('tag-testing',     'testing'),
  ('tag-angular',     'angular'),
  ('tag-spring',      'spring-boot'),
  ('tag-java',        'java'),
  ('tag-typescript',  'typescript')
ON CONFLICT DO NOTHING;

INSERT INTO articles (id, user_id, slug, title, description, body, created_at, updated_at) VALUES
  ('art-1', 'user-rafael',
   'how-to-use-playwright-for-e2e-testing',
   'How to Use Playwright for E2E Testing',
   'A hands-on guide to writing reliable end-to-end tests with Playwright.',
   '## Getting Started\n\nPlaywright is a Node.js library to automate Chromium, Firefox and WebKit.\n\n## Setup\n\n```bash\nnpm init playwright@latest\n```\n\n## Best Practices\n\n- Use Page Object Model\n- Prefer `getByRole` over CSS selectors\n- Avoid hard-coded waits',
   '2025-01-10 09:00:00', '2025-01-10 09:00:00'),
  ('art-2', 'user-jane',
   'angular-signals-deep-dive',
   'Angular Signals: A Deep Dive',
   'Understanding Angular Signals and how they change reactive programming in Angular apps.',
   '## What Are Signals?\n\nSignals are a new reactivity primitive introduced in Angular 16.\n\n```ts\nconst count = signal(0);\ncount.set(1);\n```',
   '2025-01-15 14:30:00', '2025-01-15 14:30:00'),
  ('art-3', 'user-bob',
   'spring-boot-with-postgresql-getting-started',
   'Spring Boot with PostgreSQL: Getting Started',
   'Step-by-step guide to connecting Spring Boot with PostgreSQL using Flyway migrations.',
   '## Dependencies\n\n```groovy\nruntimeOnly ''org.postgresql:postgresql''\nimplementation ''org.flywaydb:flyway-core''\n```',
   '2025-01-20 11:00:00', '2025-01-20 11:00:00'),
  ('art-4', 'user-rafael',
   'test-automation-best-practices',
   'Test Automation Best Practices',
   'Key principles to make your test suite fast, reliable and maintainable.',
   '## 1. Testing Pyramid\n\nMore unit tests, fewer E2E tests.\n\n## 2. Page Object Model\n\nEncapsulate UI interactions.\n\n## 3. No Hard-Coded Waits\n\nUse observable DOM state instead of sleep().',
   '2025-02-01 10:00:00', '2025-02-01 10:00:00'),
  ('art-5', 'user-jane',
   'typescript-tips-and-tricks',
   'TypeScript Tips and Tricks',
   'Practical TypeScript patterns that will make your code safer and more readable.',
   '## 1. Discriminated Unions\n\n```ts\ntype Result = { ok: true; value: string } | { ok: false; error: Error };\n```\n\n## 2. satisfies Operator\n\n```ts\nconst palette = { red: [255, 0, 0] } satisfies Record<string, number[]>;\n```',
   '2025-02-10 16:00:00', '2025-02-10 16:00:00')
ON CONFLICT DO NOTHING;

INSERT INTO article_tags (article_id, tag_id) VALUES
  ('art-1', 'tag-playwright'), ('art-1', 'tag-testing'),
  ('art-2', 'tag-angular'),    ('art-2', 'tag-typescript'),
  ('art-3', 'tag-spring'),     ('art-3', 'tag-java'),
  ('art-4', 'tag-playwright'), ('art-4', 'tag-testing'), ('art-4', 'tag-typescript'),
  ('art-5', 'tag-typescript'), ('art-5', 'tag-angular')
ON CONFLICT DO NOTHING;

INSERT INTO article_favorites (article_id, user_id) VALUES
  ('art-1', 'user-jane'), ('art-1', 'user-bob'),
  ('art-2', 'user-rafael'),
  ('art-3', 'user-rafael'),
  ('art-4', 'user-jane')
ON CONFLICT DO NOTHING;

INSERT INTO follows (user_id, follow_id) VALUES
  ('user-rafael', 'user-jane'),
  ('user-rafael', 'user-bob'),
  ('user-jane',   'user-rafael'),
  ('user-bob',    'user-jane')
ON CONFLICT DO NOTHING;

INSERT INTO comments (id, body, article_id, user_id, created_at, updated_at) VALUES
  ('com-1', 'Great tutorial! Really helped me understand Playwright. I especially liked the section on Page Objects.',
   'art-1', 'user-jane', '2025-01-11 10:00:00', '2025-01-11 10:00:00'),
  ('com-2', 'Tried this in my project and it worked perfectly. Make sure to run `npx playwright install` for the browser binaries.',
   'art-1', 'user-bob', '2025-01-12 09:30:00', '2025-01-12 09:30:00'),
  ('com-3', 'Angular Signals are game-changing! Finally a clean way to handle reactivity without RxJS boilerplate.',
   'art-2', 'user-rafael', '2025-01-16 08:00:00', '2025-01-16 08:00:00'),
  ('com-4', 'Very clear explanation of the Flyway setup. Saved me hours of debugging.',
   'art-3', 'user-jane', '2025-01-21 15:00:00', '2025-01-21 15:00:00'),
  ('com-5', 'The discriminated unions pattern is something every TypeScript developer should know.',
   'art-5', 'user-bob', '2025-02-11 11:00:00', '2025-02-11 11:00:00')
ON CONFLICT DO NOTHING;
