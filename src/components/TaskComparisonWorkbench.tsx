import { useState } from 'react';
import { BENCHMARK_TASKS } from '../data/tasks';
import { CODING_TOOLS } from '../data/tools';
import type { TaskFitRating, TaskId } from '../data/types';

interface Props {
  initialTaskId?: TaskId;
  initialToolIds?: string[];
  onNavigate?: (path: string) => void;
}

export function fitBadgeClass(fit: TaskFitRating): string {
  switch (fit) {
    case 'Strong':
      return 'fit-badge fit-strong';
    case 'Good':
      return 'fit-badge fit-good';
    case 'Partial':
      return 'fit-badge fit-partial';
    case 'Limited':
      return 'fit-badge fit-limited';
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
          <h2 className="text-2xl sm:text-3xl">Same-task comparison</h2>
          <p className="mt-1.5 text-sm console-lede">
            Run up to four tools against the same prompt and verification checklist.
          </p>
        </div>
        {onNavigate && (
          <a
            href={`/ai-coding-tools/tasks/${activeTask.slug}/`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/tasks/${activeTask.slug}/`);
            }}
            className="text-sm console-link"
          >
            Full {activeTask.shortTitle.toLowerCase()} breakdown
          </a>
        )}
      </div>

      {/* Unified hairline panel: task picker + prompt blueprint + tool picker */}
      <div className="console-panel">
        <div
          className="flex overflow-x-auto"
          style={{
            gap: 'var(--rule-hair)',
            backgroundColor: 'var(--color-rule)',
            borderBottom: 'var(--rule-hair) solid var(--color-rule)',
          }}
        >
          {BENCHMARK_TASKS.map((task) => {
            const active = task.id === selectedTaskId;
            return (
              <button
                key={task.id}
                type="button"
                onClick={() => setSelectedTaskId(task.id)}
                aria-pressed={active}
                className="console-tab flex-1 text-left"
                style={{
                  backgroundColor: active ? 'var(--color-cool-soft)' : 'var(--color-paper-2)',
                  color: active ? 'var(--color-ink)' : 'var(--color-muted)',
                  borderBottom: active ? '2px solid var(--color-cool)' : '2px solid transparent',
                }}
              >
                {task.shortTitle}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="p-5 lg:col-span-7 space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg">{activeTask.title}</h3>
              <span className="measured" style={{ color: 'var(--color-cool)' }}>
                {activeTask.filesTouched}
              </span>
            </div>
            <p className="text-sm console-lede">{activeTask.scenario}</p>
            <ul className="space-y-1.5 text-sm console-muted list-disc pl-5">
              {activeTask.evaluationCriteria.map((criterion) => (
                <li key={criterion}>{criterion}</li>
              ))}
            </ul>
          </div>

          <div
            className="p-5 lg:col-span-5 flex flex-col justify-between gap-3"
            style={{
              backgroundColor: 'var(--color-paper-3)',
              borderLeft: 'var(--rule-hair) solid var(--color-rule)',
            }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="console-label">Shared prompt</span>
                <button type="button" onClick={copyPrompt} className="btn">
                  {copiedPrompt ? 'Copied' : 'Copy prompt'}
                </button>
              </div>
              <p className="measured leading-relaxed" style={{ color: 'var(--color-ink-2)' }}>
                {activeTask.promptBlueprint}
              </p>
            </div>
            <p className="text-xs console-muted">
              Qualitative fit ratings reflect native workflow support, not a synthetic benchmark score.
            </p>
          </div>
        </div>

        {/* Tool selector strip */}
        <div
          className="p-4 sm:px-5 space-y-3"
          style={{ borderTop: 'var(--rule-hair) solid var(--color-rule)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="console-label">
              Tools in view ({selectedTools.length} of 4)
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setSelectedToolIds(['cursor', 'claude-code', 'github-copilot', 'windsurf'])
                }
                className="chip"
              >
                Frontier set
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedToolIds(['claude-code', 'openai-codex-cli', 'aider', 'cline'])
                }
                className="chip"
              >
                CLI and open agents
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedToolIds(['tabby-ml', 'continue', 'tabnine', 'sourcegraph-cody'])
                }
                className="chip"
              >
                Self-hosted and VPC
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {CODING_TOOLS.map((tool) => {
              const selected = selectedToolIds.includes(tool.id);
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => toggleTool(tool.id)}
                  aria-pressed={selected}
                  className={selected ? 'chip chip--cool' : 'chip'}
                >
                  {tool.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Side-by-side comparison grid cut from one surface */}
      <div className="console-grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {selectedTools.map((tool) => {
          const ev = tool.tasks[selectedTaskId];
          return (
            <article key={tool.id} className="p-5 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base">{tool.name}</h4>
                    <p className="text-xs console-muted mt-0.5">{tool.license}</p>
                  </div>
                  <span className={fitBadgeClass(ev.fit)}>{ev.fit}</span>
                </div>

                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="console-label">Workflow</dt>
                    <dd className="mt-0.5 console-lede">{ev.workflowMode}</dd>
                  </div>
                  <div>
                    <dt className="console-label">Context scope</dt>
                    <dd className="mt-0.5 console-lede">{ev.contextScope}</dd>
                  </div>
                  <div>
                    <dt className="console-label" style={{ color: 'var(--color-ok)' }}>
                      Works well
                    </dt>
                    <dd className="mt-0.5 console-lede">{ev.strength}</dd>
                  </div>
                  <div>
                    <dt className="console-label" style={{ color: 'var(--color-accent)' }}>
                      Tradeoff
                    </dt>
                    <dd className="mt-0.5 console-muted">{ev.tradeoff}</dd>
                  </div>
                </dl>
              </div>

              <div
                className="pt-3"
                style={{ borderTop: 'var(--rule-hair) solid var(--color-rule)' }}
              >
                <p className="console-label">Typical run</p>
                <p className="mt-1 measured text-xs leading-relaxed console-muted">
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
