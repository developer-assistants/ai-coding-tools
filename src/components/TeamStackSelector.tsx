import { useMemo, useState } from 'react';
import { Check, Copy, Download, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
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
        totalScore: r.totalScore,
        taskScore: r.taskScore,
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-teal-700">
            02 / Team stack decision table
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
            Pick the right AI coding stack for your engineering team
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-800 hover:bg-stone-50"
          >
            {copiedMd ? <Check className="h-3.5 w-3.5 text-teal-700" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedMd ? 'Copied Markdown table' : 'Copy Markdown RFC table'}
          </button>
          <button
            type="button"
            onClick={handleDownloadJson}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-800 hover:bg-stone-50"
          >
            <Download className="h-3.5 w-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Stack presets */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-2xs space-y-5">
        <div>
          <p className="text-xs font-medium text-stone-600">Quick stack presets:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {STACK_PROFILES.map((preset) => {
              const active = criteria.stack === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyStackPreset(preset.id)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? 'border-teal-700 bg-teal-50 text-teal-900'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {preset.shortTitle}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fine-grained controls */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block space-y-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-stone-500">
              Primary editor
            </span>
            <select
              value={criteria.editor}
              onChange={(e) =>
                setCriteria((prev) => ({
                  ...prev,
                  editor: e.target.value as EditorTarget | 'any',
                }))
              }
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900"
            >
              <option value="vscode">VS Code / VS Code fork</option>
              <option value="jetbrains">JetBrains (IntelliJ / PyCharm / Rider)</option>
              <option value="terminal">Terminal / CLI first</option>
              <option value="neovim">Neovim / Vim</option>
              <option value="any">Mixed IDEs (any)</option>
            </select>
          </label>

          <label className="block space-y-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-stone-500">
              Privacy &amp; hosting
            </span>
            <select
              value={criteria.hosting}
              onChange={(e) =>
                setCriteria((prev) => ({
                  ...prev,
                  hosting: e.target.value as HostingModel,
                }))
              }
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900"
            >
              <option value="cloud-saas">Cloud SaaS allowed</option>
              <option value="enterprise-zdr">Enterprise Zero-Data-Retention (ZDR)</option>
              <option value="self-hosted">Self-hosted / VPC / Air-gapped only</option>
            </select>
          </label>

          <label className="block space-y-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-stone-500">
              Team budget tier
            </span>
            <select
              value={criteria.budget}
              onChange={(e) =>
                setCriteria((prev) => ({
                  ...prev,
                  budget: e.target.value as BudgetTier,
                }))
              }
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900"
            >
              <option value="free-oss">Free / Open Source / BYOK</option>
              <option value="startup">Startup ($10-$20/seat)</option>
              <option value="mid-market">Mid-Market ($20-$40/seat)</option>
              <option value="enterprise">Enterprise governance</option>
            </select>
          </label>

          <label className="block space-y-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-stone-500">
              Highest-priority task
            </span>
            <select
              value={criteria.priorityTask}
              onChange={(e) =>
                setCriteria((prev) => ({
                  ...prev,
                  priorityTask: e.target.value as TaskId,
                }))
              }
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900"
            >
              {BENCHMARK_TASKS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.shortTitle}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Hard boolean filters */}
        <div className="flex flex-wrap items-center gap-5 border-t border-stone-200 pt-4 text-xs text-stone-700">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(criteria.requireOpenSource)}
              onChange={(e) =>
                setCriteria((prev) => ({ ...prev, requireOpenSource: e.target.checked }))
              }
              className="h-4 w-4 rounded border-stone-300 accent-teal-700"
            />
            Open source only
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(criteria.requireMcp)}
              onChange={(e) =>
                setCriteria((prev) => ({ ...prev, requireMcp: e.target.checked }))
              }
              className="h-4 w-4 rounded border-stone-300 accent-teal-700"
            />
            Requires MCP support
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(criteria.requireInlineAutocomplete)}
              onChange={(e) =>
                setCriteria((prev) => ({
                  ...prev,
                  requireInlineAutocomplete: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-stone-300 accent-teal-700"
            />
            Requires built-in Tab autocomplete
          </label>
          {onNavigate && (
            <a
              href={`/ai-coding-tools/stacks/${activeProfile.slug}/`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/stacks/${activeProfile.slug}/`);
              }}
              className="ml-auto font-medium text-teal-700 hover:underline"
            >
              Read full {activeProfile.shortTitle} guide
            </a>
          )}
        </div>
      </div>

      {/* Stack rollout note */}
      <div className="rounded-xl border border-teal-200/80 bg-teal-50/50 p-4 text-sm text-stone-800 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 shrink-0 text-teal-700 mt-0.5" />
        <div>
          <span className="font-semibold text-stone-900">Practical rollout pattern: </span>
          {activeProfile.rolloutNotes}
        </div>
      </div>

      {/* Ranked recommendation table */}
      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-2xs">
        <table className="w-full min-w-[780px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 font-mono text-[11px] uppercase tracking-wider text-stone-500">
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Tool</th>
              <th className="px-4 py-3">Stack score</th>
              <th className="px-4 py-3">Priority task</th>
              <th className="px-4 py-3">Pricing</th>
              <th className="px-4 py-3">Why it fits / watch out</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {eligibleResults.map((row, index) => (
              <tr key={row.tool.id} className="hover:bg-stone-50/70">
                <td className="px-4 py-3.5 font-mono text-xs font-semibold text-stone-500">
                  #{index + 1}
                </td>
                <td className="px-4 py-3.5">
                  <a
                    href={row.tool.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-stone-900 hover:text-teal-700 hover:underline"
                  >
                    {row.tool.name}
                  </a>
                  <div className="mt-0.5 flex flex-wrap gap-1.5 font-mono text-[11px] text-stone-500">
                    <span>{row.tool.openSource ? 'OSS' : 'Commercial'}</span>
                    <span>•</span>
                    <span>{row.tool.editors.join(', ')}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 w-36">
                  <div className="flex items-center justify-between font-mono text-xs font-semibold text-stone-900">
                    <span>{row.totalScore}/100</span>
                  </div>
                  <div className="score-bar-track mt-1">
                    <div className="score-bar-fill" style={{ width: `${row.totalScore}%` }} />
                  </div>
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-stone-800">
                  {row.tool.tasks[criteria.priorityTask].fit} ({row.taskScore})
                </td>
                <td className="px-4 py-3.5 text-xs text-stone-700 max-w-[200px]">
                  {row.tool.pricingSummary}
                </td>
                <td className="px-4 py-3.5 text-xs text-stone-700 space-y-1 max-w-sm">
                  {row.reasons[0] && (
                    <p className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal-700 mt-0.5" />
                      <span>{row.reasons[0]}</span>
                    </p>
                  )}
                  <p className="text-stone-500">{row.caveats[0] ?? row.tool.watchOut}</p>
                </td>
              </tr>
            ))}

            {eligibleResults.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-stone-500">
                  No tool satisfies every active hard filter at once. Uncheck one constraint above to see close matches.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredOut.length > 0 && (
        <p className="flex items-center gap-1.5 text-xs text-stone-500">
          <XCircle className="h-3.5 w-3.5 text-stone-400" />
          Excluded {filteredOut.length} tools that did not satisfy your hard hosting, open-source, MCP, or autocomplete constraints:{' '}
          {filteredOut.map((f) => f.tool.name).join(', ')}.
        </p>
      )}
    </section>
  );
}
