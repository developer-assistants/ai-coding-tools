import { useState } from 'react';
import { Check, Copy, Terminal, Layers, AlertCircle } from 'lucide-react';
import { BENCHMARK_TASKS } from '../data/tasks';
import { CODING_TOOLS } from '../data/tools';
import type { TaskFitRating, TaskId } from '../data/types';

interface Props {
  initialTaskId?: TaskId;
  initialToolIds?: string[];
  onNavigate?: (path: string) => void;
}

function fitBadgeClass(fit: TaskFitRating): string {
  switch (fit) {
    case 'Strong':
      return 'bg-teal-50 text-teal-800 border-teal-200';
    case 'Good':
      return 'bg-sky-50 text-sky-800 border-sky-200';
    case 'Partial':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'Limited':
      return 'bg-stone-100 text-stone-600 border-stone-200';
  }
}

export function TaskComparisonWorkbench({
  initialTaskId = 'multi-file-feature',
  initialToolIds = ['cursor', 'claude-code', 'github-copilot', 'windsurf'],
  onNavigate,
}: Props) {
  const [selectedTaskId, setSelectedTaskId] = useState<TaskId>(initialTaskId);
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>(initialToolIds);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const activeTask =
    BENCHMARK_TASKS.find((t) => t.id === selectedTaskId) ?? BENCHMARK_TASKS[0];

  const selectedTools = selectedToolIds
    .map((id) => CODING_TOOLS.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  function toggleTool(id: string) {
    setSelectedToolIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 2) return prev;
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(activeTask.promptBlueprint);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 1800);
    } catch {
      // Clipboard may be unavailable in restricted contexts
    }
  }

  return (
    <section id="same-task-comparison" className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-teal-700">
            01 / Identical task comparison
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
            Compare AI coding tools on the exact same engineering task
          </h2>
        </div>
        {onNavigate && (
          <a
            href={`/ai-coding-tools/tasks/${activeTask.slug}/`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/tasks/${activeTask.slug}/`);
            }}
            className="text-sm font-medium text-teal-700 hover:text-teal-900 underline underline-offset-4"
          >
            Open full {activeTask.shortTitle.toLowerCase()} breakdown
          </a>
        )}
      </div>

      {/* Task selector tabs */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {BENCHMARK_TASKS.map((task) => {
          const active = task.id === selectedTaskId;
          return (
            <button
              key={task.id}
              type="button"
              onClick={() => setSelectedTaskId(task.id)}
              className={`rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition ${
                active
                  ? 'border-teal-700 bg-teal-700 text-white shadow-xs'
                  : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
              }`}
            >
              {task.shortTitle}
            </button>
          );
        })}
      </div>

      {/* Active task specification card */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-stone-900">{activeTask.title}</h3>
              <span className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 font-mono text-xs text-stone-600">
                <Layers className="h-3.5 w-3.5" />
                {activeTask.filesTouched}
              </span>
            </div>
            <p className="text-sm text-stone-600">{activeTask.scenario}</p>
            <ul className="mt-2 space-y-1 text-xs text-stone-600">
              {activeTask.evaluationCriteria.map((criterion) => (
                <li key={criterion} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                  <span>{criterion}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full lg:w-96 shrink-0 rounded-lg border border-stone-200 bg-stone-50 p-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-stone-500">
                <Terminal className="h-3.5 w-3.5" />
                Shared prompt blueprint
              </span>
              <button
                type="button"
                onClick={copyPrompt}
                className="inline-flex items-center gap-1 rounded border border-stone-300 bg-white px-2 py-1 text-xs font-medium text-stone-700 hover:bg-stone-100"
              >
                {copiedPrompt ? <Check className="h-3.5 w-3.5 text-teal-700" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedPrompt ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="mt-2 font-mono text-xs leading-relaxed text-stone-800">
              {activeTask.promptBlueprint}
            </p>
          </div>
        </div>

        {/* Tool picker chips */}
        <div className="mt-5 border-t border-stone-200 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-medium text-stone-600">
              Pick 2 to 4 tools to compare side by side ({selectedTools.length}/4 selected):
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedToolIds(['cursor', 'claude-code', 'github-copilot', 'windsurf'])}
                className="text-teal-700 hover:underline"
              >
                Frontier top 4
              </button>
              <span className="text-stone-300">|</span>
              <button
                type="button"
                onClick={() => setSelectedToolIds(['claude-code', 'openai-codex-cli', 'aider', 'cline'])}
                className="text-teal-700 hover:underline"
              >
                CLI &amp; open agents
              </button>
              <span className="text-stone-300">|</span>
              <button
                type="button"
                onClick={() => setSelectedToolIds(['tabby-ml', 'continue', 'tabnine', 'sourcegraph-cody'])}
                className="text-teal-700 hover:underline"
              >
                Self-hosted &amp; VPC
              </button>
            </div>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {CODING_TOOLS.map((tool) => {
              const selected = selectedToolIds.includes(tool.id);
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => toggleTool(tool.id)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                    selected
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {tool.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Side-by-side comparison cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {selectedTools.map((tool) => {
          const ev = tool.tasks[selectedTaskId];
          return (
            <article
              key={tool.id}
              className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-4 shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-base font-semibold text-stone-900">{tool.name}</h4>
                    <p className="font-mono text-[11px] text-stone-500">{tool.license}</p>
                  </div>
                  <span
                    className={`rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${fitBadgeClass(ev.fit)}`}
                  >
                    {ev.fit} ({ev.score})
                  </span>
                </div>

                <div className="score-bar-track">
                  <div className="score-bar-fill" style={{ width: `${ev.score}%` }} />
                </div>

                <dl className="space-y-2.5 text-xs">
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-stone-500">
                      Workflow mode
                    </dt>
                    <dd className="mt-0.5 text-stone-800">{ev.workflowMode}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-stone-500">
                      Context scope
                    </dt>
                    <dd className="mt-0.5 text-stone-800">{ev.contextScope}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-teal-700">
                      What works well
                    </dt>
                    <dd className="mt-0.5 text-stone-700">{ev.strength}</dd>
                  </div>
                  <div className="rounded-lg border border-amber-200/70 bg-amber-50/60 p-2.5">
                    <dt className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-amber-800">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Main tradeoff
                    </dt>
                    <dd className="mt-0.5 text-stone-700">{ev.tradeoff}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-4 border-t border-stone-100 pt-3">
                <p className="font-mono text-[11px] uppercase tracking-wider text-stone-500">
                  How teams run this task
                </p>
                <p className="mt-1 font-mono text-[11px] leading-relaxed text-stone-700">
                  {ev.sampleWorkflow}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
