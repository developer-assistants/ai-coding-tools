import type { BenchmarkTask } from './types';

export const BENCHMARK_TASKS: BenchmarkTask[] = [
  {
    id: 'multi-file-feature',
    slug: 'multi-file-feature',
    title: 'Multi-file feature implementation',
    shortTitle: 'Multi-file feature',
    summary:
      'Add JWT refresh-token rotation across auth middleware, a SQL migration, API route handlers, and integration tests without breaking existing sessions.',
    scenario:
      'A web backend uses stateless access tokens and needs rotating refresh tokens with reuse detection. The tool must read the schema, update the auth middleware, add token revocation endpoints, and write passing tests.',
    filesTouched: '6 to 10 files across schema, routes, middleware, and tests',
    evaluationCriteria: [
      'Keeps types, SQL columns, and route contracts aligned across every edited file.',
      'Runs the test suite after editing and fixes type or assertion failures on its own.',
      'Leaves unrelated modules untouched instead of rewriting working code.',
    ],
    promptBlueprint:
      'Add refresh-token rotation with reuse detection to src/auth/. Create a migration for refresh_tokens, update /auth/refresh and /auth/logout, and add integration tests covering token replay.',
    faqs: [
      {
        question: 'Which AI coding tools handle multi-file features reliably?',
        answer:
          'Agentic tools that can read repository files, apply coordinated diffs, and run tests in a loop perform best. Cursor, Claude Code, Windsurf, Cline, OpenAI Codex CLI, and Aider all support multi-file edits with shell verification.',
      },
      {
        question: 'Why do autocomplete-only plugins struggle with multi-file features?',
        answer:
          'Inline completion tools optimize for low latency inside the current file. They lack a planning loop to create migrations, update route handlers, and verify tests across separate directories.',
      },
    ],
  },
  {
    id: 'legacy-refactoring',
    slug: 'legacy-refactoring',
    title: 'Legacy codebase refactoring',
    shortTitle: 'Legacy refactoring',
    summary:
      'Convert a 4,000-line CommonJS Express service to strict TypeScript ESM while preserving HTTP payloads and error codes.',
    scenario:
      'An older service has implicit any types, callback-based helpers, and circular require() calls. The tool must untangle imports, type request and response objects, and keep all contract tests green.',
    filesTouched: '15 to 30 files plus tsconfig.json and package.json',
    evaluationCriteria: [
      'Tracks symbol references across the whole repository before renaming or moving exports.',
      'Iterates cleanly through tsc compiler errors without silencing them with any casts.',
      'Produces reviewable, incremental commits or diffs rather than one unreviewable dump.',
    ],
    promptBlueprint:
      'Migrate services/billing from CommonJS to strict TypeScript ESM. Preserve all JSON response shapes and HTTP status codes. Run npm run typecheck and npm test after each module.',
    faqs: [
      {
        question: 'What is the best AI tool for refactoring a large legacy codebase?',
        answer:
          'Claude Code, Augment Code, Sourcegraph Cody, and Cursor handle large refactors well because they index or search across the full repository and iterate on compiler diagnostics. For Java and .NET upgrades, Amazon Q Developer also provides automated version transforms.',
      },
      {
        question: 'How do teams keep AI refactors safe to review?',
        answer:
          'Scope each run to one module or boundary, require strict typecheck and existing contract tests to pass, and commit after each verified slice. Terminal tools like Aider and Claude Code fit well with git-per-step workflows.',
      },
    ],
  },
  {
    id: 'bug-debugging',
    slug: 'bug-debugging',
    title: 'Production bug debugging and root cause',
    shortTitle: 'Bug debugging',
    summary:
      'Trace an intermittent race condition in async Redis cache invalidation using stack traces, worker logs, and concurrent test reproduction.',
    scenario:
      'Users occasionally see stale pricing for 60 seconds after an admin update. The tool must inspect the write path, cache wrapper, and pub/sub subscriber, write a failing concurrency test, and patch the race.',
    filesTouched: '3 to 5 files plus a new reproduction test',
    evaluationCriteria: [
      'Reproduces the bug with a deterministic test before proposing a fix.',
      'Reads logs and stack traces accurately without guessing unrelated symptoms.',
      'Explains the exact lock or ordering flaw clearly in the final summary.',
    ],
    promptBlueprint:
      'Investigate stale cache reads after POST /admin/pricing. Inspect src/cache/redisStore.ts and src/workers/priceSync.ts, write a failing test that reproduces the race, then fix it.',
    faqs: [
      {
        question: 'Which AI coding assistant is strongest at root-cause debugging?',
        answer:
          'Terminal and agentic tools that can execute tests, inspect command output, and read related files on demand (Claude Code, OpenAI Codex CLI, Cursor, and Cline) outperform chat-only assistants that rely on manual copy-pasting.',
      },
      {
        question: 'Should developers feed production logs into cloud AI tools?',
        answer:
          'Strip PII, secrets, and customer tokens first, or use a tool with zero-data-retention enterprise contracts or self-hosted models such as TabbyML, Continue, or Tabnine.',
      },
    ],
  },
  {
    id: 'test-generation',
    slug: 'test-generation',
    title: 'Automated unit and integration test generation',
    shortTitle: 'Test generation',
    summary:
      'Add branch coverage for billing proration, leap-year edge cases, and retried Stripe webhook handlers using existing project test helpers.',
    scenario:
      'A core billing module has 38% branch coverage and several regression bugs. The tool must match the existing Vitest or Pytest fixture style, avoid brittle mocks, and verify every new test passes.',
    filesTouched: '2 to 4 test files and shared test fixtures',
    evaluationCriteria: [
      'Tests real edge cases (zero amounts, duplicate webhooks, timezone boundaries) rather than trivial getters.',
      'Reuses existing project test utilities and mocking conventions.',
      'Verifies that generated tests fail when the target logic is broken.',
    ],
    promptBlueprint:
      'Write unit and integration tests for src/billing/proration.ts and src/webhooks/stripe.ts. Cover idempotency keys, partial refunds, and leap-year renewals. Run vitest until all cases pass.',
    faqs: [
      {
        question: 'Which AI coding tools generate the most maintainable unit tests?',
        answer:
          'Tools that run the test runner automatically (Claude Code, Cursor, Aider, Windsurf, and OpenAI Codex CLI) catch broken imports and bad assertions immediately. JetBrains AI and GitHub Copilot also work well for quick per-function tests inside the IDE.',
      },
      {
        question: 'How do you stop AI tools from writing tautological tests?',
        answer:
          'Specify concrete edge cases in the prompt, forbid mocking the unit under test, and ask the tool to verify that a deliberate bug causes the new test to fail.',
      },
    ],
  },
  {
    id: 'pr-code-review',
    slug: 'pr-code-review',
    title: 'Pull request code review and security audit',
    shortTitle: 'PR code review',
    summary:
      'Review a 600-line pull request to catch a raw SQL interpolation bug, an N+1 query inside a loop, and a missing role check on an admin route.',
    scenario:
      'Before merge, an engineer wants automated review feedback on git diff main..HEAD focused on security, query performance, and broken invariants without noisy style nitpicks.',
    filesTouched: 'Read-only diff review across 12 changed files',
    evaluationCriteria: [
      'Flags concrete security and performance bugs with exact file and line references.',
      'Keeps false positives low and skips formatting comments already handled by linters.',
      'Proposes minimal, drop-in patches for confirmed defects.',
    ],
    promptBlueprint:
      'Review git diff main..HEAD for security vulnerabilities, missing authorization checks, N+1 database queries, and error-handling gaps. Ignore formatting and naming style.',
    faqs: [
      {
        question: 'Can AI coding tools replace human pull request reviews?',
        answer:
          'No. AI tools are effective as a first pass for spotting missing auth checks, query loops, and edge-case bugs, while human reviewers remain responsible for architecture, domain intent, and production risk.',
      },
      {
        question: 'Which tools integrate directly into GitHub or GitLab pull requests?',
        answer:
          'GitHub Copilot offers native PR review inside GitHub, Amazon Q Developer includes /review security scanning, and CLI agents like Claude Code or OpenAI Codex CLI can run as GitHub Actions checks on diffs.',
      },
    ],
  },
  {
    id: 'inline-autocomplete',
    slug: 'inline-autocomplete',
    title: 'Fast inline autocomplete and boilerplate',
    shortTitle: 'Inline autocomplete',
    summary:
      'Provide sub-300ms ghost-text completions and next-edit predictions while writing typed API endpoints, Zod schemas, and data mappers.',
    scenario:
      'A developer is actively typing new endpoints and wants accurate multi-line tab completions that follow surrounding types and imports without opening a chat sidebar.',
    filesTouched: '1 to 2 active editor tabs',
    evaluationCriteria: [
      'Completion latency stays low enough to avoid breaking typing flow.',
      'Respects local types, imports, and naming conventions in the open buffer.',
      'Offers multi-line next-edit jumps rather than single-token guesses.',
    ],
    promptBlueprint:
      'Inline typing benchmark: write a typed POST /v1/invoices handler with Zod validation, pagination mapper, and OpenAPI response type using only Tab completions.',
    faqs: [
      {
        question: 'Which AI coding tool has the fastest inline autocomplete?',
        answer:
          'Cursor Tab, GitHub Copilot, Windsurf (Supercomplete), and Augment Code lead for low-latency inline suggestions. For self-hosted setups, TabbyML and Continue paired with a local fill-in-the-middle model like Qwen2.5-Coder provide private autocomplete.',
      },
      {
        question: 'Do terminal coding agents provide inline editor autocomplete?',
        answer:
          'No. Terminal agents such as Claude Code, OpenAI Codex CLI, and Aider operate on repository files via the shell. Many teams pair a lightweight inline autocomplete extension with a terminal agent for multi-file tasks.',
      },
    ],
  },
];
