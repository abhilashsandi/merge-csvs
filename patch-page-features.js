const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, 'app', 'system-design', 'page.tsx');
let content = fs.readFileSync(pageFile, 'utf8');

// Imports
if (!content.includes('SearchCommandPalette')) {
  content = content.replace(
    "import Module5 from './components/Module5';",
    `import Module5 from './components/Module5';\nimport SearchCommandPalette from './components/SearchCommandPalette';\nimport TableOfContents from './components/TableOfContents';\nimport { useProgress } from './components/useProgress';\nimport ArchitectureSandbox from './components/ArchitectureSandbox';`
  );
}

// Hook setup
if (!content.includes('const { progress')) {
  content = content.replace(
    'const [isDark, setIsDark] = useState(true);',
    'const [isDark, setIsDark] = useState(true);\n  const { progress } = useProgress();'
  );
}

// Progress Bar & Search Palette rendering
if (!content.includes('SearchCommandPalette onSelect')) {
  content = content.replace(
    '<div className="min-h-screen',
    `<div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] text-slate-900 dark:text-slate-50 font-sans selection:bg-blue-500/30 pb-20 transition-colors duration-300">
      
      {/* Global Progress Bar */}
      <div className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 z-50 transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: \`\${(progress.completedModules.length / modules.length) * 100}%\` }} />

      <SearchCommandPalette onSelect={setActiveModule} />`
  );
  // Need to remove the old <div className="min-h-screen...> to avoid duplicate
  content = content.replace(
    /<div className="min-h-screen bg-slate-50 dark:bg-\[#0a0f1c\][^>]+>\s*<div className="min-h-screen bg-slate-50 dark:bg-\[#0a0f1c\][^>]+>/,
    `<div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] text-slate-900 dark:text-slate-50 font-sans selection:bg-blue-500/30 pb-20 transition-colors duration-300">`
  );
}

// Add Sandbox Tab to modules array manually
if (!content.includes('id: "module-6"')) {
  content = content.replace(
    'Component: Module5\n  }',
    `Component: Module5\n  },\n  {\n    id: "module-6",\n    title: "Interactive Sandbox",\n    description: "Put your knowledge to the test. Build and scale an architecture to survive massive traffic spikes.",\n    icon: <Globe className="w-6 h-6 text-indigo-400" />,\n    gradient: "from-indigo-100 dark:from-indigo-900/40 to-blue-100 dark:to-blue-900/20",\n    border: "border-indigo-200 dark:border-indigo-500/30",\n    Component: ArchitectureSandbox\n  }`
  );
  // Need to import Globe
  if (!content.includes('Globe')) {
    content = content.replace('Sun, Moon', 'Sun, Moon, Globe, CheckCircle2');
  }
}

// Sidebar logic: add CheckCircle2 for completed modules
content = content.replace(
  '<div>\n                    <div className="text-xs',
  `<div className="flex-1">\n                    <div className="text-xs`
);

if (!content.includes('progress.completedModules.includes(mod.id)')) {
  content = content.replace(
    '</button>\n              ))}',
    `{progress.completedModules.includes(mod.id) && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />}\n                </button>\n              ))}`
  );
}

// Table Of Contents logic: Wrap right side in flex container
if (!content.includes('<TableOfContents')) {
  content = content.replace(
    /className="p-8 md:p-12">\s*\{React\.createElement\(modules\[activeModule\]\.Component\)\}\s*<\/div>/,
    `className="p-8 md:p-12">
                  <div className="flex items-start">
                    <div className="flex-1 min-w-0">
                      {React.createElement(modules[activeModule].Component)}
                    </div>
                    {/* Only show TOC for actual modules, not sandbox */}
                    {activeModule < 5 && <TableOfContents moduleIdx={activeModule} />}
                  </div>
                </div>`
  );
}

fs.writeFileSync(pageFile, content);
console.log("Patched page.tsx with all features");
