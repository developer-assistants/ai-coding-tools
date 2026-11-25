export type ToolCategory =
  | 'agentic-ide'
  | 'ide-extension'
  | 'terminal-agent'
  | 'self-hosted';

export type HostingModel = 'cloud-saas' | 'enterprise-zdr' | 'self-hosted';

export type EditorTarget = 'vscode' | 'jetbrains' | 'terminal' | 'neovim';

export type StackId =
  | 'typescript-react'
  | 'python-ml'
  | 'java-kotlin-jetbrains'
  | 'go-rust-systems'
  | 'self-hosted-airgapped'
  | 'enterprise-monorepo';

export type TaskId =
  | 'multi-file-feature'
  | 'legacy-refactoring'
  | 'bug-debugging'
  | 'test-generation'
  | 'pr-code-review'
  | 'inline-autocomplete';

export type BudgetTier = 'free-oss' | 'startup' | 'mid-market' | 'enterprise';

export type TaskFitRating = 'Strong' | 'Good' | 'Partial' | 'Limited';

export interface TaskEvaluation {
  fit: TaskFitRating;
  score: number; // 1-100 deterministic rubric score
  workflowMode: string;
  contextScope: string;
  strength: string;
  tradeoff: string;
  sampleWorkflow: string;
}

export interface CodingTool {
  id: string;
  name: string;
  category: ToolCategory;
  tagline: string;
  website: string;
  repoUrl?: string;
  openSource: boolean;
  license: string;
  pricingSummary: string;
  hasFreeTier: boolean;
  startingPaidMonthlyUsd: number | null;
  editors: EditorTarget[];
  hosting: HostingModel[];
  byokSupported: boolean;
  mcpSupported: boolean;
  multiFileAgent: boolean;
  inlineAutocomplete: boolean;
  contextEngine: string;
  strongStacks: StackId[];
  bestFor: string;
  watchOut: string;
  tasks: Record<TaskId, TaskEvaluation>;
}

export interface BenchmarkTask {
  id: TaskId;
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  scenario: string;
  filesTouched: string;
  evaluationCriteria: string[];
  promptBlueprint: string;
  faqs: Array<{ question: string; answer: string }>;
}

export interface StackProfile {
  id: StackId;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  typicalRepo: string;
  defaultEditor: EditorTarget;
  defaultHosting: HostingModel;
  defaultBudget: BudgetTier;
  priorityTask: TaskId;
  topRecommendations: string[];
  avoidPatterns: string[];
  rolloutNotes: string;
  faqs: Array<{ question: string; answer: string }>;
}

export interface ComparisonPair {
  slug: string;
  toolAId: string;
  toolBId: string;
  title: string;
  metaDescription: string;
  summary: string;
  whenToPickA: string[];
  whenToPickB: string[];
  verdict: string;
  faqs: Array<{ question: string; answer: string }>;
}
