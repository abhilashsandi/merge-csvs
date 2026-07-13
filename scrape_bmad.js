const { execSync } = require('child_process');
const fs = require('fs');

const urls = [
  "https://docs.bmad-method.org/",
  "https://docs.bmad-method.org/tutorials/getting-started/",
  "https://docs.bmad-method.org/how-to/upgrade-to-v6/",
  "https://docs.bmad-method.org/how-to/get-answers-about-bmad/",
  "https://docs.bmad-method.org/how-to/quick-fixes/",
  "https://docs.bmad-method.org/how-to/established-projects/",
  "https://docs.bmad-method.org/how-to/customize-bmad/",
  "https://docs.bmad-method.org/how-to/project-context/",
  "https://docs.bmad-method.org/how-to/shard-large-documents/",
  "https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/",
  "https://docs.bmad-method.org/how-to/pressure-test-an-idea/",
  "https://docs.bmad-method.org/how-to/use-web-bundles/",
  "https://docs.bmad-method.org/explanation/named-agents/",
  "https://docs.bmad-method.org/explanation/analysis-phase/",
  "https://docs.bmad-method.org/explanation/brainstorming/",
  "https://docs.bmad-method.org/explanation/advanced-elicitation/",
  "https://docs.bmad-method.org/explanation/why-solutioning-matters/",
  "https://docs.bmad-method.org/explanation/preventing-agent-conflicts/",
  "https://docs.bmad-method.org/explanation/quick-dev/",
  "https://docs.bmad-method.org/explanation/checkpoint-preview/",
  "https://docs.bmad-method.org/explanation/adversarial-review/",
  "https://docs.bmad-method.org/explanation/party-mode/",
  "https://docs.bmad-method.org/explanation/established-projects-faq/",
  "https://docs.bmad-method.org/explanation/forge-idea/",
  "https://docs.bmad-method.org/explanation/web-bundles/",
  "https://docs.bmad-method.org/reference/workflow-map/",
  "https://docs.bmad-method.org/reference/agents/",
  "https://docs.bmad-method.org/reference/core-tools/",
  "https://docs.bmad-method.org/reference/commands/",
  "https://docs.bmad-method.org/reference/modules/",
  "https://docs.bmad-method.org/reference/testing/",
  "https://docs.bmad-method.org/reference/dev-auto/"
];

const outputFile = 'C:\\Users\\abhilashsandi\\Documents\\projects\\merge-csvs\\bmad-docs.md';
fs.writeFileSync(outputFile, '# BMad Method Documentation\n\n');

console.log(`Scraping ${urls.length} URLs...`);

for (let i = 0; i < urls.length; i++) {
  const url = urls[i];
  console.log(`[${i+1}/${urls.length}] Scraping ${url}...`);
  try {
    const result = execSync(`firecrawl scrape "${url}" --only-main-content`, { encoding: 'utf8' });
    fs.appendFileSync(outputFile, `\n\n## Source: ${url}\n\n`);
    fs.appendFileSync(outputFile, result);
    console.log(`  -> Success`);
  } catch (err) {
    console.error(`  -> Failed: ${err.message}`);
  }
}

console.log('Done! Compiled into bmad-docs.md');
