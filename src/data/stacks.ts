import type { StackProfile } from './types';

export const STACK_PROFILES: StackProfile[] = [
  {
    id: 'typescript-react',
    slug: 'typescript-react',
    title: 'TypeScript, React, and Next.js product teams',
    shortTitle: 'TypeScript / React',
    description:
      'Fast-moving web product teams working primarily in VS Code with TypeScript, React, Next.js, Node APIs, and Vitest or Playwright.',
    typicalRepo: 'Monorepo or full-stack TypeScript app (10k to 300k LOC), VS Code, GitHub PRs.',
    defaultEditor: 'vscode',
    defaultHosting: 'cloud-saas',
    defaultBudget: 'startup',
    priorityTask: 'multi-file-feature',
    topRecommendations: ['cursor', 'claude-code', 'windsurf', 'github-copilot'],
    avoidPatterns: [
      'Adopting a self-hosted 7B model for complex React and TypeScript refactors when cloud ZDR plans are allowed.',
      'Running multi-file agents without strict TypeScript checks and automated tests wired into the loop.',
    ],
    rolloutNotes:
      'Most TypeScript teams settle on either Cursor alone, or VS Code with GitHub Copilot for inline completions paired with Claude Code or OpenAI Codex CLI for multi-file features.',
    faqs: [
      {
        question: 'What is the best AI coding tool for TypeScript and React?',
        answer:
          'Cursor and Claude Code lead for TypeScript and React work. Cursor gives you fast multi-line Tab edits and inline agent diffs in one editor, while Claude Code handles multi-file features, strict TypeScript refactors, and test loops reliably.',
      },
      {
        question: 'Should a TypeScript team use Cursor or GitHub Copilot?',
        answer:
          'Pick Cursor if your team works exclusively in VS Code and wants stronger multi-file editing and faster next-edit Tab predictions. Pick GitHub Copilot if you need lower per-seat pricing, native GitHub PR reviews, or mixed IDE support.',
      },
    ],
  },
  {
    id: 'python-ml',
    slug: 'python-ml',
    title: 'Python, FastAPI, data, and ML teams',
    shortTitle: 'Python / ML',
    description:
      'Backend API, data engineering, and machine learning teams using Python, FastAPI, Django, Pytest, SQL, and Jupyter notebooks.',
    typicalRepo: 'Python services, ETL pipelines, and notebooks across VS Code, PyCharm, and terminal.',
    defaultEditor: 'vscode',
    defaultHosting: 'cloud-saas',
    defaultBudget: 'startup',
    priorityTask: 'bug-debugging',
    topRecommendations: ['claude-code', 'cursor', 'aider', 'openai-codex-cli'],
    avoidPatterns: [
      'Letting agents edit data pipelines without running Pytest fixtures and schema assertions.',
      'Pasting raw customer datasets or production PII into non-ZDR cloud chat windows.',
    ],
    rolloutNotes:
      'Python teams get high leverage from terminal agents (Claude Code, OpenAI Codex CLI, Aider) because Pytest, mypy, and ruff give tight, fast feedback loops in the shell.',
    faqs: [
      {
        question: 'Which AI coding assistant works best with Python and Pytest?',
        answer:
          'Claude Code, Cursor, OpenAI Codex CLI, and Aider all integrate cleanly with Pytest, ruff, and mypy. For PyCharm users, JetBrains AI Assistant with Junie or GitHub Copilot keeps the workflow native.',
      },
      {
        question: 'Is Aider still worth using for Python projects?',
        answer:
          'Yes. Aider is open source, written in Python, creates clean automatic git commits for every change, and lets you plug in any API key or local model without monthly seat lock-in.',
      },
    ],
  },
  {
    id: 'java-kotlin-jetbrains',
    slug: 'java-kotlin-jetbrains',
    title: 'Java, Kotlin, and Spring Boot on JetBrains',
    shortTitle: 'Java / Kotlin / JetBrains',
    description:
      'Enterprise JVM and Android teams deeply invested in IntelliJ IDEA, Android Studio, Gradle, Maven, and Spring Boot.',
    typicalRepo: 'Multi-module Gradle or Maven services (50k to 1M+ LOC) in IntelliJ IDEA.',
    defaultEditor: 'jetbrains',
    defaultHosting: 'enterprise-zdr',
    defaultBudget: 'mid-market',
    priorityTask: 'legacy-refactoring',
    topRecommendations: ['jetbrains-ai', 'github-copilot', 'amazon-q-developer', 'augment-code'],
    avoidPatterns: [
      'Forcing IntelliJ IDEA Java teams to migrate to Cursor just to get AI features, losing JVM debugger and PSI refactoring speed.',
      'Skipping deterministic IntelliJ rename/extract refactorings in favor of raw LLM text search-and-replace.',
    ],
    rolloutNotes:
      'Keep developers in IntelliJ IDEA and pair JetBrains AI Assistant (or GitHub Copilot / Augment Code) with Claude Code or Codex CLI in the terminal for big cross-module tasks. AWS Java shops should test Amazon Q /transform for JDK upgrades.',
    faqs: [
      {
        question: 'What is the best AI coding tool for IntelliJ IDEA and Java?',
        answer:
          'JetBrains AI Assistant (with Junie), GitHub Copilot, and Augment Code offer the strongest native IntelliJ experience. For Java 8/11 to 17/21 version migrations, Amazon Q Developer adds dedicated /transform automation.',
      },
      {
        question: 'Can Java teams use Cursor?',
        answer:
          'Cursor is a VS Code fork, so it lacks IntelliJ PSI refactorings and deep Gradle/Spring tooling. Most Java teams stay in IntelliJ and run a terminal agent like Claude Code alongside a native JetBrains plugin.',
      },
    ],
  },
  {
    id: 'go-rust-systems',
    slug: 'go-rust-systems',
    title: 'Go, Rust, CLI, and infrastructure teams',
    shortTitle: 'Go / Rust / Systems',
    description:
      'Systems, platform, DevOps, and backend infrastructure engineers working in Go, Rust, Terraform, and Neovim or VS Code.',
    typicalRepo: 'Go microservices, Rust binaries, Kubernetes manifests, and CI/CD tooling.',
    defaultEditor: 'terminal',
    defaultHosting: 'cloud-saas',
    defaultBudget: 'startup',
    priorityTask: 'bug-debugging',
    topRecommendations: ['claude-code', 'openai-codex-cli', 'aider', 'cursor'],
    avoidPatterns: [
      'Using weak autocomplete models on Rust borrow-checker code without a cargo check feedback loop.',
      'Allowing autonomous agents to run terraform apply or kubectl commands against live clusters.',
    ],
    rolloutNotes:
      'Strong static compilers (go test -race, cargo check, clippy) make terminal agents unusually effective on Go and Rust repositories because compiler errors immediately guide the agent to exact fixes.',
    faqs: [
      {
        question: 'Which AI coding tool is best for Rust and Go?',
        answer:
          'Claude Code and OpenAI Codex CLI perform very well on Rust and Go because they run cargo check, clippy, and go test -race in a loop until compilation and race checks pass. Neovim users often pair them with GitHub Copilot or TabbyML.',
      },
      {
        question: 'What works best for Neovim users?',
        answer:
          'Neovim developers typically pair a lightweight inline completion plugin (GitHub Copilot, TabbyML, or Augment) with a terminal agent like Claude Code, OpenAI Codex CLI, or Aider in a tmux split.',
      },
    ],
  },
  {
    id: 'self-hosted-airgapped',
    slug: 'self-hosted-airgapped',
    title: 'Self-hosted, air-gapped, and local LLM teams',
    shortTitle: 'Self-hosted / Air-gapped',
    description:
      'Regulated finance, defense, healthcare, or privacy-first teams that cannot send source code to external SaaS APIs.',
    typicalRepo: 'Internal GitLab or GitHub Enterprise Server, private VPC or air-gapped GPU cluster.',
    defaultEditor: 'vscode',
    defaultHosting: 'self-hosted',
    defaultBudget: 'enterprise',
    priorityTask: 'inline-autocomplete',
    topRecommendations: ['tabby-ml', 'continue', 'tabnine', 'aider'],
    avoidPatterns: [
      'Assuming a 7B local model on a laptop CPU will match frontier cloud agents on 10-file refactors.',
      'Rolling out unvetted IDE extensions that send telemetry or snippets to public endpoints by default.',
    ],
    rolloutNotes:
      'Separate inline autocomplete from agentic chat: run TabbyML or Continue with a fast 7B-14B FIM model (such as Qwen2.5-Coder) for sub-300ms autocomplete, and route heavier chat or Aider/Cline tasks to a larger VPC-hosted model or Bedrock/Vertex private endpoint.',
    faqs: [
      {
        question: 'What is the best open-source self-hosted alternative to GitHub Copilot?',
        answer:
          'TabbyML and Continue are the two leading open-source choices. TabbyML gives you a turnkey Rust inference and RAG server with team management, while Continue gives flexible client-side config across Ollama, vLLM, and private enterprise endpoints.',
      },
      {
        question: 'Which commercial tool supports full air-gapped deployment?',
        answer:
          'Tabnine Enterprise and Sourcegraph Enterprise (with Cody) offer mature VPC and air-gapped deployment models with enterprise audit logs and IP indemnity.',
      },
    ],
  },
  {
    id: 'enterprise-monorepo',
    slug: 'enterprise-monorepo',
    title: 'Large polyglot monorepos and regulated enterprises',
    shortTitle: 'Enterprise monorepo',
    description:
      'Multi-team organizations with 500k+ lines of code, mixed IDEs, SOC 2 / ZDR compliance requirements, and centralized procurement.',
    typicalRepo: 'Polyglot monorepo (TypeScript, Java, Go, Python) with internal libraries and strict CI gates.',
    defaultEditor: 'vscode',
    defaultHosting: 'enterprise-zdr',
    defaultBudget: 'enterprise',
    priorityTask: 'pr-code-review',
    topRecommendations: ['github-copilot', 'augment-code', 'sourcegraph-cody', 'claude-code'],
    avoidPatterns: [
      'Evaluating tools only on toy greenfield repos instead of testing against internal shared libraries and build scripts.',
      'Buying seats without defining repo-level instruction files (AGENTS.md, CLAUDE.md, copilot-instructions.md).',
    ],
    rolloutNotes:
      'Enterprise rollouts succeed when teams standardize on one baseline IDE tool (GitHub Copilot Enterprise or Augment Code) for broad coverage, plus an approved ZDR terminal agent (Claude Code via Bedrock/Vertex or Codex Enterprise) for complex refactors.',
    faqs: [
      {
        question: 'Which AI coding tools handle multi-million-line monorepos best?',
        answer:
          'Augment Code and Sourcegraph Cody are purpose-built for deep indexing across huge monorepos and multi-repo graphs. Claude Code and GitHub Copilot Enterprise also scale well when paired with clear repository instructions.',
      },
      {
        question: 'How do enterprises control data privacy with AI coding tools?',
        answer:
          'Require zero-data-retention (ZDR) enterprise contracts, disable training on customer code, restrict MCP server access, or route BYOK tools like Cline, Continue, and Claude Code through private AWS Bedrock or Google Vertex AI endpoints.',
      },
    ],
  },
];
