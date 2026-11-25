import { describe, expect, it } from 'vitest';
import { CODING_TOOLS } from '../src/data/tools';
import { BENCHMARK_TASKS } from '../src/data/tasks';
import { STACK_PROFILES } from '../src/data/stacks';
import { COMPARISON_PAIRS } from '../src/data/comparisons';
import {
  countStrongTasks,
  exportDecisionMatrixMarkdown,
  scoreToolsForTeam,
} from '../src/engine/selector';

describe('AI Coding Tools dataset integrity', () => {
  it('contains 16 tools with complete qualitative evaluations for all 6 benchmark tasks', () => {
    expect(CODING_TOOLS).toHaveLength(16);
    const taskIds = BENCHMARK_TASKS.map((t) => t.id);
    const validFits = new Set(['Strong', 'Good', 'Partial', 'Limited']);
    for (const tool of CODING_TOOLS) {
      for (const taskId of taskIds) {
        const evalData = tool.tasks[taskId];
        expect(evalData).toBeDefined();
        expect(validFits.has(evalData.fit)).toBe(true);
        expect(evalData.strength.length).toBeGreaterThan(10);
      }
      expect(countStrongTasks(tool)).toBeGreaterThanOrEqual(1);
    }
  });

  it('references valid tool ids across all stack profiles and comparison pairs', () => {
    const ids = new Set(CODING_TOOLS.map((t) => t.id));
    for (const stack of STACK_PROFILES) {
      for (const rec of stack.topRecommendations) {
        expect(ids.has(rec)).toBe(true);
      }
    }
    for (const pair of COMPARISON_PAIRS) {
      expect(ids.has(pair.toolAId)).toBe(true);
      expect(ids.has(pair.toolBId)).toBe(true);
    }
  });
});

describe('Team stack selector engine', () => {
  it('enforces self-hosted hosting constraint as hard eligibility filter', () => {
    const ranked = scoreToolsForTeam(CODING_TOOLS, {
      stack: 'self-hosted-airgapped',
      editor: 'vscode',
      hosting: 'self-hosted',
      budget: 'enterprise',
      priorityTask: 'inline-autocomplete',
    });

    const eligible = ranked.filter((r) => r.eligible);
    expect(eligible.length).toBeGreaterThanOrEqual(4);
    for (const item of eligible) {
      expect(item.tool.hosting).toContain('self-hosted');
    }
    const topIds = eligible.slice(0, 3).map((r) => r.tool.id);
    expect(topIds).toContain('tabby-ml');
  });

  it('ranks JetBrains-compatible tools ahead of VS Code-only forks for Java/JetBrains teams', () => {
    const ranked = scoreToolsForTeam(CODING_TOOLS, {
      stack: 'java-kotlin-jetbrains',
      editor: 'jetbrains',
      hosting: 'enterprise-zdr',
      budget: 'mid-market',
      priorityTask: 'legacy-refactoring',
    });

    const top3 = ranked.slice(0, 3).map((r) => r.tool.id);
    expect(top3).not.toContain('cursor');
    expect(
      top3.some((id) =>
        ['jetbrains-ai', 'amazon-q-developer', 'augment-code', 'github-copilot'].includes(id),
      ),
    ).toBe(true);
  });

  it('exports a clean markdown decision table with criteria counts', () => {
    const criteria = {
      stack: 'typescript-react' as const,
      editor: 'vscode' as const,
      hosting: 'cloud-saas' as const,
      budget: 'startup' as const,
      priorityTask: 'multi-file-feature' as const,
    };
    const ranked = scoreToolsForTeam(CODING_TOOLS, criteria);
    const md = exportDecisionMatrixMarkdown(ranked, criteria, 4);
    expect(md).toContain('# AI coding tools decision matrix');
    expect(md).toContain('| Rank | Tool | Criteria matched |');
    expect(md).toContain('Cursor');
  });
});
