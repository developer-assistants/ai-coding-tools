import { useMemo, useState } from 'react';
import { CODING_TOOLS } from '../data/tools';
import { BENCHMARK_TASKS } from '../data/tasks';
import { STACK_PROFILES } from '../data/stacks';
import type {
  BudgetTier,
  EditorTarget,
  HostingModel,
  StackId,
  TaskId,
} from '../data/types';
import {
  exportDecisionMatrixMarkdown,
  scoreToolsForTeam,
  type TeamSelectorCriteria,
} from '../engine/selector';
import { fitBadgeClass } from './TaskComparisonWorkbench';

interface Props {
  initialStack?: StackId;
  onNavigate?: (path: string) => void;
}

export function TeamStackSelector({ initialStack = 'typescript-react', onNavigate }: Props) {
  const defaultProfile =
    STACK_PROFILES.find((s) => s.id === initialStack) ?? STACK_PROFILES[0];

  const [criteria, setCriteria] = useState<TeamSelectorCriteria>({
    stack: defaultProfile.id,
    editor: defaultProfile.defaultEditor,
    hosting: defaultProfile.defaultHosting,
    budget: defaultProfile.defaultBudget,
    priorityTask: defaultProfile.priorityTask,
    requireOpenSource: false,
    requireMcp: false,
    requireInlineAutocomplete: false,
  });

  const [copiedMd, setCopiedMd] = useState(false);

  const ranked = useMemo(
    () => scoreToolsForTeam(CODING_TOOLS, criteria),
    [criteria],
  );

  const activeProfile =
    STACK_PROFILES.find((s) => s.id === criteria.stack) ?? STACK_PROFILES[0];

  const eligibleResults = ranked.filter((r) => r.eligible);
  const filteredOut = ranked.filter((r) => !r.eligible);

  function applyStackPreset(stackId: StackId) {
    const profile = STACK_PROFILES.find((s) => s.id === stackId);
    if (!profile) return;
    setCriteria((prev) => ({
      ...prev,
      stack: profile.id,
      editor: profile.defaultEditor,
      hosting: profile.defaultHosting,
      budget: profile.defaultBudget,
      priorityTask: profile.priorityTask,
    }));
  }

  async function handleCopyMarkdown() {
    const md = exportDecisionMatrixMarkdown(ranked, criteria, 6);
    try {
      await navigator.clipboard.writeText(md);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 1800);
    } catch {
      // Ignore clipboard failures
    }
  }

  function handleDownloadJson() {
    const payload = {
      generatedAt: new Date().toISOString(),
      criteria,
      recommendations: eligibleResults.slice(0, 8).map((r, index) => ({
        rank: index + 1,
        id: r.tool.id,
        name: r.tool.name,
        criteriaMatched: `${r.matchedChecks}/${r.totalChecks}`,
        taskFit: r.taskFit,
        pricing: r.tool.pricingSummary,
        openSource: r.tool.openSource,
        hosting: r.tool.hosting,
        reasons: r.reasons,
        caveats: r.caveats,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-coding-tools-${criteria.stack}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section id="team-stack-selector" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl">Team stack decision table</h2>
          <p className="mt-1.5 text-sm console-lede">
            Filter by editor, privacy model, budget, and priority task, then export for your RFC.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleCopyMarkdown} className="btn btn--primary">
            {copiedMd ? 'Copied Markdown table' : 'Copy Markdown table'}
          </button>
          <button type="button" onClick={handleDownloadJson} className="btn">
            Export JSON
          </button>
        </div>
      </div>

      {/* Controls panel */}
      <div className="console-panel">
        <div className="p-5 space-y-5">
          <div className="space-y-2">
            <span className="console-label">Stack preset</span>
            <div className="flex flex-wrap gap-2">
              {STACK_PROFILES.map((preset) => {
                const active = criteria.stack === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyStackPreset(preset.id)}
                    aria-pressed={active}
                    className={active ? 'chip chip--accent' : 'chip'}
                  >
                    {preset.shortTitle}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block space-y-1.5">
              <span className="console-label">Primary editor</span>
              <select
                value={criteria.editor}
                onChange={(e) =>
                  setCriteria((prev) => ({
                    ...prev,
                    editor: e.target.value as EditorTarget | 'any',
                  }))
                }
                className="console-input"
              >
                <option value="vscode">VS Code or fork</option>
                <option value="jetbrains">JetBrains (IntelliJ, PyCharm, Rider)</option>
                <option value="terminal">Terminal first</option>
                <option value="neovim">Neovim or Vim</option>
                <option value="any">Mixed editors</option>
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="console-label">Privacy and hosting</span>
              <select
                value={criteria.hosting}
                onChange={(e) =>
                  setCriteria((prev) => ({
                    ...prev,
                    hosting: e.target.value as HostingModel,
                  }))
                }
                className="console-input"
              >
                <option value="cloud-saas">Cloud SaaS allowed</option>
                <option value="enterprise-zdr">Enterprise zero-data-retention</option>
                <option value="self-hosted">Self-hosted or air-gapped only</option>
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="console-label">Budget tier</span>
              <select
                value={criteria.budget}
                onChange={(e) =>
                  setCriteria((prev) => ({
                    ...prev,
                    budget: e.target.value as BudgetTier,
                  }))
                }
                className="console-input"
              >
                <option value="free-oss">Free, open source, or BYOK</option>
                <option value="startup">Startup ($8 to $25 per seat)</option>
                <option value="mid-market">Mid-market ($20 to $50 per seat)</option>
                <option value="enterprise">Enterprise governance</option>
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="console-label">Priority task</span>
              <select
                value={criteria.priorityTask}
                onChange={(e) =>
                  setCriteria((prev) => ({
                    ...prev,
                    priorityTask: e.target.value as TaskId,
                  }))
                }
                className="console-input"
              >
                {BENCHMARK_TASKS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.shortTitle}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div
            className="flex flex-wrap items-center gap-6 pt-4 text-sm"
            style={{ borderTop: 'var(--rule-hair) solid var(--color-rule)' }}
          >
            <label className="inline-flex items-center gap-2 cursor-pointer console-lede">
              <input
                type="checkbox"
                checked={Boolean(criteria.requireOpenSource)}
                onChange={(e) =>
                  setCriteria((prev) => ({ ...prev, requireOpenSource: e.target.checked }))
                }
                style={{ accentColor: 'var(--color-accent)' }}
              />
              Open source only
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer console-lede">
              <input
                type="checkbox"
                checked={Boolean(criteria.requireMcp)}
                onChange={(e) =>
                  setCriteria((prev) => ({ ...prev, requireMcp: e.target.checked }))
                }
                style={{ accentColor: 'var(--color-accent)' }}
              />
              Requires MCP support
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer console-lede">
              <input
                type="checkbox"
                checked={Boolean(criteria.requireInlineAutocomplete)}
                onChange={(e) =>
                  setCriteria((prev) => ({
                    ...prev,
                    requireInlineAutocomplete: e.target.checked,
                  }))
                }
                style={{ accentColor: 'var(--color-accent)' }}
              />
              Requires inline Tab autocomplete
            </label>
            {onNavigate && (
              <a
                href={`/ai-coding-tools/stacks/${activeProfile.slug}/`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/stacks/${activeProfile.slug}/`);
                }}
                className="ml-auto text-sm console-link"
              >
                Read {activeProfile.shortTitle} guide
              </a>
            )}
          </div>
        </div>

        <div className="console-well px-5 py-3.5 text-sm">
          <span style={{ color: 'var(--color-accent)' }} className="font-medium">
            Rollout note:{' '}
          </span>
          <span className="console-lede">{activeProfile.rolloutNotes}</span>
        </div>
      </div>

      {/* Ranked table */}
      <div className="console-panel overflow-x-auto">
        <table className="console-table min-w-[780px]">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Tool</th>
              <th>Criteria matched</th>
              <th>Task fit</th>
              <th>Pricing (2026)</th>
              <th>Fit and main tradeoff</th>
            </tr>
          </thead>
          <tbody>
            {eligibleResults.map((row, index) => (
              <tr key={row.tool.id}>
                <td className="measured console-muted">#{index + 1}</td>
                <td>
                  <a
                    href={row.tool.website}
                    target="_blank"
                    rel="noreferrer"
                    className="console-link font-medium"
                  >
                    {row.tool.name}
                  </a>
                  <p className="mt-1 text-xs console-muted">
                    {row.tool.openSource ? 'Open source' : 'Proprietary'},{' '}
                    {row.tool.editors.join(', ')}
                  </p>
                </td>
                <td className="measured" style={{ color: 'var(--color-cool)' }}>
                  {row.matchedChecks}/{row.totalChecks}
                </td>
                <td>
                  <span className={fitBadgeClass(row.taskFit)}>{row.taskFit}</span>
                </td>
                <td className="measured text-xs console-lede max-w-[210px]">
                  {row.tool.pricingSummary}
                </td>
                <td className="text-xs space-y-1 max-w-sm">
                  {row.reasons[0] && (
                    <p style={{ color: 'var(--color-ink)' }}>{row.reasons[0]}</p>
                  )}
                  <p className="console-muted">{row.caveats[0] ?? row.tool.watchOut}</p>
                </td>
              </tr>
            ))}

            {eligibleResults.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 console-muted">
                  No tool satisfies every active hard filter. Relax one constraint above to see close matches.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredOut.length > 0 && (
        <p className="text-xs console-muted">
          Excluded {filteredOut.length} tools by hard hosting, license, MCP, or autocomplete filters:{' '}
          {filteredOut.map((f) => f.tool.name).join(', ')}.
        </p>
      )}
    </section>
  );
}
