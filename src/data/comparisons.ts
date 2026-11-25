import type { ComparisonPair } from './types';

export const COMPARISON_PAIRS: ComparisonPair[] = [
  {
    slug: 'cursor-vs-github-copilot',
    toolAId: 'cursor',
    toolBId: 'github-copilot',
    title: 'Cursor vs GitHub Copilot: side-by-side comparison on identical tasks',
    metaDescription:
      'Compare Cursor vs GitHub Copilot across multi-file features, refactoring, PR code review, inline autocomplete, IDE support, and team pricing.',
    summary:
      'Cursor leads on multi-line Tab predictions and tight agent workflows inside its VS Code fork. GitHub Copilot wins on broad IDE support (JetBrains, Neovim, Visual Studio), lower starting price, and native GitHub PR reviews.',
    whenToPickA: [
      'Your engineering team already standardizes on VS Code and wants the fastest multi-line Tab experience.',
      'Developers rely heavily on multi-file Agent mode with inline diff review.',
      'You want fast model switching and codebase indexing out of the box.',
    ],
    whenToPickB: [
      'Your organization uses JetBrains IDEs, Visual Studio, or Neovim alongside VS Code.',
      'You want native GitHub PR code reviews, GitHub Issues integration, and simpler enterprise procurement.',
      'Budget matters: Copilot Pro ($10/mo) and Business ($19/user/mo) cost roughly half of Cursor tiers.',
    ],
    verdict:
      'Choose Cursor for VS Code-only product teams optimizing for speed on multi-file feature work. Choose GitHub Copilot for mixed-IDE organizations and enterprises already standardized on GitHub.',
    faqs: [
      {
        question: 'Is Cursor better than GitHub Copilot for multi-file editing?',
        answer:
          'In day-to-day VS Code workflows, Cursor Agent and Tab next-edit predictions still feel faster and more cohesive than GitHub Copilot on complex multi-file tasks, though Copilot Agent mode has narrowed the gap.',
      },
      {
        question: 'Can you use Cursor with JetBrains IntelliJ IDEA?',
        answer:
          'No. Cursor is a standalone fork of VS Code. Teams that stay in IntelliJ IDEA, PyCharm, or Rider should use GitHub Copilot, JetBrains AI Assistant, or Augment Code.',
      },
    ],
  },
  {
    slug: 'claude-code-vs-cursor',
    toolAId: 'claude-code',
    toolBId: 'cursor',
    title: 'Claude Code vs Cursor: terminal agent vs agentic IDE',
    metaDescription:
      'Compare Claude Code vs Cursor on multi-file features, legacy refactoring, debugging, test loops, and inline autocomplete.',
    summary:
      'Claude Code is a terminal-native agent built for autonomous planning, refactoring, and debugging across any editor. Cursor is an all-in-one IDE combining fast inline Tab autocomplete with visual diff-based agents.',
    whenToPickA: [
      'You want the strongest autonomous execution on large refactors, root-cause debugging, and test-driven loops.',
      'Your team uses mixed editors (Neovim, JetBrains, VS Code) and wants one consistent workflow in the shell and CI.',
      'You prefer inspecting changes with git diff and running real build pipelines directly.',
    ],
    whenToPickB: [
      'You want low-latency inline ghost-text autocomplete while actively typing code.',
      'You prefer visual inline accept/reject hunks inside a VS Code editor.',
      'You want one subscription covering both quick Tab edits and multi-file agent tasks.',
    ],
    verdict:
      'Many senior teams do not treat this as an either/or decision: they use Cursor (or Copilot) for inline Tab editing and run Claude Code in the terminal for heavy refactors, debugging, and headless CI checks.',
    faqs: [
      {
        question: 'Does Claude Code replace Cursor?',
        answer:
          'Claude Code can replace Cursor Agent mode for multi-file features and refactors, but it does not provide inline Tab autocomplete. Developers who rely on ghost-text completions keep an IDE extension alongside Claude Code.',
      },
      {
        question: 'Which is better for large legacy codebase refactoring?',
        answer:
          'Claude Code generally holds up better on large 20+ file migrations and tricky compiler loops because it works directly in the shell with ripgrep, git, and test runners.',
      },
    ],
  },
  {
    slug: 'windsurf-vs-cursor',
    toolAId: 'windsurf',
    toolBId: 'cursor',
    title: 'Windsurf vs Cursor: Cascade flows vs Cursor Agent',
    metaDescription:
      'Compare Windsurf vs Cursor across Cascade vs Agent mode, Supercomplete vs Cursor Tab, pricing, JetBrains support, and enterprise hosting.',
    summary:
      'Both tools are VS Code-based agentic IDEs with strong autocomplete. Windsurf undercuts Cursor on price ($15 vs $20 Pro) and offers enterprise self-hosted options plus a JetBrains plugin; Cursor holds an edge in Tab next-edit maturity and community adoption.',
    whenToPickA: [
      'You want lower per-seat pricing for individuals ($15/mo) and teams ($30/user/mo).',
      'Some developers on your team use JetBrains IDEs and need matching autocomplete plugins.',
      'Your security team requires enterprise self-hosted or VPC deployment options.',
    ],
    whenToPickB: [
      'You want the most mature multi-line Tab next-edit prediction engine in VS Code.',
      'Your team relies on community .cursor/rules ecosystems and fast frontier model rollouts.',
      'You want reliable handling on complex multi-file TypeScript and Python edits.',
    ],
    verdict:
      'Pick Cursor if your team is all-in on VS Code and prioritizes peak Tab and Agent polish. Pick Windsurf if you want strong agentic IDE capabilities at a lower price point or need JetBrains and enterprise hosting coverage.',
    faqs: [
      {
        question: 'Is Windsurf cheaper than Cursor?',
        answer:
          'Yes. Windsurf Pro starts at $15/month and Teams at $30/user/month, compared to Cursor Pro at $20/month and Teams at $40/user/month.',
      },
      {
        question: 'Does Windsurf support JetBrains IDEs?',
        answer:
          'Yes. While the Windsurf Editor itself is VS Code-based, Windsurf provides official plugins for JetBrains IDEs, whereas Cursor does not.',
      },
    ],
  },
  {
    slug: 'aider-vs-claude-code',
    toolAId: 'aider',
    toolBId: 'claude-code',
    title: 'Aider vs Claude Code: open-source BYOK CLI vs Anthropic agent',
    metaDescription:
      'Compare Aider vs Claude Code on git workflows, autonomous repo search, BYOK model freedom, local LLMs, and total cost.',
    summary:
      'Aider is an Apache-2.0 open-source terminal tool with automatic git commits and universal model support (including local Ollama). Claude Code is Anthropic-built with deeper autonomous repo search, MCP tools, and subscription billing.',
    whenToPickA: [
      'You want an open-source tool that works with any provider (OpenRouter, DeepSeek, OpenAI, Anthropic, or local Ollama).',
      'You love automatic, atomic git commits for every single AI edit.',
      'You want predictable, explicit control over which files enter the prompt via /add.',
    ],
    whenToPickB: [
      'You want the agent to search the codebase, inspect git history, and discover files on its own.',
      'You need MCP server integrations and headless CI/CD workflows.',
      'You prefer bundled Claude Pro/Max subscription pricing instead of managing raw API billing.',
    ],
    verdict:
      'Pick Aider for open-source flexibility, local models, and strict git-commit discipline. Pick Claude Code for deeper autonomous exploration on large codebases with less manual file management.',
    faqs: [
      {
        question: 'Can Aider run completely locally without cloud APIs?',
        answer:
          'Yes. Aider connects directly to local Ollama, vLLM, or OpenAI-compatible inference servers, making it usable in private or offline environments.',
      },
      {
        question: 'Does Claude Code support auto-committing to git like Aider?',
        answer:
          'Claude Code can run git commit when asked, but unlike Aider it does not automatically commit every single edit by default.',
      },
    ],
  },
  {
    slug: 'cline-vs-continue',
    toolAId: 'cline',
    toolBId: 'continue',
    title: 'Cline vs Continue: open-source VS Code agent vs full BYOK assistant',
    metaDescription:
      'Compare Cline vs Continue for open-source AI coding in VS Code and JetBrains, covering multi-file agents, inline autocomplete, BYOK, and Ollama.',
    summary:
      'Cline focuses on autonomous multi-file Plan/Act execution with terminal and browser tools. Continue covers both inline Tab autocomplete and customizable chat/agent workflows across VS Code and JetBrains.',
    whenToPickA: [
      'You want an autonomous multi-file coding agent inside upstream VS Code with step-by-step approval and live token cost tracking.',
      'You want built-in headless browser inspection and strong MCP tool execution.',
      'You already have another extension handling inline autocomplete.',
    ],
    whenToPickB: [
      'You need private, configurable inline Tab autocomplete backed by Ollama, vLLM, or Codestral.',
      'Your team uses both VS Code and JetBrains IDEs and wants shared YAML configuration.',
      'You want one open-source extension covering autocomplete, inline edits, and chat.',
    ],
    verdict:
      'Many open-source VS Code users install both: Continue for fast local or BYOK inline autocomplete, and Cline for heavy multi-file Plan/Act agent tasks.',
    faqs: [
      {
        question: 'Does Cline have inline Tab autocomplete?',
        answer:
          'No. Cline is a sidebar coding agent focused on multi-file edits, terminal commands, and MCP tools. Pair it with Continue or TabbyML if you want inline ghost-text completions.',
      },
      {
        question: 'Which is better for self-hosted Ollama models?',
        answer:
          'Continue is stronger for local Ollama autocomplete (using FIM models like Qwen2.5-Coder), while Cline requires larger, strong tool-calling models to run its autonomous Plan/Act loop reliably.',
      },
    ],
  },
  {
    slug: 'codex-cli-vs-claude-code',
    toolAId: 'openai-codex-cli',
    toolBId: 'claude-code',
    title: 'OpenAI Codex CLI vs Claude Code: terminal coding agents compared',
    metaDescription:
      'Compare OpenAI Codex CLI vs Claude Code on sandboxing, open-source license, debugging, refactoring, MCP support, and pricing.',
    summary:
      'Both are first-party terminal coding agents with MCP support and subscription or API billing. OpenAI Codex CLI is Apache-2.0 open source with OS-level sandboxing and strong reasoning on hard bugs; Claude Code leads in interactive ergonomics and sustained multi-file coding sessions.',
    whenToPickA: [
      'You prefer an open-source CLI binary with built-in OS-level workspace sandboxing.',
      'Your organization already pays for ChatGPT Plus/Pro or Enterprise OpenAI API agreements.',
      'You value high-precision code reviews and deep reasoning on concurrency or algorithmic bugs.',
    ],
    whenToPickB: [
      'You want the smoothest interactive Plan/Act terminal workflow for long multi-file features.',
      'Your team uses AWS Bedrock or Google Vertex AI for enterprise Claude ZDR hosting.',
      'You rely on rich slash commands, hooks, and subagent workflows in daily development.',
    ],
    verdict:
      'Both tools sit at the top of terminal coding agents. Pick OpenAI Codex CLI if you want an Apache-2.0 sandboxed CLI tied to OpenAI billing; pick Claude Code if you prefer Anthropic models, Bedrock/Vertex hosting, and interactive terminal ergonomics.',
    faqs: [
      {
        question: 'Is OpenAI Codex CLI open source?',
        answer:
          'Yes. OpenAI Codex CLI is published under the Apache-2.0 license on GitHub, whereas the Claude Code CLI client is proprietary.',
      },
      {
        question: 'Do both Codex CLI and Claude Code support MCP servers?',
        answer:
          'Yes. Both support Model Context Protocol (MCP) servers for connecting external docs, databases, and issue trackers.',
      },
    ],
  },
  {
    slug: 'tabby-vs-github-copilot',
    toolAId: 'tabby-ml',
    toolBId: 'github-copilot',
    title: 'TabbyML vs GitHub Copilot: self-hosted open source vs cloud SaaS',
    metaDescription:
      'Compare TabbyML vs GitHub Copilot on privacy, air-gapped hosting, autocomplete quality, multi-file agents, GPU requirements, and cost.',
    summary:
      'TabbyML gives you full code ownership and self-hosted Rust inference with zero external API calls. GitHub Copilot provides stronger multi-file agents, native PR reviews, and zero GPU operations overhead.',
    whenToPickA: [
      'Compliance or security policy forbids sending source code to third-party cloud APIs.',
      'You have internal GPU capacity and want a free, Apache-2.0 self-hosted autocomplete server.',
      'You want VS Code, JetBrains, and Neovim completions powered by open weights like Qwen2.5-Coder.',
    ],
    whenToPickB: [
      'You want multi-file Agent mode and native GitHub PR code reviews without managing GPU servers.',
      'Your team can use cloud SaaS with enterprise zero-data-retention terms.',
      'You want frontier model quality with minimal setup time.',
    ],
    verdict:
      'Choose TabbyML when data residency or air-gapping is mandatory and you primarily need private inline autocomplete. Choose GitHub Copilot when cloud ZDR is acceptable and you want full agentic and PR review capabilities.',
    faqs: [
      {
        question: 'Can TabbyML run without internet access?',
        answer:
          'Yes. Once model weights are downloaded onto your internal server, TabbyML runs completely offline inside an air-gapped network.',
      },
      {
        question: 'Does TabbyML have an autonomous agent like Copilot Agent mode?',
        answer:
          'No. TabbyML focuses on inline code completion and repository Q&A chat. Teams needing self-hosted multi-file editing typically pair it with Aider or Continue.',
      },
    ],
  },
  {
    slug: 'amazon-q-vs-github-copilot',
    toolAId: 'amazon-q-developer',
    toolBId: 'github-copilot',
    title: 'Amazon Q Developer vs GitHub Copilot: AWS stack vs GitHub ecosystem',
    metaDescription:
      'Compare Amazon Q Developer vs GitHub Copilot on Java/.NET /transform upgrades, security scanning, AWS integration, IDE support, and pricing.',
    summary:
      'Amazon Q Developer stands out for AWS-native workflows, automated Java/.NET version transforms, and built-in /review security scanning. GitHub Copilot offers stronger general multi-file agents, native GitHub PR reviews, and wider editor support.',
    whenToPickA: [
      'Your infrastructure runs heavily on AWS (CDK, IAM, Lambda, CloudFormation).',
      'You have legacy Java 8/11 or .NET codebases that benefit from automated /transform upgrades.',
      'You want integrated static + AI security scanning (/review) bundled in the same $19/mo Pro seat.',
    ],
    whenToPickB: [
      'Your repositories and CI/CD live in GitHub and you want native PR reviews and Issue assignment.',
      'You have polyglot teams across TypeScript, Python, Go, and Neovim.',
      'You want faster inline Next Edit Suggestions and multi-model flexibility.',
    ],
    verdict:
      'Pick Amazon Q Developer if your primary bottleneck is AWS architecture or legacy Java/.NET upgrades. Pick GitHub Copilot for broader polyglot development and GitHub-native workflows.',
    faqs: [
      {
        question: 'How does pricing compare between Amazon Q Developer and GitHub Copilot?',
        answer:
          'Both offer free individual tiers and $19/user/month business seats (Amazon Q Developer Pro vs GitHub Copilot Business). Copilot also offers a $10/month individual Pro plan.',
      },
      {
        question: 'Which is better for Java Spring Boot migrations?',
        answer:
          'Amazon Q Developer has a distinct advantage for Java 8/11 to Java 17/21 migrations thanks to its dedicated /transform workflow that updates dependencies, builds the project, and fixes compile errors.',
      },
    ],
  },
];
