const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'app', 'system-design', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.startsWith('Module') && f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // We are targeting the line:
  // <div className="mt-3 ml-5 md:ml-16 border-l-2 border-slate-300 dark:border-slate-700 pl-3 md:pl-6">
  // or similar.
  // Let's use regex to catch variations and replace with no border/margin on mobile.
  
  content = content.replace(
    /className="mt-3 ml-5 md:ml-16 border-l-2 border-slate-300 dark:border-slate-700 pl-3 md:pl-6"/g,
    'className="mt-4 ml-0 md:ml-16 border-l-0 md:border-l-2 border-slate-300 dark:border-slate-700 pl-0 md:pl-6"'
  );
  
  // Just in case it's mt-4 or mt-2
  content = content.replace(
    /className="mt-\d+ ml-\d+ md:ml-16 border-l-2 border-slate-300 dark:border-slate-700 pl-\d+ md:pl-6"/g,
    'className="mt-4 ml-0 md:ml-16 border-l-0 md:border-l-2 border-slate-300 dark:border-slate-700 pl-0 md:pl-6"'
  );

  fs.writeFileSync(filePath, content);
  console.log(`Patched timeline space in ${file}`);
}
