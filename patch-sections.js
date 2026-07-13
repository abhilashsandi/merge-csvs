const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'app', 'system-design', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.startsWith('Module') && f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix the Section component padding and margins
  content = content.replace(
    /className="mt-2 ml-16 border-l-2 border-slate-300 dark:border-slate-700 pl-6"/g,
    'className="mt-4 ml-6 md:ml-16 border-l-2 border-slate-300 dark:border-slate-700 pl-4 md:pl-6"'
  );

  // Fix the button header layout to prevent squeezing on mobile
  content = content.replace(
    /className="w-full flex items-center gap-4 group cursor-pointer"/g,
    'className="w-full flex items-start sm:items-center gap-3 sm:gap-4 group cursor-pointer"'
  );
  
  // Make the number circle shrink-0
  content = content.replace(
    /className="flex items-center justify-center w-12 h-12/g,
    'className="flex shrink-0 items-center justify-center w-10 h-10 sm:w-12 sm:h-12'
  );

  // Text sizing for the section title
  content = content.replace(
    /className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors flex-1 text-left"/g,
    'className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors flex-1 text-left mt-1 sm:mt-0"'
  );

  fs.writeFileSync(filePath, content);
  console.log(`Patched ${file}`);
}
