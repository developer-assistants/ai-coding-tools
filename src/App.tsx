import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Code2, ExternalLink, GitCompare, Layers } from 'lucide-react';
import { CODING_TOOLS } from './data/tools';
import { BENCHMARK_TASKS } from './data/tasks';
import { STACK_PROFILES } from './data/stacks';
import { COMPARISON_PAIRS } from './data/comparisons';
import { TaskComparisonWorkbench } from './components/TaskComparisonWorkbench';
import { TeamStackSelector } from './components/TeamStackSelector';
import { ToolMatrixTable } from './components/ToolMatrixTable';

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

  // Match dynamic routes
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navigation */}
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a
            {...linkProps('/')}
            className="flex items-center gap-2 font-semibold text-stone-900"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-700 text-white">
              <Code2 className="h-4 w-4" />
            </span>
            <span className="tracking-tight">AI Coding Tools</span>
          </a>

          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6 text-sm text-stone-600">
            <a {...linkProps('/')} className={route === '/' ? 'font-semibold text-teal-800' : 'hover:text-stone-900'}>
              Workbench
            </a>
            <a {...linkProps('/compare/')} className={route.startsWith('/compare/') ? 'font-semibold text-teal-800' : 'hover:text-stone-900'}>
              Comparisons
            </a>
            <a {...linkProps('/stacks/')} className={route.startsWith('/stacks/') ? 'font-semibold text-teal-800' : 'hover:text-stone-900'}>
              Team Stacks
            </a>
            <a {...linkProps('/tasks/')} className={route.startsWith('/tasks/') ? 'font-semibold text-teal-800' : 'hover:text-stone-900'}>
              Task Benchmarks
            </a>
            <a {...linkProps('/tools/')} className={route === '/tools/' ? 'font-semibold text-teal-800' : 'hover:text-stone-900'}>
              All 16 Tools
            </a>
          </nav>

          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-800 hover:bg-stone-100"
          >
            GitHub
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
        {/* 1. Head-to-head comparison detail page */}
        {activePair ? (
          <ComparisonDetailView pair={activePair} linkProps={linkProps} navigate={navigate} />
        ) : activeStack ? (
          /* 2. Stack profile detail page */
          <StackDetailView stack={activeStack} linkProps={linkProps} navigate={navigate} />
        ) : activeTask ? (
          /* 3. Task benchmark detail page */
          <TaskDetailView task={activeTask} linkProps={linkProps} navigate={navigate} />
        ) : route === '/compare/' ? (
          /* 4. Comparisons hub */
          <div className="space-y-8">
            <div>
              <a {...linkProps('/')} className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to workbench
              </a>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
                Head-to-head AI coding tool comparisons
              </h1>
              <p className="mt-2 max-w-3xl text-stone-600">
                Direct breakdowns of the most common evaluation matchups across multi-file features, refactoring, debugging, test generation, PR review, and inline autocomplete.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {COMPARISON_PAIRS.map((pair) => (
                <a
                  key={pair.slug}
                  {...linkProps(`/compare/${pair.slug}/`)}
                  className="group rounded-xl border border-stone-200 bg-white p-5 hover:border-teal-600 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold text-stone-900 group-hover:text-teal-800">
                      {pair.title}
                    </h2>
                    <ArrowRight className="h-4 w-4 shrink-0 text-stone-400 group-hover:text-teal-700" />
                  </div>
                  <p className="mt-2 text-sm text-stone-600">{pair.summary}</p>
                </a>
              ))}
            </div>
          </div>
        ) : route === '/stacks/' ? (
          /* 5. Stacks hub */
          <div className="space-y-8">
            <div>
              <a {...linkProps('/')} className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to workbench
              </a>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
                AI coding tool recommendations by team stack
              </h1>
              <p className="mt-2 max-w-3xl text-stone-600">
                Choose a stack profile to see matching IDEs, hosting models, rollout advice, and ranked tools.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {STACK_PROFILES.map((stack) => (
                <a
                  key={stack.slug}
                  {...linkProps(`/stacks/${stack.slug}/`)}
                  className="group rounded-xl border border-stone-200 bg-white p-5 hover:border-teal-600 transition"
                >
                  <h2 className="text-base font-semibold text-stone-900 group-hover:text-teal-800">
                    {stack.title}
                  </h2>
                  <p className="mt-2 text-sm text-stone-600">{stack.description}</p>
                  <p className="mt-3 font-mono text-xs text-teal-700">
                    Top picks: {stack.topRecommendations.map((id) => CODING_TOOLS.find((t) => t.id === id)?.name).filter(Boolean).join(', ')}
                  </p>
                </a>
              ))}
            </div>
          </div>
        ) : route === '/tasks/' ? (
          /* 6. Tasks hub */
          <div className="space-y-8">
            <div>
              <a {...linkProps('/')} className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to workbench
              </a>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
                Identical engineering task benchmarks
              </h1>
              <p className="mt-2 max-w-3xl text-stone-600">
                Six repeatable tasks used to compare all 16 AI coding tools under identical prompts and verification criteria.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {BENCHMARK_TASKS.map((task) => (
                <a
                  key={task.slug}
                  {...linkProps(`/tasks/${task.slug}/`)}
                  className="group rounded-xl border border-stone-200 bg-white p-5 hover:border-teal-600 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold text-stone-900 group-hover:text-teal-800">
                      {task.title}
                    </h2>
                    <ArrowRight className="h-4 w-4 shrink-0 text-stone-400 group-hover:text-teal-700" />
                  </div>
                  <p className="mt-2 text-sm text-stone-600">{task.summary}</p>
                  <p className="mt-3 font-mono text-xs text-stone-500">{task.filesTouched}</p>
                </a>
              ))}
            </div>
          </div>
        ) : route === '/tools/' ? (
          /* 7. Full tools directory */
          <div className="space-y-8">
            <div>
              <a {...linkProps('/')} className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to workbench
              </a>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
                All 16 AI coding tools compared
              </h1>
            </div>
            <ToolMatrixTable />
          </div>
        ) : (
          /* 8. Home Workbench */
          <div className="space-y-16">
            {/* Hero */}
            <section className="max-w-4xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 font-mono text-xs text-stone-600">
                <span>16 tools</span>
                <span>•</span>
                <span>6 identical tasks</span>
                <span>•</span>
                <span>6 team stacks</span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
                AI coding tools comparison and team stack selector
              </h1>
              <p className="text-base text-stone-600 sm:text-lg">
                Compare 16 AI coding assistants (Cursor, GitHub Copilot, Claude Code, Windsurf, OpenAI Codex CLI, Aider, Cline, Continue, TabbyML, and enterprise tools) on the exact same engineering tasks, then filter by your editor, privacy rules, and language stack to export a Markdown decision table.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href="#same-task-comparison"
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800"
                >
                  <GitCompare className="h-4 w-4" />
                  Compare on identical tasks
                </a>
                <a
                  href="#team-stack-selector"
                  className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-50"
                >
                  <Layers className="h-4 w-4" />
                  Open team stack selector
                </a>
              </div>
            </section>

            <TaskComparisonWorkbench onNavigate={navigate} />

            <TeamStackSelector onNavigate={navigate} />

            <ToolMatrixTable />

            {/* Internal linking hub for comparisons & stacks */}
            <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-stone-900">Head-to-head comparisons</h2>
                  <a {...linkProps('/compare/')} className="text-xs font-medium text-teal-700 hover:underline">
                    View all 8
                  </a>
                </div>
                <ul className="divide-y divide-stone-100 text-sm">
                  {COMPARISON_PAIRS.map((pair) => (
                    <li key={pair.slug} className="py-2.5">
                      <a
                        {...linkProps(`/compare/${pair.slug}/`)}
                        className="flex items-center justify-between gap-2 text-stone-800 hover:text-teal-700"
                      >
                        <span className="font-medium">{pair.title.split(':')[0]}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-stone-400" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-stone-900">Guides by team stack</h2>
                  <a {...linkProps('/stacks/')} className="text-xs font-medium text-teal-700 hover:underline">
                    View all 6
                  </a>
                </div>
                <ul className="divide-y divide-stone-100 text-sm">
                  {STACK_PROFILES.map((stack) => (
                    <li key={stack.slug} className="py-2.5">
                      <a
                        {...linkProps(`/stacks/${stack.slug}/`)}
                        className="flex items-center justify-between gap-2 text-stone-800 hover:text-teal-700"
                      >
                        <span className="font-medium">{stack.title}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-stone-400" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* FAQ section */}
            <section className="rounded-xl border border-stone-200 bg-white p-6 space-y-5">
              <h2 className="text-xl font-semibold text-stone-900">Frequently asked questions</h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-stone-900">
                    Which AI coding tool is best for multi-file features?
                  </h3>
                  <p className="text-sm text-stone-600">
                    Claude Code, Cursor, OpenAI Codex CLI, Cline, and Windsurf handle multi-file features best because they search the repo, edit coordinated files, and run tests in a loop.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-stone-900">
                    What is the best self-hosted alternative to GitHub Copilot?
                  </h3>
                  <p className="text-sm text-stone-600">
                    TabbyML provides a self-hosted Rust server for private inline autocomplete and codebase Q&amp;A. Continue connects VS Code and JetBrains to Ollama, vLLM, or private VPC models.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-stone-900">
                    How is this related to sourcegraph/awesome-code-ai?
                  </h3>
                  <p className="text-sm text-stone-600">
                    Sourcegraph archived awesome-code-ai after cataloging early AI coding links. This workbench turns the active tools from that ecosystem into a side-by-side task benchmark and stack selector.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            Maintained by{' '}
            <a href="https://github.com/developer-assistants" target="_blank" rel="noreferrer" className="underline hover:text-stone-800">
              developer-assistants
            </a>
            . Built as a practical successor to{' '}
            <a href={SOURCE_URL} target="_blank" rel="noreferrer" className="underline hover:text-stone-800">
              sourcegraph/awesome-code-ai
            </a>
            .
          </p>
          <div className="flex flex-wrap gap-4">
            <a {...linkProps('/compare/')} className="hover:text-stone-900">Comparisons</a>
            <a {...linkProps('/stacks/')} className="hover:text-stone-900">Team Stacks</a>
            <a {...linkProps('/tasks/')} className="hover:text-stone-900">Tasks</a>
            <a href={`${BASE_PATH}/llms.txt`} className="hover:text-stone-900">llms.txt</a>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="hover:text-stone-900">GitHub Repo</a>
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
  linkProps: (r: string) => { href: string; onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void };
  navigate: (r: string) => void;
}) {
  const toolA = CODING_TOOLS.find((t) => t.id === pair.toolAId)!;
  const toolB = CODING_TOOLS.find((t) => t.id === pair.toolBId)!;

  return (
    <div className="space-y-10">
      <div className="space-y-3 max-w-4xl">
        <a {...linkProps('/compare/')} className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> All comparisons
        </a>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">{pair.title}</h1>
        <p className="text-base text-stone-600">{pair.summary}</p>
      </div>

      {/* Head-to-head task matrix */}
      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-2xs">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 font-mono text-[11px] uppercase tracking-wider text-stone-500">
              <th className="px-4 py-3">Identical task</th>
              <th className="px-4 py-3">{toolA.name}</th>
              <th className="px-4 py-3">{toolB.name}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {BENCHMARK_TASKS.map((task) => {
              const a = toolA.tasks[task.id];
              const b = toolB.tasks[task.id];
              return (
                <tr key={task.id}>
                  <td className="px-4 py-3.5 font-medium text-stone-900 w-56">
                    <a {...linkProps(`/tasks/${task.slug}/`)} className="hover:text-teal-700 hover:underline">
                      {task.shortTitle}
                    </a>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-stone-700">
                    <span className="font-mono font-semibold text-stone-900">{a.fit} ({a.score}/100)</span>
                    <p className="mt-1">{a.strength}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-stone-700">
                    <span className="font-mono font-semibold text-stone-900">{b.fit} ({b.score}/100)</span>
                    <p className="mt-1">{b.strength}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-white p-5 space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">When to pick {toolA.name}</h2>
          <ul className="space-y-2 text-sm text-stone-700 list-disc pl-5">
            {pair.whenToPickA.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5 space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">When to pick {toolB.name}</h2>
          <ul className="space-y-2 text-sm text-stone-700 list-disc pl-5">
            {pair.whenToPickB.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-5">
        <h2 className="text-base font-semibold text-stone-900">Verdict</h2>
        <p className="mt-1 text-sm text-stone-700">{pair.verdict}</p>
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
  linkProps: (r: string) => { href: string; onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void };
  navigate: (r: string) => void;
}) {
  return (
    <div className="space-y-10">
      <div className="space-y-3 max-w-4xl">
        <a {...linkProps('/stacks/')} className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> All team stacks
        </a>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          Best AI coding tools for {stack.title.toLowerCase()}
        </h1>
        <p className="text-base text-stone-600">{stack.description}</p>
        <p className="font-mono text-xs text-stone-500">Typical environment: {stack.typicalRepo}</p>
      </div>

      <TeamStackSelector initialStack={stack.id} onNavigate={navigate} />

      <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold text-stone-900">Common pitfalls to avoid</h2>
        <ul className="space-y-2 text-sm text-stone-700 list-disc pl-5">
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
  linkProps: (r: string) => { href: string; onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void };
  navigate: (r: string) => void;
}) {
  const sortedTools = [...CODING_TOOLS].sort(
    (a, b) => b.tasks[task.id].score - a.tasks[task.id].score,
  );

  return (
    <div className="space-y-10">
      <div className="space-y-3 max-w-4xl">
        <a {...linkProps('/tasks/')} className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> All task benchmarks
        </a>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">{task.title}</h1>
        <p className="text-base text-stone-600">{task.scenario}</p>
      </div>

      <TaskComparisonWorkbench
        initialTaskId={task.id}
        initialToolIds={sortedTools.slice(0, 4).map((t) => t.id)}
        onNavigate={navigate}
      />

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-2xs">
        <table className="w-full min-w-[760px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 font-mono text-[11px] uppercase tracking-wider text-stone-500">
              <th className="px-4 py-3">Tool</th>
              <th className="px-4 py-3">Fit</th>
              <th className="px-4 py-3">Workflow mode</th>
              <th className="px-4 py-3">Strength</th>
              <th className="px-4 py-3">Tradeoff</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {sortedTools.map((tool) => {
              const ev = tool.tasks[task.id];
              return (
                <tr key={tool.id}>
                  <td className="px-4 py-3 font-semibold text-stone-900">{tool.name}</td>
                  <td className="px-4 py-3 font-mono font-semibold text-teal-800">
                    {ev.fit} ({ev.score})
                  </td>
                  <td className="px-4 py-3 text-stone-700">{ev.workflowMode}</td>
                  <td className="px-4 py-3 text-stone-700">{ev.strength}</td>
                  <td className="px-4 py-3 text-stone-500">{ev.tradeoff}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
