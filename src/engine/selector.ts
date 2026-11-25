import type {
  BudgetTier,
  CodingTool,
  EditorTarget,
  HostingModel,
  StackId,
  TaskId,
} from '../data/types';

export interface TeamSelectorCriteria {
  stack: StackId;
  editor: EditorTarget | 'any';
  hosting: HostingModel;
  budget: BudgetTier;
  priorityTask: TaskId;
  requireOpenSource?: boolean;
  requireMcp?: boolean;
  requireInlineAutocomplete?: boolean;
}

export interface ScoredToolResult {
  tool: CodingTool;
  totalScore: number;
  taskScore: number;
  eligible: boolean;
  reasons: string[];
  caveats: string[];
}

export function getAverageTaskScore(tool: CodingTool): number {
  const entries = Object.values(tool.tasks);
  if (entries.length === 0) return 0;
  const sum = entries.reduce((acc, item) => acc + item.score, 0);
  return Math.round(sum / entries.length);
}

export function scoreToolsForTeam(
  tools: CodingTool[],
  criteria: TeamSelectorCriteria,
): ScoredToolResult[] {
  const results = tools.map((tool) => {
    const reasons: string[] = [];
    const caveats: string[] = [];
    let eligible = true;

    // 1. Hard hosting compliance check
    if (criteria.hosting === 'self-hosted' && !tool.hosting.includes('self-hosted')) {
      eligible = false;
      caveats.push('Does not support self-hosted or air-gapped deployment.');
    } else if (
      criteria.hosting === 'enterprise-zdr' &&
      !tool.hosting.includes('enterprise-zdr') &&
      !tool.hosting.includes('self-hosted')
    ) {
      eligible = false;
      caveats.push('No enterprise zero-data-retention hosting tier.');
    } else if (criteria.hosting === 'self-hosted') {
      reasons.push('Supports self-hosted or private VPC models.');
    }

    // 2. Hard toggle filters
    if (criteria.requireOpenSource && !tool.openSource) {
      eligible = false;
      caveats.push('Proprietary license.');
    }
    if (criteria.requireMcp && !tool.mcpSupported) {
      eligible = false;
      caveats.push('No native Model Context Protocol (MCP) support.');
    }
    if (criteria.requireInlineAutocomplete && !tool.inlineAutocomplete) {
      eligible = false;
      caveats.push('No built-in inline Tab autocomplete.');
    }

    // 3. Priority task score (0 to 50 weighted points)
    const taskEval = tool.tasks[criteria.priorityTask];
    const taskScore = taskEval.score;
    let totalScore = taskScore * 0.5;
    if (taskEval.fit === 'Strong') {
      reasons.push(`Strong fit for ${criteria.priorityTask.replace(/-/g, ' ')} (${taskScore}/100).`);
    } else if (taskEval.fit === 'Limited') {
      caveats.push(`Limited fit for ${criteria.priorityTask.replace(/-/g, ' ')} (${taskScore}/100).`);
    }

    // 4. Stack alignment (0 to 20 points)
    if (tool.strongStacks.includes(criteria.stack)) {
      totalScore += 20;
      reasons.push('Well suited to your target language stack.');
    } else {
      totalScore += 6;
    }

    // 5. Editor compatibility (0 to 15 points)
    if (criteria.editor === 'any') {
      totalScore += 12;
    } else if (tool.editors.includes(criteria.editor)) {
      totalScore += 15;
      reasons.push(`Native support for ${criteria.editor}.`);
    } else {
      totalScore -= 18;
      caveats.push(`Does not run natively inside ${criteria.editor}.`);
    }

    // 6. Budget & licensing fit (0 to 15 points)
    const monthly = tool.startingPaidMonthlyUsd ?? 0;
    if (criteria.budget === 'free-oss') {
      if (tool.openSource && tool.hasFreeTier) {
        totalScore += 15;
        reasons.push('Open source with zero mandatory seat fee.');
      } else if (tool.hasFreeTier) {
        totalScore += 9;
        reasons.push('Includes a free individual tier.');
      } else {
        totalScore -= 8;
        caveats.push('Requires a paid subscription or API spend.');
      }
    } else if (criteria.budget === 'startup') {
      if (monthly <= 20) {
        totalScore += 14;
      } else {
        totalScore += 6;
        caveats.push('Higher per-seat cost for small teams.');
      }
    } else if (criteria.budget === 'mid-market') {
      totalScore += monthly <= 40 ? 13 : 9;
    } else {
      // enterprise
      if (tool.hosting.includes('enterprise-zdr') || tool.hosting.includes('self-hosted')) {
        totalScore += 15;
        reasons.push('Enterprise governance and data retention options available.');
      } else {
        totalScore += 5;
      }
    }

    const clamped = Math.max(0, Math.min(100, Math.round(totalScore)));

    return {
      tool,
      totalScore: clamped,
      taskScore,
      eligible,
      reasons,
      caveats,
    };
  });

  return results.sort((a, b) => {
    if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return b.taskScore - a.taskScore;
  });
}

export function exportDecisionMatrixMarkdown(
  results: ScoredToolResult[],
  criteria: TeamSelectorCriteria,
  limit = 6,
): string {
  const top = results.filter((r) => r.eligible).slice(0, limit);
  const lines = [
    `# AI Coding Tools Decision Matrix`,
    ``,
    `- Stack: \`${criteria.stack}\``,
    `- Editor: \`${criteria.editor}\``,
    `- Hosting: \`${criteria.hosting}\``,
    `- Budget: \`${criteria.budget}\``,
    `- Priority task: \`${criteria.priorityTask}\``,
    ``,
    `| Rank | Tool | Score | Task Fit | Open Source | Self-Hosted | Pricing | Primary Tradeoff |`,
    `| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- |`,
  ];

  top.forEach((item, idx) => {
    const t = item.tool;
    const taskFit = t.tasks[criteria.priorityTask].fit;
    lines.push(
      `| ${idx + 1} | [${t.name}](${t.website}) | ${item.totalScore}/100 | ${taskFit} | ${t.openSource ? 'Yes' : 'No'} | ${t.hosting.includes('self-hosted') ? 'Yes' : 'No'} | ${t.pricingSummary} | ${t.watchOut} |`,
    );
  });

  if (top.length === 0) {
    lines.push(`| - | No tools matched all hard constraints | - | - | - | - | - | Relax one filter and re-run |`);
  }

  return lines.join('\n');
}
