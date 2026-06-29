const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, 'app', 'system-design', 'page.tsx');
let content = fs.readFileSync(pageFile, 'utf8');

// Sidebar buttons
content = content.replace(
  /'hover:bg-slate-800\/50 border border-transparent'/g,
  "'hover:bg-slate-200 dark:hover:bg-slate-800/50 border border-transparent'"
);
content = content.replace(
  /'bg-slate-900 group-hover:bg-slate-800'/g,
  "'bg-slate-100 dark:bg-slate-900 group-hover:bg-slate-200 dark:group-hover:bg-slate-800'"
);
content = content.replace(
  /'text-white' : 'text-slate-300'/g,
  "'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-300'"
);

// Main content container
content = content.replace(
  /bg-\[#111827\] border border-slate-800\/80/g,
  "bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80"
);

// Gradients for light mode
// Currently: from-blue-900/40 to-cyan-900/20
// Let's add light versions directly to the definitions
content = content.replace(
  /gradient: "from-blue-900\/40 to-cyan-900\/20"/g,
  'gradient: "from-blue-100 dark:from-blue-900/40 to-cyan-100 dark:to-cyan-900/20"'
);
content = content.replace(
  /border: "border-blue-500\/30"/g,
  'border: "border-blue-200 dark:border-blue-500/30"'
);

content = content.replace(
  /gradient: "from-purple-900\/40 to-pink-900\/20"/g,
  'gradient: "from-purple-100 dark:from-purple-900/40 to-pink-100 dark:to-pink-900/20"'
);
content = content.replace(
  /border: "border-purple-500\/30"/g,
  'border: "border-purple-200 dark:border-purple-500/30"'
);

content = content.replace(
  /gradient: "from-emerald-900\/40 to-teal-900\/20"/g,
  'gradient: "from-emerald-100 dark:from-emerald-900/40 to-teal-100 dark:to-teal-900/20"'
);
content = content.replace(
  /border: "border-emerald-500\/30"/g,
  'border: "border-emerald-200 dark:border-emerald-500/30"'
);

content = content.replace(
  /gradient: "from-orange-900\/40 to-amber-900\/20"/g,
  'gradient: "from-orange-100 dark:from-orange-900/40 to-amber-100 dark:to-amber-900/20"'
);
content = content.replace(
  /border: "border-orange-500\/30"/g,
  'border: "border-orange-200 dark:border-orange-500/30"'
);

content = content.replace(
  /gradient: "from-amber-900\/40 to-yellow-900\/20"/g,
  'gradient: "from-amber-100 dark:from-amber-900/40 to-yellow-100 dark:to-yellow-900/20"'
);
content = content.replace(
  /border: "border-amber-500\/30"/g,
  'border: "border-amber-200 dark:border-amber-500/30"'
);

// Module Headers Text Color (if gradient is light, text must be dark)
content = content.replace(
  /text-white\/70 font-medium/g,
  "text-slate-600 dark:text-white/70 font-medium"
);
content = content.replace(
  /text-4xl md:text-5xl font-extrabold text-white mb-6/g,
  "text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6"
);
content = content.replace(
  /text-xl text-white\/80 max-w-3xl leading-relaxed/g,
  "text-xl text-slate-700 dark:text-white/80 max-w-3xl leading-relaxed"
);

// Header section at top
content = content.replace(
  /text-slate-400 leading-relaxed/g,
  "text-slate-600 dark:text-slate-400 leading-relaxed"
);


fs.writeFileSync(pageFile, content);
console.log("Patched inner containers in page.tsx");
