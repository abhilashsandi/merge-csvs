const fs = require('fs');
const path = require('path');

const sandboxFile = path.join(__dirname, 'app', 'system-design', 'components', 'ArchitectureSandbox.tsx');
let content = fs.readFileSync(sandboxFile, 'utf8');

// The canvas
content = content.replace(
  /mt-20 h-64 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl relative flex items-center justify-around p-4/g,
  "mt-20 h-auto sm:h-64 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl relative flex flex-col sm:flex-row items-center justify-around p-4 sm:p-4 gap-4 sm:gap-0"
);

// The drop zones
content = content.replace(
  /w-32 h-32 rounded-xl/g,
  "w-24 h-24 sm:w-32 sm:h-32 rounded-xl"
);

// The dock wrapper
content = content.replace(
  /mt-8 bg-slate-200 dark:bg-slate-800 p-4 rounded-2xl flex justify-center gap-6/g,
  "mt-8 bg-slate-200 dark:bg-slate-800 p-4 rounded-2xl flex flex-wrap justify-center gap-4 sm:gap-6"
);

// The draggable items
content = content.replace(
  /w-32 h-32 bg-white/g,
  "w-24 h-24 sm:w-32 sm:h-32 bg-white"
);

// Arrows
content = content.replace(
  /ArrowRight className="text-slate-400 animate-pulse"/g,
  'ArrowRight className="text-slate-400 animate-pulse rotate-90 sm:rotate-0"'
);

// Icons inside draggable items
content = content.replace(
  /w-12 h-12 text-/g,
  "w-8 h-8 sm:w-12 sm:h-12 text-"
);

// Text inside draggable items
content = content.replace(
  /<span className="font-bold text-slate-700 dark:text-slate-200 pointer-events-none">/g,
  '<span className="text-xs sm:text-base font-bold text-slate-700 dark:text-slate-200 pointer-events-none text-center">'
);

fs.writeFileSync(sandboxFile, content);
console.log("Patched ArchitectureSandbox.tsx for mobile");
