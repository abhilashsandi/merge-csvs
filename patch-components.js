const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'app', 'system-design', 'components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const replacements = [
  // Backgrounds
  { regex: /bg-slate-900(?![/\w-])/g, repl: 'bg-slate-50 dark:bg-slate-900' },
  { regex: /bg-slate-800(?![/\w-])/g, repl: 'bg-white dark:bg-slate-800' },
  { regex: /bg-slate-800\/50/g, repl: 'bg-slate-100/80 dark:bg-slate-800/50' },
  { regex: /bg-slate-800\/80/g, repl: 'bg-slate-50/90 dark:bg-slate-800/80' },
  { regex: /bg-slate-900\/50/g, repl: 'bg-slate-200/50 dark:bg-slate-900/50' },
  
  // Text colors
  // Note: we only replace exact matches like "text-white" to avoid double patching
  // e.g. if it's already "text-slate-900 dark:text-white"
  { regex: /(?<!dark:)text-white(?![/\w-])/g, repl: 'text-slate-900 dark:text-white' },
  { regex: /(?<!dark:)text-slate-300(?![/\w-])/g, repl: 'text-slate-700 dark:text-slate-300' },
  { regex: /(?<!dark:)text-slate-400(?![/\w-])/g, repl: 'text-slate-600 dark:text-slate-400' },
  { regex: /(?<!dark:)text-slate-200(?![/\w-])/g, repl: 'text-slate-800 dark:text-slate-200' },
  { regex: /(?<!dark:)text-slate-500(?![/\w-])/g, repl: 'text-slate-500 dark:text-slate-500' },

  // Borders
  { regex: /(?<!dark:)border-slate-700(?![/\w-])/g, repl: 'border-slate-300 dark:border-slate-700' },
  { regex: /(?<!dark:)border-slate-700\/60/g, repl: 'border-slate-300/60 dark:border-slate-700/60' },
  { regex: /(?<!dark:)border-slate-700\/50/g, repl: 'border-slate-300/50 dark:border-slate-700/50' },
  { regex: /(?<!dark:)border-slate-800(?![/\w-])/g, repl: 'border-slate-200 dark:border-slate-800' },
  
  // Custom Card/Badge backgrounds that are explicitly dark
  { regex: /bg-black\/20/g, repl: 'bg-black/5 dark:bg-black/20' },
  { regex: /bg-black\/40/g, repl: 'bg-black/10 dark:bg-black/40' },
  { regex: /bg-blue-900\/20/g, repl: 'bg-blue-100/50 dark:bg-blue-900/20' },
  { regex: /bg-blue-900\/40/g, repl: 'bg-blue-200/50 dark:bg-blue-900/40' },
  
  // Specific fix for Interactive Load Balancer background
  { regex: /bg-slate-950(?![/\w-])/g, repl: 'bg-slate-100 dark:bg-slate-950' },
];

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // We want to avoid replacing something like `text-slate-900 dark:text-white` into `text-slate-900 dark:text-slate-900 dark:text-white`
  // The negative lookbehinds in regex array handle `dark:`, but what about the first part?
  // If we just replace `text-white` with `text-slate-900 dark:text-white`, then next time it matches `text-white` again unless we avoid matching `dark:text-white`.
  
  for (const { regex, repl } of replacements) {
    content = content.replace(regex, repl);
  }

  // Some cleanup for accidental double prefixes
  content = content.replace(/text-slate-900 dark:text-slate-900 dark:text-white/g, 'text-slate-900 dark:text-white');
  content = content.replace(/text-slate-700 dark:text-slate-700 dark:text-slate-300/g, 'text-slate-700 dark:text-slate-300');
  content = content.replace(/text-slate-600 dark:text-slate-600 dark:text-slate-400/g, 'text-slate-600 dark:text-slate-400');
  content = content.replace(/border-slate-300 dark:border-slate-300 dark:border-slate-700/g, 'border-slate-300 dark:border-slate-700');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Patched ${file}`);
  }
}

console.log("Done patching components for light mode");
