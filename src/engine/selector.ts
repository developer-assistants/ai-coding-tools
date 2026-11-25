import type {
  BudgetTier,
  CodingTool,
  EditorTarget,
  HostingModel,
  StackId,
  TaskFitRating,
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
  matchedChecks: number;
  totalChecks: number;
  taskFit: TaskFitRating;
  eligible: boolean;
  reasons: string[];
  caveats: string[];
  sortWeight: number;
}

const FIT_WEIGHT: Record<TaskFitRating, number> = {
  Strong: 4,
  Good: 3,
  Partial: 2,
  Limited: 1,
};

export function getFitWeight(fit: TaskFitRating): number {
  return FIT_WEIGHT[fit];
}

export function countStrongTasks(tool: CodingTool): number {
  return Object.values(tool.tasks).filter((t) => t.fit === 'Strong').length;
}

export function scoreToolsForTeam(
  tools: CodingTool[],
  criteria: TeamSelectorCriteria,
): ScoredToolResult[] {
  const results = tools.map((tool) => {
    const reasons: string[] = [];
    const caveats: string[] = [];
    let eligible = true;
    let matchedChecks = 0;
    const totalChecks = 4;

    // 1. Hosting compliance (hard filter)
    if (criteria.hosting === 'self-hosted' && !tool.hosting.includes('self-hosted')) {
      eligible = false;
      caveats.push('No self-hosted or air-gapped deployment option.');
    } else if (
      criteria.hosting === 'enterprise-zdr' &&
      !tool.hosting.includes('enterprise-zdr') &&
      !tool.hosting.includes('self-hosted')
    ) {
      eligible = false;
      caveats.push('No enterprise zero-data-retention hosting tier.');
    } else if (criteria.hosting === 'self-hosted') {
      reasons.push('Supports self-hosted or private VPC deployment.');
    }

    // Hard boolean constraints
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

    // Check 1: Priority task fit
    const taskEval = tool.tasks[criteria.priorityTask];
    const taskFit = taskEval.fit;
    if (taskFit === 'Strong' || taskFit === 'Good') {
      matchedChecks += 1;
      reasons.push(`${taskFit} fit for ${criteria.priorityTask.replace(/-/g, ' ')}.`);
    } else {
      caveats.push(`${taskFit} fit for ${criteria.priorityTask.replace(/-/g, ' ')}.`);
    }

    // Check 2: Stack alignment
    const stackMatch = tool.strongStacks.includes(criteria.stack);
    if (stackMatch) {
      matchedChecks += 1;
      reasons.push('Matches your target language stack.');
    }

    // Check 3: Editor support
    const editorMatch =
      criteria.editor === 'any' || tool.editors.includes(criteria.editor);
    if (editorMatch) {
      matchedChecks += 1;
      if (criteria.editor !== 'any') {
        reasons.push(`Runs natively in ${criteria.editor}.`);
      }
    } else {
      caveats.push(`Does not run natively inside ${criteria.editor}.`);
    }

    // Check 4: Budget tier fit
    const monthly = tool.startingPaidMonthlyUsd;
    let budgetMatch = false;
    if (criteria.budget === 'free-oss') {
      budgetMatch = tool.openSource || tool.hasFreeTier;
      if (tool.openSource) {
        reasons.push('Open-source client with no mandatory seat fee.');
      } else if (tool.hasFreeTier) {
        reasons.push('Includes a free tier.');
      } else {
        caveats.push('Requires a paid subscription or enterprise contract.');
      }
    } else if (criteria.budget === 'startup') {
      budgetMatch = monthly !== null && monthly <= 25;
      if (!budgetMatch) {
        caveats.push('Higher entry cost for small teams.');
      }
    } else if (criteria.budget === 'mid-market') {
      budgetMatch = monthly !== null && monthly <= 50;
      if (!budgetMatch) {
        caveats.push('Enterprise-only or higher per-seat pricing.');
      }
    } else {
      budgetMatch =
        tool.hosting.includes('enterprise-zdr') || tool.hosting.includes('self-hosted');
      if (budgetMatch) {
        reasons.push('Enterprise governance and data retention options available.');
      }
    }
    if (budgetMatch) {
      matchedChecks += 1;
    }

    // Deterministic tie-breaker weight (never shown as an invented score)
    const sortWeight =
      matchedChecks * 100 +
      FIT_WEIGHT[taskFit] * 25 +
      (editorMatch ? 15 : -25) +
      (stackMatch ? 10 : 0) +
      countStrongTasks(tool);

    return {
      tool,
      matchedChecks,
      totalChecks,
      taskFit,
      eligible,
      reasons,
      caveats,
      sortWeight,
    };
  });

  return results.sort((a, b) => {
    if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
    if (b.sortWeight !== a.sortWeight) return b.sortWeight - a.sortWeight;
    return a.tool.name.localeCompare(b.tool.name);
  });
}

export function exportDecisionMatrixMarkdown(
  results: ScoredToolResult[],
  criteria: TeamSelectorCriteria,
  limit = 6,
): string {
  const top = results.filter((r) => r.eligible).slice(0, limit);
  const lines = [
    `# AI coding tools decision matrix`,
    ``,
    `- Stack: \`${criteria.stack}\``,
    `- Editor: \`${criteria.editor}\``,
    `- Hosting: \`${criteria.hosting}\``,
    `- Budget: \`${criteria.budget}\``,
    `- Priority task: \`${criteria.priorityTask}\``,
    ``,
    `| Rank | Tool | Criteria matched | Task fit | Open source | Self-hosted | Pricing | Main tradeoff |`,
    `| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- |`,
  ];

  top.forEach((item, idx) => {
    const t = item.tool;
    lines.push(
      `| ${idx + 1} | [${t.name}](${t.website}) | ${item.matchedChecks}/${item.totalChecks} | ${item.taskFit} | ${t.openSource ? 'Yes' : 'No'} | ${t.hosting.includes('self-hosted') ? 'Yes' : 'No'} | ${t.pricingSummary} | ${t.watchOut} |`,
    );
  });

  if (top.length === 0) {
    lines.push(`| - | No tools matched all hard filters | - | - | - | - | - | Relax one filter and re-run |`);
  }

  return lines.join('\n');
}
