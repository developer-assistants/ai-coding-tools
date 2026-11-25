import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';

const ROOT_DIR = process.cwd();
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const BASE_PATH = '/ai-coding-tools';
const BASE_URL = 'https://developer-assistants.github.io/ai-coding-tools';
const TODAY = new Date().toISOString().slice(0, 10);

const cacheDir = path.resolve(ROOT_DIR, 'node_modules/.cache');
fs.mkdirSync(cacheDir, { recursive: true });
const bundleFile = path.join(cacheDir, 'seo-ssg-bundle.mjs');

const entryCode = `
export { CODING_TOOLS } from ${JSON.stringify(path.resolve(ROOT_DIR, 'src/data/tools.ts'))};
export { BENCHMARK_TASKS } from ${JSON.stringify(path.resolve(ROOT_DIR, 'src/data/tasks.ts'))};
export { STACK_PROFILES } from ${JSON.stringify(path.resolve(ROOT_DIR, 'src/data/stacks.ts'))};
export { COMPARISON_PAIRS } from ${JSON.stringify(path.resolve(ROOT_DIR, 'src/data/comparisons.ts'))};
export { countStrongTasks, getFitWeight } from ${JSON.stringify(path.resolve(ROOT_DIR, 'src/engine/selector.ts'))};
`;

await esbuild.build({
  stdin: {
    contents: entryCode,
    resolveDir: ROOT_DIR,
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: bundleFile,
});

const { CODING_TOOLS, BENCHMARK_TASKS, STACK_PROFILES, COMPARISON_PAIRS, countStrongTasks, getFitWeight } =
  await import(pathToFileURL(bundleFile).href);

const baseHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function navHtml() {
  return `<nav aria-label="Primary navigation"><ul>
    <li><a href="${BASE_PATH}/">Workbench</a></li>
    <li><a href="${BASE_PATH}/compare/">Comparisons</a></li>
    <li><a href="${BASE_PATH}/stacks/">Team stacks</a></li>
    <li><a href="${BASE_PATH}/tasks/">Task benchmarks</a></li>
    <li><a href="${BASE_PATH}/tools/">All 16 tools</a></li>
  </ul></nav>`;
}

function makeFaqLdJson(faqs) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

function makeBreadcrumbLdJson(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

const staticRoutes = [];

// 1. Home page "/"
const homeToolsRows = CODING_TOOLS.map(
  (t) =>
    `<tr><td><a href="${escapeHtml(t.website)}">${escapeHtml(t.name)}</a></td><td>${escapeHtml(t.editors.join(', '))}</td><td>${t.openSource ? 'Open source' : 'Proprietary'}</td><td>${escapeHtml(t.pricingSummary)}</td><td>${countStrongTasks(t)}/6 strong tasks</td></tr>`,
).join('');

const homeCompareLinks = COMPARISON_PAIRS.map(
  (c) => `<li><a href="${BASE_PATH}/compare/${c.slug}/">${escapeHtml(c.title)}</a></li>`,
).join('');

const homeStackLinks = STACK_PROFILES.map(
  (s) => `<li><a href="${BASE_PATH}/stacks/${s.slug}/">${escapeHtml(s.title)}</a></li>`,
).join('');

const homeTaskLinks = BENCHMARK_TASKS.map(
  (t) => `<li><a href="${BASE_PATH}/tasks/${t.slug}/">${escapeHtml(t.title)}</a></li>`,
).join('');

staticRoutes.push({
  route: '/',
  title: 'AI Coding Tools Comparison & Team Stack Selector (2026)',
  description:
    'Compare 16 AI coding tools (Cursor, GitHub Copilot, Claude Code, Windsurf, OpenAI Codex CLI, Aider, Cline, TabbyML) on identical engineering tasks and pick the right tool for your team stack.',
  bodyHtml: `
    ${navHtml()}
    <main>
      <h1>Compare AI coding tools on real tasks</h1>
      <p>Evaluate 16 AI coding assistants on six identical software engineering tasks and filter by editor, privacy model, budget, and language stack.</p>
      <h2>All 16 AI coding tools</h2>
      <table><thead><tr><th>Tool</th><th>Editors</th><th>License</th><th>Pricing (2026)</th><th>Strong tasks</th></tr></thead><tbody>${homeToolsRows}</tbody></table>
      <h2>Head-to-head comparisons</h2>
      <ul>${homeCompareLinks}</ul>
      <h2>Recommendations by team stack</h2>
      <ul>${homeStackLinks}</ul>
      <h2>Identical engineering task benchmarks</h2>
      <ul>${homeTaskLinks}</ul>
    </main>
  `,
});

// 2. Comparisons hub "/compare/"
staticRoutes.push({
  route: '/compare/',
  title: 'AI Coding Tools Head-to-Head Comparisons (Cursor, Copilot, Claude Code, Windsurf)',
  description:
    'Side-by-side comparisons of leading AI coding tools across multi-file features, refactoring, debugging, test generation, PR review, and inline autocomplete.',
  ldGraph: [
    makeBreadcrumbLdJson([
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Comparisons', url: `${BASE_URL}/compare/` },
    ]),
  ],
  bodyHtml: `
    ${navHtml()}
    <main>
      <h1>Head-to-head AI coding tool comparisons</h1>
      <ul>${homeCompareLinks}</ul>
    </main>
  `,
});

// 3. Individual comparison pages (8 routes)
for (const pair of COMPARISON_PAIRS) {
  const toolA = CODING_TOOLS.find((t) => t.id === pair.toolAId);
  const toolB = CODING_TOOLS.find((t) => t.id === pair.toolBId);
  const taskRows = BENCHMARK_TASKS.map((task) => {
    const a = toolA.tasks[task.id];
    const b = toolB.tasks[task.id];
    return `<tr><td>${escapeHtml(task.title)}</td><td>${escapeHtml(a.fit)}: ${escapeHtml(a.strength)}</td><td>${escapeHtml(b.fit)}: ${escapeHtml(b.strength)}</td></tr>`;
  }).join('');

  const faqsHtml = pair.faqs
    .map((f) => `<h3>${escapeHtml(f.question)}</h3><p>${escapeHtml(f.answer)}</p>`)
    .join('');

  staticRoutes.push({
    route: `/compare/${pair.slug}/`,
    title: `${pair.title} | AI Coding Tools`,
    description: pair.metaDescription,
    ldGraph: [
      makeBreadcrumbLdJson([
        { name: 'Home', url: `${BASE_URL}/` },
        { name: 'Comparisons', url: `${BASE_URL}/compare/` },
        { name: `${toolA.name} vs ${toolB.name}`, url: `${BASE_URL}/compare/${pair.slug}/` },
      ]),
      makeFaqLdJson(pair.faqs),
    ].filter(Boolean),
    bodyHtml: `
      ${navHtml()}
      <main>
        <h1>${escapeHtml(pair.title)}</h1>
        <p>${escapeHtml(pair.summary)}</p>
        <h2>Same-task comparison table</h2>
        <table><thead><tr><th>Task</th><th>${escapeHtml(toolA.name)}</th><th>${escapeHtml(toolB.name)}</th></tr></thead><tbody>${taskRows}</tbody></table>
        <h2>Verdict</h2>
        <p>${escapeHtml(pair.verdict)}</p>
        <h2>Frequently asked questions</h2>
        ${faqsHtml}
      </main>
    `,
  });
}

// 4. Stacks hub "/stacks/"
staticRoutes.push({
  route: '/stacks/',
  title: 'Best AI Coding Tools by Team Stack (TypeScript, Python, Java, Go, Self-Hosted)',
  description:
    'Team stack selection matrix for TypeScript/React, Python/ML, Java/JetBrains, Go/Rust, self-hosted air-gapped teams, and enterprise monorepos.',
  ldGraph: [
    makeBreadcrumbLdJson([
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Team stacks', url: `${BASE_URL}/stacks/` },
    ]),
  ],
  bodyHtml: `
    ${navHtml()}
    <main>
      <h1>AI coding tool recommendations by team stack</h1>
      <ul>${homeStackLinks}</ul>
    </main>
  `,
});

// 5. Individual stack pages (6 routes)
for (const stack of STACK_PROFILES) {
  const recsHtml = stack.topRecommendations
    .map((id) => CODING_TOOLS.find((t) => t.id === id))
    .filter(Boolean)
    .map((t) => `<li><strong>${escapeHtml(t.name)}</strong>: ${escapeHtml(t.bestFor)} (${escapeHtml(t.pricingSummary)})</li>`)
    .join('');
  const faqsHtml = stack.faqs
    .map((f) => `<h3>${escapeHtml(f.question)}</h3><p>${escapeHtml(f.answer)}</p>`)
    .join('');

  staticRoutes.push({
    route: `/stacks/${stack.slug}/`,
    title: `Best AI Coding Tools for ${stack.shortTitle} Teams (2026)`,
    description: `${stack.description} Top picks: ${stack.topRecommendations.map((id) => CODING_TOOLS.find((t) => t.id === id)?.name).join(', ')}.`,
    ldGraph: [
      makeBreadcrumbLdJson([
        { name: 'Home', url: `${BASE_URL}/` },
        { name: 'Team stacks', url: `${BASE_URL}/stacks/` },
        { name: stack.shortTitle, url: `${BASE_URL}/stacks/${stack.slug}/` },
      ]),
      makeFaqLdJson(stack.faqs),
    ].filter(Boolean),
    bodyHtml: `
      ${navHtml()}
      <main>
        <h1>Best AI coding tools for ${escapeHtml(stack.title.toLowerCase())}</h1>
        <p>${escapeHtml(stack.description)}</p>
        <p>${escapeHtml(stack.rolloutNotes)}</p>
        <h2>Top recommended tools</h2>
        <ul>${recsHtml}</ul>
        <h2>Frequently asked questions</h2>
        ${faqsHtml}
      </main>
    `,
  });
}

// 6. Tasks hub "/tasks/"
staticRoutes.push({
  route: '/tasks/',
  title: 'AI Coding Tool Benchmarks on 6 Identical Engineering Tasks',
  description:
    'Compare 16 AI coding tools on identical multi-file feature, legacy refactoring, bug debugging, test generation, PR review, and inline autocomplete tasks.',
  ldGraph: [
    makeBreadcrumbLdJson([
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Task benchmarks', url: `${BASE_URL}/tasks/` },
    ]),
  ],
  bodyHtml: `
    ${navHtml()}
    <main>
      <h1>Identical engineering task benchmarks</h1>
      <ul>${homeTaskLinks}</ul>
    </main>
  `,
});

// 7. Individual task pages (6 routes)
for (const task of BENCHMARK_TASKS) {
  const sorted = [...CODING_TOOLS].sort(
    (a, b) =>
      getFitWeight(b.tasks[task.id].fit) - getFitWeight(a.tasks[task.id].fit) ||
      a.name.localeCompare(b.name),
  );
  const rows = sorted
    .map((t) => {
      const ev = t.tasks[task.id];
      return `<tr><td>${escapeHtml(t.name)}</td><td>${escapeHtml(ev.fit)}</td><td>${escapeHtml(ev.workflowMode)}</td><td>${escapeHtml(ev.strength)}</td><td>${escapeHtml(ev.tradeoff)}</td></tr>`;
    })
    .join('');
  const faqsHtml = task.faqs
    .map((f) => `<h3>${escapeHtml(f.question)}</h3><p>${escapeHtml(f.answer)}</p>`)
    .join('');

  staticRoutes.push({
    route: `/tasks/${task.slug}/`,
    title: `Best AI Coding Tools for ${task.title} | Same-Task Benchmark`,
    description: `${task.summary} Compare all 16 tools on the same prompt and verification criteria.`,
    ldGraph: [
      makeBreadcrumbLdJson([
        { name: 'Home', url: `${BASE_URL}/` },
        { name: 'Task benchmarks', url: `${BASE_URL}/tasks/` },
        { name: task.shortTitle, url: `${BASE_URL}/tasks/${task.slug}/` },
      ]),
      makeFaqLdJson(task.faqs),
    ].filter(Boolean),
    bodyHtml: `
      ${navHtml()}
      <main>
        <h1>${escapeHtml(task.title)}</h1>
        <p>${escapeHtml(task.scenario)}</p>
        <h2>All 16 tools evaluated on this task</h2>
        <table><thead><tr><th>Tool</th><th>Fit</th><th>Workflow</th><th>Works well</th><th>Tradeoff</th></tr></thead><tbody>${rows}</tbody></table>
        <h2>Frequently asked questions</h2>
        ${faqsHtml}
      </main>
    `,
  });
}

// 8. Full tools directory "/tools/"
staticRoutes.push({
  route: '/tools/',
  title: 'All 16 AI Coding Tools Directory & Capability Matrix (2026)',
  description:
    'Searchable comparison matrix of 16 AI coding tools covering editors, multi-file agents, inline autocomplete, self-hosting, BYOK, MCP support, and verified 2026 pricing.',
  ldGraph: [
    makeBreadcrumbLdJson([
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'All 16 tools', url: `${BASE_URL}/tools/` },
    ]),
  ],
  bodyHtml: `
    ${navHtml()}
    <main>
      <h1>All 16 AI coding tools compared</h1>
      <table><thead><tr><th>Tool</th><th>Editors</th><th>License</th><th>Pricing (2026)</th><th>Strong tasks</th></tr></thead><tbody>${homeToolsRows}</tbody></table>
    </main>
  `,
});

for (const page of staticRoutes) {
  const canonicalUrl = page.route === '/' ? `${BASE_URL}/` : `${BASE_URL}${page.route}`;
  let html = baseHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
  );
  html = html.replace(
    /<link\s+rel="canonical"[\s\S]*?\/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:title"[\s\S]*?\/>/,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:url"[\s\S]*?\/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`,
  );

  if (page.ldGraph && page.ldGraph.length > 0) {
    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': page.ldGraph,
    });
    html = html.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">${jsonLd}</script>`,
    );
  }

  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${page.bodyHtml}</div>`,
  );

  const outDir =
    page.route === '/'
      ? DIST_DIR
      : path.join(DIST_DIR, page.route.replace(/^\/|\/$/g, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
}

fs.writeFileSync(path.join(DIST_DIR, '404.html'), baseHtml, 'utf8');

const sitemapUrls = staticRoutes
  .map((p) => {
    const loc = p.route === '/' ? `${BASE_URL}/` : `${BASE_URL}${p.route}`;
    const priority = p.route === '/' ? '1.0' : p.route.split('/').length <= 3 ? '0.8' : '0.9';
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`;
fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');

const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`;
fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf8');

const llmsTxt = `# AI Coding Tools Comparison and Team Stack Selector (developer-assistants/ai-coding-tools)

> Side-by-side comparison of 16 AI coding tools on 6 identical engineering tasks, plus an interactive team stack decision matrix with verified November 2026 pricing.

## Summary
This project extends the archived sourcegraph/awesome-code-ai catalog into a structured task evaluation and team selector. It compares Cursor, GitHub Copilot, Claude Code, Windsurf, OpenAI Codex CLI, Aider, Cline, Continue, Kiro, Augment Code, Sourcegraph Cody, Amazon Q Developer, Google Gemini Code Assist, JetBrains AI Assistant, Tabnine, and TabbyML across 6 identical tasks: multi-file feature implementation, legacy codebase refactoring, production bug debugging, automated test generation, pull request code review, and inline autocomplete.

## Key pages
- Workbench home: ${BASE_URL}/
- Head-to-head comparisons: ${BASE_URL}/compare/
- Team stack guides: ${BASE_URL}/stacks/
- Identical task benchmarks: ${BASE_URL}/tasks/
- Full 16-tool matrix: ${BASE_URL}/tools/

## Popular comparisons
${COMPARISON_PAIRS.map((c) => `- ${c.title}: ${BASE_URL}/compare/${c.slug}/`).join('\n')}

## Team stack guides
${STACK_PROFILES.map((s) => `- ${s.title}: ${BASE_URL}/stacks/${s.slug}/`).join('\n')}

## Source and repository
- Repository: https://github.com/developer-assistants/ai-coding-tools
- Inspired by: https://github.com/sourcegraph/awesome-code-ai
`;

fs.writeFileSync(path.join(DIST_DIR, 'llms.txt'), llmsTxt, 'utf8');
fs.writeFileSync(path.join(ROOT_DIR, 'llms.txt'), llmsTxt, 'utf8');

console.log(`Generated ${staticRoutes.length} static SEO pages, sitemap.xml, robots.txt, and llms.txt.`);
