import { useEffect, useState } from 'react';
import { CODING_TOOLS } from './data/tools';
import { BENCHMARK_TASKS } from './data/tasks';
import { STACK_PROFILES } from './data/stacks';
import { COMPARISON_PAIRS } from './data/comparisons';
import {
  TaskComparisonWorkbench,
  fitBadgeClass,
} from './components/TaskComparisonWorkbench';
import { TeamStackSelector } from './components/TeamStackSelector';
import { ToolMatrixTable } from './components/ToolMatrixTable';
import type { TaskId } from './data/types';
import { getFitWeight } from './engine/selector';

const BASE_PATH = '/ai-coding-tools';
const REPO_URL = 'https://github.com/developer-assistants/ai-coding-tools';
const SOURCE_URL = 'https://github.com/sourcegraph/awesome-code-ai';

function normalizePath(pathname: string): string {
  let p = pathname;
  if (p.startsWith(BASE_PATH)) {
    p = p.slice(BASE_PATH.length);
  }
  if (!p.startsWith('/')) p = '/' + p;
  if (!p.endsWith('/')) p = p + '/';
  return p;
}

export default function App() {
  const [route, setRoute] = useState<string>(() => normalizePath(window.location.pathname));
  const [heroTaskId, setHeroTaskId] = useState<TaskId>('multi-file-feature');

  useEffect(() => {
    function onPopState() {
      setRoute(normalizePath(window.location.pathname));
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  function navigate(nextRoute: string) {
    const clean = normalizePath(nextRoute);
    const fullUrl = clean === '/' ? `${BASE_PATH}/` : `${BASE_PATH}${clean}`;
    window.history.pushState({}, '', fullUrl);
    setRoute(clean);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function linkProps(targetRoute: string) {
    const clean = normalizePath(targetRoute);
    return {
      href: clean === '/' ? `${BASE_PATH}/` : `${BASE_PATH}${clean}`,
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(clean);
      },
    };
  }

  const compareMatch = route.match(/^\/compare\/([^/]+)\/$/);
  const stackMatch = route.match(/^\/stacks\/([^/]+)\/$/);
  const taskMatch = route.match(/^\/tasks\/([^/]+)\/$/);

  const activePair = compareMatch
    ? COMPARISON_PAIRS.find((c) => c.slug === compareMatch[1])
    : undefined;
  const activeStack = stackMatch
    ? STACK_PROFILES.find((s) => s.slug === stackMatch[1])
    : undefined;
  const activeTask = taskMatch
    ? BENCHMARK_TASKS.find((t) => t.slug === taskMatch[1])
    : undefined;

  const heroTools = ['cursor', 'claude-code', 'github-copilot', 'tabby-ml']
    .map((id) => CODING_TOOLS.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const heroTask =
    BENCHMARK_TASKS.find((t) => t.id === heroTaskId) ?? BENCHMARK_TASKS[0];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="console-header">
        <div className="console-container flex items-center justify-between gap-4 py-3.5">
          <div className="flex items-center gap-8">
            <a
              {...linkProps('/')}
              className="text-base font-medium no-underline whitespace-nowrap"
              style={{ color: 'var(--color-ink)' }}
            >
              AI Coding Tools
            </a>

            <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-6">
              <a
                {...linkProps('/')}
                aria-current={route === '/' ? 'page' : undefined}
                className="console-nav-link"
              >
                Workbench
              </a>
              <a
                {...linkProps('/compare/')}
                aria-current={route.startsWith('/compare/') ? 'page' : undefined}
                className="console-nav-link"
              >
                Comparisons
              </a>
              <a
                {...linkProps('/stacks/')}
                aria-current={route.startsWith('/stacks/') ? 'page' : undefined}
                className="console-nav-link"
              >
                Team stacks
              </a>
              <a
                {...linkProps('/tasks/')}
                aria-current={route.startsWith('/tasks/') ? 'page' : undefined}
                className="console-nav-link"
              >
                Task benchmarks
              </a>
              <a
                {...linkProps('/tools/')}
                aria-current={route === '/tools/' ? 'page' : undefined}
                className="console-nav-link"
              >
                All 16 tools
              </a>
            </nav>
          </div>

          <a href={REPO_URL} target="_blank" rel="noreferrer" className="btn">
            GitHub repo
          </a>
        </div>
      </header>

      <main className="console-container flex-1 py-12">
        {activePair ? (
          <ComparisonDetailView pair={activePair} linkProps={linkProps} navigate={navigate} />
        ) : activeStack ? (
          <StackDetailView stack={activeStack} linkProps={linkProps} navigate={navigate} />
        ) : activeTask ? (
          <TaskDetailView task={activeTask} linkProps={linkProps} navigate={navigate} />
        ) : route === '/compare/' ? (
          <div className="space-y-8">
            <div className="space-y-3 max-w-3xl">
              <a {...linkProps('/')} className="text-sm console-link">
                Back to workbench
              </a>
              <h1 className="text-3xl sm:text-4xl">Head-to-head AI coding tool comparisons</h1>
              <p className="console-lede">
                Direct breakdowns of common team evaluations across multi-file features, refactoring, debugging, test generation, PR review, and inline autocomplete.
              </p>
            </div>
            <div className="console-grid grid-cols-1 md:grid-cols-2">
              {COMPARISON_PAIRS.map((pair) => (
                <a
                  key={pair.slug}
                  {...linkProps(`/compare/${pair.slug}/`)}
                  className="p-5 block no-underline hover:opacity-95"
                >
                  <h2 className="text-lg">{pair.title}</h2>
                  <p className="mt-2 text-sm console-muted">{pair.summary}</p>
                </a>
              ))}
            </div>
          </div>
        ) : route === '/stacks/' ? (
          <div className="space-y-8">
            <div className="space-y-3 max-w-3xl">
              <a {...linkProps('/')} className="text-sm console-link">
                Back to workbench
              </a>
              <h1 className="text-3xl sm:text-4xl">AI coding tool recommendations by team stack</h1>
              <p className="console-lede">
                Pick a stack profile to inspect native editor fit, hosting models, rollout patterns, and ranked tools.
              </p>
            </div>
            <div className="console-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {STACK_PROFILES.map((stack) => (
                <a
                  key={stack.slug}
                  {...linkProps(`/stacks/${stack.slug}/`)}
                  className="p-5 block no-underline"
                >
                  <h2 className="text-lg">{stack.title}</h2>
                  <p className="mt-2 text-sm console-muted">{stack.description}</p>
                  <p className="mt-3 measured text-xs" style={{ color: 'var(--color-cool)' }}>
                    Top picks:{' '}
                    {stack.topRecommendations
                      .map((id) => CODING_TOOLS.find((t) => t.id === id)?.name)
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </a>
              ))}
            </div>
          </div>
        ) : route === '/tasks/' ? (
          <div className="space-y-8">
            <div className="space-y-3 max-w-3xl">
              <a {...linkProps('/')} className="text-sm console-link">
                Back to workbench
              </a>
              <h1 className="text-3xl sm:text-4xl">Identical engineering task benchmarks</h1>
              <p className="console-lede">
                Six repeatable tasks used to evaluate all 16 AI coding tools under identical prompts and verification criteria.
              </p>
            </div>
            <div className="console-grid grid-cols-1 md:grid-cols-2">
              {BENCHMARK_TASKS.map((task) => (
                <a
                  key={task.slug}
                  {...linkProps(`/tasks/${task.slug}/`)}
                  className="p-5 block no-underline"
                >
                  <h2 className="text-lg">{task.title}</h2>
                  <p className="mt-2 text-sm console-muted">{task.summary}</p>
                  <p className="mt-3 measured text-xs" style={{ color: 'var(--color-cool)' }}>
                    {task.filesTouched}
                  </p>
                </a>
              ))}
            </div>
          </div>
        ) : route === '/tools/' ? (
          <div className="space-y-8">
            <div className="space-y-3">
              <a {...linkProps('/')} className="text-sm console-link">
                Back to workbench
              </a>
              <h1 className="text-3xl sm:text-4xl">All 16 AI coding tools compared</h1>
            </div>
            <ToolMatrixTable />
          </div>
        ) : (
          <div className="space-y-20">
            {/* Stage Hero: head on cols 1-5, live Signature console panel on cols 6-12 */}
            <section className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center py-4">
              <div className="lg:col-span-5 space-y-5">
                <h1 className="text-4xl sm:text-5xl">
                  Compare AI coding tools on real tasks
                </h1>
                <p className="text-base sm:text-lg console-lede">
                  Evaluate 16 assistants on six identical tasks and match your stack.
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <a href="#same-task-comparison" className="btn btn--primary">
                    Compare on identical tasks
                  </a>
                  <a href="#team-stack-selector" className="btn">
                    Match team stack
                  </a>
                </div>
              </div>

              {/* Signature: live same-task comparison record in the hero */}
              <div className="lg:col-span-7 console-panel">
                <div
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
                  style={{ borderBottom: 'var(--rule-hair) solid var(--color-rule)' }}
                >
                  <span className="text-sm font-medium">{heroTask.title}</span>
                  <span className="measured text-xs console-muted">{heroTask.filesTouched}</span>
                </div>

                <div
                  className="flex overflow-x-auto"
                  style={{
                    gap: 'var(--rule-hair)',
                    backgroundColor: 'var(--color-rule)',
                    borderBottom: 'var(--rule-hair) solid var(--color-rule)',
                  }}
                >
                  {BENCHMARK_TASKS.slice(0, 4).map((t) => {
                    const active = t.id === heroTaskId;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setHeroTaskId(t.id)}
                        aria-pressed={active}
                        className="console-tab flex-1"
                        style={{
                          backgroundColor: active
                            ? 'var(--color-cool-soft)'
                            : 'var(--color-paper-2)',
                          color: active ? 'var(--color-ink)' : 'var(--color-muted)',
                        }}
                      >
                        {t.shortTitle}
                      </button>
                    );
                  })}
                </div>

                <table className="console-table">
                  <thead>
                    <tr>
                      <th>Tool</th>
                      <th>Fit</th>
                      <th>Workflow mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heroTools.map((tool) => {
                      const ev = tool.tasks[heroTaskId];
                      return (
                        <tr key={tool.id}>
                          <td className="font-medium">{tool.name}</td>
                          <td>
                            <span className={fitBadgeClass(ev.fit)}>{ev.fit}</span>
                          </td>
                          <td className="text-xs console-lede">{ev.workflowMode}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="console-well px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span style={{ color: 'var(--color-accent)' }}>
                    Verified November 2026 pricing and capabilities
                  </span>
                  <span className="measured console-muted">
                    Successor to sourcegraph/awesome-code-ai
                  </span>
                </div>
              </div>
            </section>

            <TaskComparisonWorkbench onNavigate={navigate} />

            <TeamStackSelector onNavigate={navigate} />

            <ToolMatrixTable />

            {/* Internal linking hub */}
            <section className="console-grid grid-cols-1 lg:grid-cols-2">
              <div className="p-6 space-y-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-xl">Head-to-head comparisons</h2>
                  <a {...linkProps('/compare/')} className="text-sm console-link whitespace-nowrap">
                    All 8
                  </a>
                </div>
                <ul>
                  {COMPARISON_PAIRS.map((pair) => (
                    <li
                      key={pair.slug}
                      className="py-2.5"
                      style={{ borderBottom: 'var(--rule-hair) solid var(--color-rule)' }}
                    >
                      <a
                        {...linkProps(`/compare/${pair.slug}/`)}
                        className="text-sm console-link whitespace-nowrap"
                      >
                        {pair.title.split(':')[0].replace('OpenAI ', '').replace(' Developer', '')}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-xl">Guides by team stack</h2>
                  <a {...linkProps('/stacks/')} className="text-sm console-link whitespace-nowrap">
                    All 6
                  </a>
                </div>
                <ul>
                  {STACK_PROFILES.map((stack) => (
                    <li
                      key={stack.slug}
                      className="py-2.5"
                      style={{ borderBottom: 'var(--rule-hair) solid var(--color-rule)' }}
                    >
                      <a
                        {...linkProps(`/stacks/${stack.slug}/`)}
                        className="text-sm console-link whitespace-nowrap"
                      >
                        {stack.shortTitle}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* FAQ section */}
            <section className="space-y-5">
              <h2 className="text-2xl">Frequently asked questions</h2>
              <div className="console-grid grid-cols-1 md:grid-cols-3">
                <div className="p-5 space-y-2">
                  <h3 className="text-base">
                    Which AI coding tool is best for multi-file features?
                  </h3>
                  <p className="text-sm console-muted">
                    Claude Code, Cursor, OpenAI Codex CLI, Cline, and Windsurf handle multi-file features well because they search the repo, edit coordinated files, and run tests in a loop.
                  </p>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="text-base">
                    What is the best self-hosted alternative to GitHub Copilot?
                  </h3>
                  <p className="text-sm console-muted">
                    TabbyML runs as a single Rust server for private inline autocomplete and codebase Q&amp;A. Continue connects VS Code and JetBrains to Ollama, vLLM, or private VPC endpoints.
                  </p>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="text-base">
                    How is this related to sourcegraph/awesome-code-ai?
                  </h3>
                  <p className="text-sm console-muted">
                    Sourcegraph archived awesome-code-ai after cataloging early AI coding links. This workbench turns the active tools from that ecosystem into a same-task comparison and stack selector.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="console-footer">
        <div className="console-container flex flex-col gap-3 py-6 text-xs console-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            Maintained by{' '}
            <a
              href="https://github.com/developer-assistants"
              target="_blank"
              rel="noreferrer"
              className="console-link"
            >
              developer-assistants
            </a>
            . Built as a practical successor to{' '}
            <a href={SOURCE_URL} target="_blank" rel="noreferrer" className="console-link">
              sourcegraph/awesome-code-ai
            </a>
            .
          </p>
          <div className="flex flex-wrap gap-5">
            <a {...linkProps('/compare/')} className="console-nav-link">
              Comparisons
            </a>
            <a {...linkProps('/stacks/')} className="console-nav-link">
              Team stacks
            </a>
            <a {...linkProps('/tasks/')} className="console-nav-link">
              Tasks
            </a>
            <a href={`${BASE_PATH}/llms.txt`} className="console-nav-link">
              llms.txt
            </a>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="console-nav-link">
              GitHub repo
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ComparisonDetailView({
  pair,
  linkProps,
  navigate,
}: {
  pair: (typeof COMPARISON_PAIRS)[number];
  linkProps: (r: string) => {
    href: string;
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  };
  navigate: (r: string) => void;
}) {
  const toolA = CODING_TOOLS.find((t) => t.id === pair.toolAId)!;
  const toolB = CODING_TOOLS.find((t) => t.id === pair.toolBId)!;

  return (
    <div className="space-y-12">
      <div className="space-y-3 max-w-4xl">
        <a {...linkProps('/compare/')} className="text-sm console-link">
          All comparisons
        </a>
        <h1 className="text-3xl sm:text-4xl">{pair.title}</h1>
        <p className="text-base console-lede">{pair.summary}</p>
      </div>

      <div className="console-panel overflow-x-auto">
        <table className="console-table min-w-[700px]">
          <thead>
            <tr>
              <th>Identical task</th>
              <th>{toolA.name}</th>
              <th>{toolB.name}</th>
            </tr>
          </thead>
          <tbody>
            {BENCHMARK_TASKS.map((task) => {
              const a = toolA.tasks[task.id];
              const b = toolB.tasks[task.id];
              return (
                <tr key={task.id}>
                  <td className="font-medium w-56">
                    <a {...linkProps(`/tasks/${task.slug}/`)} className="console-link">
                      {task.shortTitle}
                    </a>
                  </td>
                  <td className="text-xs space-y-1.5">
                    <div>
                      <span className={fitBadgeClass(a.fit)}>{a.fit}</span>
                    </div>
                    <p className="console-lede">{a.strength}</p>
                  </td>
                  <td className="text-xs space-y-1.5">
                    <div>
                      <span className={fitBadgeClass(b.fit)}>{b.fit}</span>
                    </div>
                    <p className="console-lede">{b.strength}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="console-grid grid-cols-1 md:grid-cols-2">
        <div className="p-6 space-y-3">
          <h2 className="text-lg">When to pick {toolA.name}</h2>
          <ul className="space-y-2 text-sm console-lede list-disc pl-5">
            {pair.whenToPickA.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="p-6 space-y-3">
          <h2 className="text-lg">When to pick {toolB.name}</h2>
          <ul className="space-y-2 text-sm console-lede list-disc pl-5">
            {pair.whenToPickB.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="console-panel p-6 space-y-2">
        <h2 className="text-lg" style={{ color: 'var(--color-accent)' }}>
          Verdict
        </h2>
        <p className="text-sm console-lede">{pair.verdict}</p>
      </div>

      <TaskComparisonWorkbench
        initialToolIds={[toolA.id, toolB.id]}
        onNavigate={navigate}
      />
    </div>
  );
}

function StackDetailView({
  stack,
  linkProps,
  navigate,
}: {
  stack: (typeof STACK_PROFILES)[number];
  linkProps: (r: string) => {
    href: string;
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  };
  navigate: (r: string) => void;
}) {
  return (
    <div className="space-y-12">
      <div className="space-y-3 max-w-4xl">
        <a {...linkProps('/stacks/')} className="text-sm console-link">
          All team stacks
        </a>
        <h1 className="text-3xl sm:text-4xl">
          Best AI coding tools for {stack.title.toLowerCase()}
        </h1>
        <p className="text-base console-lede">{stack.description}</p>
        <p className="measured text-xs console-muted">Environment: {stack.typicalRepo}</p>
      </div>

      <TeamStackSelector initialStack={stack.id} onNavigate={navigate} />

      <div className="console-panel p-6 space-y-3">
        <h2 className="text-lg">Common pitfalls to avoid</h2>
        <ul className="space-y-2 text-sm console-lede list-disc pl-5">
          {stack.avoidPatterns.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TaskDetailView({
  task,
  linkProps,
  navigate,
}: {
  task: (typeof BENCHMARK_TASKS)[number];
  linkProps: (r: string) => {
    href: string;
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  };
  navigate: (r: string) => void;
}) {
  const sortedTools = [...CODING_TOOLS].sort(
    (a, b) =>
      getFitWeight(b.tasks[task.id].fit) - getFitWeight(a.tasks[task.id].fit) ||
      a.name.localeCompare(b.name),
  );

  return (
    <div className="space-y-12">
      <div className="space-y-3 max-w-4xl">
        <a {...linkProps('/tasks/')} className="text-sm console-link">
          All task benchmarks
        </a>
        <h1 className="text-3xl sm:text-4xl">{task.title}</h1>
        <p className="text-base console-lede">{task.scenario}</p>
      </div>

      <TaskComparisonWorkbench
        initialTaskId={task.id}
        initialToolIds={sortedTools.slice(0, 4).map((t) => t.id)}
        onNavigate={navigate}
      />

      <div className="console-panel overflow-x-auto">
        <table className="console-table min-w-[760px]">
          <thead>
            <tr>
              <th>Tool</th>
              <th>Fit</th>
              <th>Workflow mode</th>
              <th>Works well</th>
              <th>Tradeoff</th>
            </tr>
          </thead>
          <tbody>
            {sortedTools.map((tool) => {
              const ev = tool.tasks[task.id];
              return (
                <tr key={tool.id}>
                  <td className="font-medium">{tool.name}</td>
                  <td>
                    <span className={fitBadgeClass(ev.fit)}>{ev.fit}</span>
                  </td>
                  <td className="text-xs console-lede">{ev.workflowMode}</td>
                  <td className="text-xs console-lede">{ev.strength}</td>
                  <td className="text-xs console-muted">{ev.tradeoff}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
