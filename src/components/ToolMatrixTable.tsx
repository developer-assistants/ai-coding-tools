import { useMemo, useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { CODING_TOOLS } from '../data/tools';
import type { ToolCategory } from '../data/types';
import { getAverageTaskScore } from '../engine/selector';

const CATEGORY_LABELS: Record<ToolCategory | 'all', string> = {
  all: 'All 16 tools',
  'agentic-ide': 'Agentic IDEs',
  'ide-extension': 'IDE Extensions',
  'terminal-agent': 'Terminal Agents',
  'self-hosted': 'Self-Hosted / Private',
};

export function ToolMatrixTable() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ToolCategory | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CODING_TOOLS.filter((tool) => {
      if (category !== 'all' && tool.category !== category) return false;
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.tagline.toLowerCase().includes(q) ||
        tool.bestFor.toLowerCase().includes(q) ||
        tool.editors.some((e) => e.includes(q))
      );
    });
  }, [query, category]);

  return (
    <section id="full-matrix" className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-teal-700">
            03 / Complete directory
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
            Full 16-tool feature and capability matrix
          </h2>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by tool, IDE, or feature..."
            className="w-full rounded-lg border border-stone-300 bg-white py-2 pl-9 pr-3 text-sm text-stone-900 placeholder:text-stone-400"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(CATEGORY_LABELS) as Array<ToolCategory | 'all'>).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              category === cat
                ? 'border-stone-900 bg-stone-900 text-white'
                : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-2xs">
        <table className="w-full min-w-[900px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 font-mono text-[11px] uppercase tracking-wider text-stone-500">
              <th className="px-4 py-3">Tool</th>
              <th className="px-4 py-3">Editors</th>
              <th className="px-4 py-3">Multi-file agent</th>
              <th className="px-4 py-3">Tab autocomplete</th>
              <th className="px-4 py-3">Self-hosted / BYOK</th>
              <th className="px-4 py-3">MCP</th>
              <th className="px-4 py-3">Avg task score</th>
              <th className="px-4 py-3">Pricing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((tool) => (
              <tr key={tool.id} className="hover:bg-stone-50/70">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-stone-900 hover:text-teal-700 hover:underline inline-flex items-center gap-1"
                    >
                      {tool.name}
                      <ExternalLink className="h-3 w-3 text-stone-400" />
                    </a>
                    {tool.openSource && (
                      <span className="rounded bg-teal-50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-teal-800">
                        OSS
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-stone-500 max-w-xs">{tool.tagline}</p>
                </td>
                <td className="px-4 py-3 font-mono text-stone-700">
                  {tool.editors.join(', ')}
                </td>
                <td className="px-4 py-3 font-mono">
                  {tool.multiFileAgent ? 'Yes' : 'No'}
                </td>
                <td className="px-4 py-3 font-mono">
                  {tool.inlineAutocomplete ? 'Yes' : 'No'}
                </td>
                <td className="px-4 py-3 font-mono text-stone-700">
                  {tool.hosting.includes('self-hosted') ? 'Self-hosted' : 'Cloud / ZDR'}
                  {tool.byokSupported ? ' + BYOK' : ''}
                </td>
                <td className="px-4 py-3 font-mono">
                  {tool.mcpSupported ? 'Yes' : 'No'}
                </td>
                <td className="px-4 py-3 font-mono font-semibold text-stone-900">
                  {getAverageTaskScore(tool)}/100
                </td>
                <td className="px-4 py-3 text-stone-700 max-w-[190px]">
                  {tool.pricingSummary}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
