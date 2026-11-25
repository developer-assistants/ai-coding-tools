import { useMemo, useState } from 'react';
import { CODING_TOOLS } from '../data/tools';
import type { ToolCategory } from '../data/types';
import { countStrongTasks } from '../engine/selector';

const CATEGORY_LABELS: Record<ToolCategory | 'all', string> = {
  all: 'All 16 tools',
  'agentic-ide': 'Agentic IDEs',
  'ide-extension': 'IDE extensions',
  'terminal-agent': 'Terminal agents',
  'self-hosted': 'Self-hosted and private',
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
          <h2 className="text-2xl sm:text-3xl">All 16 AI coding tools</h2>
          <p className="mt-1.5 text-sm console-lede">
            Verified pricing, editor coverage, hosting models, and native capabilities.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <label htmlFor="tool-search" className="sr-only">
            Filter tools
          </label>
          <input
            id="tool-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by tool, editor, or feature"
            className="console-input"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(CATEGORY_LABELS) as Array<ToolCategory | 'all'>).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
            className={category === cat ? 'chip chip--cool' : 'chip'}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="console-panel overflow-x-auto">
        <table className="console-table min-w-[900px]">
          <thead>
            <tr>
              <th>Tool</th>
              <th>Editors</th>
              <th>Multi-file agent</th>
              <th>Inline Tab</th>
              <th>Hosting and BYOK</th>
              <th>MCP</th>
              <th>Strong tasks</th>
              <th>Pricing (2026)</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tool) => (
              <tr key={tool.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noreferrer"
                      className="console-link font-medium"
                    >
                      {tool.name}
                    </a>
                    {tool.openSource && (
                      <span className="measured text-xs" style={{ color: 'var(--color-cool)' }}>
                        OSS
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs console-muted max-w-xs">{tool.tagline}</p>
                </td>
                <td className="measured text-xs console-lede">{tool.editors.join(', ')}</td>
                <td className="measured text-xs">{tool.multiFileAgent ? 'Yes' : 'No'}</td>
                <td className="measured text-xs">{tool.inlineAutocomplete ? 'Yes' : 'No'}</td>
                <td className="measured text-xs console-lede">
                  {tool.hosting.includes('self-hosted') ? 'Self-hosted' : 'Cloud / ZDR'}
                  {tool.byokSupported ? ', BYOK' : ''}
                </td>
                <td className="measured text-xs">{tool.mcpSupported ? 'Yes' : 'No'}</td>
                <td className="measured text-xs" style={{ color: 'var(--color-cool)' }}>
                  {countStrongTasks(tool)}/6
                </td>
                <td className="measured text-xs console-lede max-w-[200px]">
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
