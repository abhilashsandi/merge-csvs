const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'app', 'system-design');
const componentsDir = path.join(dir, 'components');

const filesToPatch = [
  path.join(dir, 'page.tsx'),
  path.join(componentsDir, 'Module1.tsx'),
  path.join(componentsDir, 'Module2.tsx'),
  path.join(componentsDir, 'Module3.tsx'),
  path.join(componentsDir, 'Module4.tsx'),
  path.join(componentsDir, 'Module5.tsx'),
  path.join(componentsDir, 'CodeBlock.tsx'),
  path.join(componentsDir, 'InteractiveChaosMonkey.tsx'),
  path.join(componentsDir, 'InteractiveLoadBalancer.tsx'),
  path.join(componentsDir, 'InteractivePubSub.tsx')
];

const replacements = [
  { from: /\\bbg-slate-900\\b/g, to: 'bg-slate-50 dark:bg-slate-900' },
  { from: /\\bbg-slate-800\\b/g, to: 'bg-white dark:bg-slate-800' },
  { from: /\\bbg-slate-950\\b/g, to: 'bg-slate-100 dark:bg-slate-950' },
  { from: /\\btext-slate-300\\b/g, to: 'text-slate-700 dark:text-slate-300' },
  { from: /\\btext-slate-400\\b/g, to: 'text-slate-600 dark:text-slate-400' },
  { from: /\\btext-slate-500\\b/g, to: 'text-slate-500 dark:text-slate-500' },
  { from: /\\btext-white\\b/g, to: 'text-slate-900 dark:text-white' },
  { from: /\\bborder-slate-700\\b/g, to: 'border-slate-200 dark:border-slate-700' },
  { from: /\\bborder-slate-800\\b/g, to: 'border-slate-300 dark:border-slate-800' },
  { from: /\\bborder-slate-600\\b/g, to: 'border-slate-300 dark:border-slate-600' },
  { from: /bg-\\[#0a0f1c\\]/g, to: 'bg-slate-50 dark:bg-[#0a0f1c]' },
  { from: /bg-\\[#111827\\]/g, to: 'bg-white dark:bg-[#111827]' },
  { from: /bg-\\[#0d1117\\]/g, to: 'bg-slate-100 dark:bg-[#0d1117]' },
  { from: /bg-\\[#161b22\\]/g, to: 'bg-slate-200 dark:bg-[#161b22]' }
];

filesToPatch.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    if (content.includes('dark:bg-slate-900')) {
      console.log("Skipping " + file + " - already patched");
      return;
    }

    replacements.forEach(r => {
      content = content.replace(r.from, r.to);
    });

    fs.writeFileSync(file, content);
    console.log("Patched " + file);
  }
});
