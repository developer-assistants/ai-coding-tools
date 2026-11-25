# AI Coding Tools Comparison and Team Stack Selector

[![Website](https://img.shields.io/badge/Live%20Workbench-GitHub%20Pages-0f766e?style=flat-square)](https://developer-assistants.github.io/ai-coding-tools/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](./LICENSE)
[![Tools Compared](https://img.shields.io/badge/Tools%20Compared-16-111827?style=flat-square)](https://developer-assistants.github.io/ai-coding-tools/tools/)
[![Tasks](https://img.shields.io/badge/Identical%20Tasks-6-0f766e?style=flat-square)](https://developer-assistants.github.io/ai-coding-tools/tasks/)

**AI Coding Tools** is an open-source benchmark workbench and **team stack selector** that compares 16 **AI coding assistants**, **agentic IDEs**, **terminal coding agents**, and **self-hosted Copilot alternatives** on 6 identical software engineering tasks.

Built as a practical successor to the archived [`sourcegraph/awesome-code-ai`](https://github.com/sourcegraph/awesome-code-ai) directory, this repository replaces static link lists with side-by-side task evaluations and an interactive decision matrix you can filter by editor, language stack, privacy rules, and budget.

Live interactive workbench: [https://developer-assistants.github.io/ai-coding-tools/](https://developer-assistants.github.io/ai-coding-tools/)

## Same-task comparison across 16 AI coding tools

Every tool in this catalog is evaluated against the same 6 engineering tasks:

1. **Multi-file feature implementation**: JWT refresh-token rotation across middleware, SQL migration, routes, and integration tests.
2. **Legacy codebase refactoring**: Converting a 4,000-line CommonJS Express service to strict TypeScript ESM.
3. **Production bug debugging**: Tracing an intermittent Redis cache invalidation race condition with a failing reproduction test.
4. **Automated test generation**: Adding branch coverage for billing proration and retried webhook handlers.
5. **Pull request code review**: Auditing a 600-line diff for SQL injection, N+1 queries, and missing role checks.
6. **Fast inline autocomplete**: Sub-300ms ghost-text and next-edit completions while writing typed endpoints.

| Tool | Category | Editors | Multi-file feature | Legacy refactor | Bug debugging | Test gen | PR review | Inline Tab | Hosting / License |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| [Cursor](https://cursor.com) | Agentic IDE | VS Code fork | Strong (94) | Strong (90) | Strong (91) | Strong (92) | Good (82) | Strong (96) | Cloud / ZDR (Proprietary) |
| [Claude Code](https://www.anthropic.com/claude-code) | Terminal Agent | CLI, VS Code, JetBrains, Neovim | Strong (96) | Strong (95) | Strong (96) | Strong (94) | Strong (92) | Limited (20) | Cloud / ZDR (Proprietary) |
| [GitHub Copilot](https://github.com/features/copilot) | IDE Extension | VS Code, JetBrains, Neovim, CLI | Good (86) | Good (82) | Good (83) | Strong (88) | Strong (91) | Strong (93) | Cloud / ZDR (Proprietary) |
| [Windsurf](https://windsurf.com) | Agentic IDE | VS Code fork, JetBrains | Strong (90) | Good (86) | Good (87) | Strong (88) | Good (80) | Strong (94) | Cloud / ZDR / Self-hosted |
| [OpenAI Codex CLI](https://github.com/openai/codex) | Terminal Agent | CLI, VS Code, Neovim | Strong (93) | Strong (92) | Strong (94) | Strong (92) | Strong (91) | Limited (18) | Cloud / ZDR (Apache-2.0) |
| [Aider](https://aider.chat) | Terminal Agent | CLI, any editor | Strong (89) | Strong (88) | Good (84) | Strong (89) | Good (79) | Limited (15) | BYOK / Local (Apache-2.0) |
| [Cline](https://cline.bot) | IDE Extension | VS Code, JetBrains | Strong (92) | Strong (88) | Strong (90) | Strong (90) | Good (82) | Limited (18) | BYOK / Local (Apache-2.0) |
| [Continue](https://continue.dev) | Self-Hosted / BYOK | VS Code, JetBrains | Good (81) | Good (79) | Good (80) | Good (83) | Good (78) | Strong (88) | Self-hosted / BYOK (Apache-2.0) |
| [Kiro](https://kiro.dev) | Agentic IDE | VS Code fork | Strong (91) | Good (84) | Good (83) | Strong (88) | Good (80) | Good (84) | Cloud / ZDR (Proprietary) |
| [Augment Code](https://www.augmentcode.com) | IDE Extension | VS Code, JetBrains, Neovim | Strong (92) | Strong (93) | Strong (90) | Strong (89) | Good (85) | Strong (92) | Cloud / ZDR (Proprietary) |
| [Sourcegraph Cody](https://sourcegraph.com/cody) | IDE Extension | VS Code, JetBrains, Neovim | Good (83) | Strong (88) | Good (84) | Good (83) | Good (82) | Good (86) | Cloud / Self-hosted |
| [Amazon Q Developer](https://aws.amazon.com/q/developer/) | IDE Extension | VS Code, JetBrains, CLI | Good (83) | Strong (91) | Good (82) | Good (84) | Strong (90) | Good (85) | Cloud / ZDR (Proprietary) |
| [Google Gemini Code Assist](https://codeassist.google) | IDE Extension | VS Code, JetBrains, CLI | Good (85) | Good (85) | Good (84) | Good (85) | Strong (89) | Good (87) | Cloud / ZDR (Proprietary) |
| [JetBrains AI Assistant](https://www.jetbrains.com/ai/) | IDE Extension | JetBrains IDEs | Good (85) | Strong (89) | Good (84) | Strong (88) | Good (81) | Strong (88) | Cloud / ZDR (Proprietary) |
| [Tabnine](https://www.tabnine.com) | Enterprise Private | VS Code, JetBrains, Neovim | Partial (74) | Good (77) | Good (76) | Good (82) | Good (84) | Strong (87) | VPC / Air-gapped |
| [TabbyML](https://tabby.tabbyml.com) | Self-Hosted OSS | VS Code, JetBrains, Neovim | Limited (48) | Partial (55) | Partial (62) | Partial (66) | Limited (45) | Strong (89) | Self-hosted (Apache-2.0) |

## Team stack selection table

Use this matrix as a starting point, or open the [interactive stack selector](https://developer-assistants.github.io/ai-coding-tools/#team-stack-selector) to apply hard filters (self-hosted only, open source only, MCP support, inline autocomplete) and export a Markdown RFC table.

| Team stack | Typical editor & privacy | Primary recommendation | Secondary / companion pick | Why this pairing works |
| :--- | :--- | :--- | :--- | :--- |
| [TypeScript / React / Next.js](https://developer-assistants.github.io/ai-coding-tools/stacks/typescript-react/) | VS Code, Cloud SaaS | Cursor | Claude Code or Windsurf | Fast multi-line Tab predictions plus tight TypeScript compiler feedback loops. |
| [Python / FastAPI / ML](https://developer-assistants.github.io/ai-coding-tools/stacks/python-ml/) | VS Code or PyCharm, Cloud / BYOK | Claude Code | Cursor, Aider, or OpenAI Codex CLI | Pytest, ruff, and mypy give shell agents fast, deterministic verification. |
| [Java / Kotlin / Spring Boot](https://developer-assistants.github.io/ai-coding-tools/stacks/java-kotlin-jetbrains/) | IntelliJ IDEA, Enterprise ZDR | JetBrains AI Assistant | GitHub Copilot or Amazon Q Developer | Keeps native IntelliJ PSI refactorings intact; Amazon Q adds automated JDK upgrades. |
| [Go / Rust / Systems](https://developer-assistants.github.io/ai-coding-tools/stacks/go-rust-systems/) | Terminal / Neovim / VS Code | Claude Code or OpenAI Codex CLI | Aider or GitHub Copilot | Strict compilers (`cargo check`, `go test -race`) make CLI agents reliable on complex fixes. |
| [Self-hosted / Air-gapped](https://developer-assistants.github.io/ai-coding-tools/stacks/self-hosted-airgapped/) | VS Code or JetBrains, On-prem GPU | TabbyML or Continue | Tabnine Enterprise or Aider (local vLLM) | Separates fast local FIM autocomplete from private VPC chat or multi-file agents. |
| [Enterprise Monorepo](https://developer-assistants.github.io/ai-coding-tools/stacks/enterprise-monorepo/) | Mixed IDEs, ZDR / SOC 2 | GitHub Copilot Enterprise | Augment Code or Sourcegraph Cody | Broad IDE coverage, native PR review, and deep indexing across large repositories. |

## Head-to-head comparison guides

- [Cursor vs GitHub Copilot](https://developer-assistants.github.io/ai-coding-tools/compare/cursor-vs-github-copilot/)
- [Claude Code vs Cursor](https://developer-assistants.github.io/ai-coding-tools/compare/claude-code-vs-cursor/)
- [Windsurf vs Cursor](https://developer-assistants.github.io/ai-coding-tools/compare/windsurf-vs-cursor/)
- [Aider vs Claude Code](https://developer-assistants.github.io/ai-coding-tools/compare/aider-vs-claude-code/)
- [Cline vs Continue](https://developer-assistants.github.io/ai-coding-tools/compare/cline-vs-continue/)
- [OpenAI Codex CLI vs Claude Code](https://developer-assistants.github.io/ai-coding-tools/compare/codex-cli-vs-claude-code/)
- [TabbyML vs GitHub Copilot](https://developer-assistants.github.io/ai-coding-tools/compare/tabby-vs-github-copilot/)
- [Amazon Q Developer vs GitHub Copilot](https://developer-assistants.github.io/ai-coding-tools/compare/amazon-q-vs-github-copilot/)

## Local development and testing

```bash
git clone https://github.com/developer-assistants/ai-coding-tools.git
cd ai-coding-tools
npm install
npm run dev
```

Run unit tests covering dataset integrity, hard hosting/license constraints, and Markdown RFC table export:

```bash
npm test
```

Build the production bundle and generate all 25 static SEO pages, `sitemap.xml`, `robots.txt`, and `llms.txt`:

```bash
npm run build
```

## Architecture

- [`src/data/tools.ts`](./src/data/tools.ts): Structured data for 16 AI coding tools across all 6 standardized tasks.
- [`src/data/tasks.ts`](./src/data/tasks.ts): Identical engineering task scenarios, criteria, and shared prompt blueprints.
- [`src/data/stacks.ts`](./src/data/stacks.ts): Six team stack profiles with rollout notes and pitfalls.
- [`src/data/comparisons.ts`](./src/data/comparisons.ts): Eight head-to-head comparison guides with FAQs.
- [`src/engine/selector.ts`](./src/engine/selector.ts): Deterministic scoring engine and Markdown/JSON RFC exporter.
- [`scripts/generate-seo-pages.mjs`](./scripts/generate-seo-pages.mjs): Pre-renders 25 static HTML routes, Schema.org JSON-LD, `sitemap.xml`, `robots.txt`, and `llms.txt`.

## Frequently asked questions

### Which AI coding tool is best for multi-file features and refactoring?
Claude Code, Cursor, OpenAI Codex CLI, Cline, and Windsurf handle multi-file features best because they search the repository, coordinate diffs across files, and run compiler or test loops automatically.

### What is the best open-source self-hosted alternative to GitHub Copilot?
TabbyML and Continue are the leading open-source choices. TabbyML runs as a single Rust server for private inline completions and repo Q&A, while Continue connects VS Code and JetBrains to Ollama, vLLM, or private enterprise model gateways.

### Should a team use a terminal coding agent or an agentic IDE?
Agentic IDEs like Cursor and Windsurf combine low-latency inline Tab autocomplete with visual diff editing in one window. Terminal agents like Claude Code, OpenAI Codex CLI, and Aider work across any editor and excel at deep refactors and headless CI checks. Many teams pair a lightweight inline extension with a terminal agent.

## Support the project

If this benchmark or stack selector helped your team narrow down an AI coding tool, consider giving the repository a **Star** so other engineering leads can find it.

## License

Distributed under the [MIT License](./LICENSE).
