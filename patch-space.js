const fs = require('fs');
const path = require('path');

// 1. Patch page.tsx padding
const pageFile = path.join(__dirname, 'app', 'system-design', 'page.tsx');
let pageContent = fs.readFileSync(pageFile, 'utf8');

// The main content body padding is currently p-4 sm:p-8 md:p-12
pageContent = pageContent.replace(
  /className="p-4 sm:p-8 md:p-12"/g,
  'className="p-2 sm:p-6 md:p-12"'
);
// The header padding inside the module
pageContent = pageContent.replace(
  /className=\{`px-5 sm:px-8 md:px-12 py-8 sm:py-12/g,
  'className={`px-4 sm:px-8 md:px-12 py-6 sm:py-12'
);
fs.writeFileSync(pageFile, pageContent);
console.log("Patched page.tsx padding");

// 2. Patch Module*.tsx Section margins
const componentsDir = path.join(__dirname, 'app', 'system-design', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.startsWith('Module') && f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Change ml-6 to ml-5 (20px, centers with w-10 circle) and pl-4 to pl-2 or pl-3
  content = content.replace(
    /className="mt-4 ml-6 md:ml-16 border-l-2 border-slate-300 dark:border-slate-700 pl-4 md:pl-6"/g,
    'className="mt-3 ml-5 md:ml-16 border-l-2 border-slate-300 dark:border-slate-700 pl-3 md:pl-6"'
  );

  fs.writeFileSync(filePath, content);
  console.log(`Patched ${file} Section margins`);
}
