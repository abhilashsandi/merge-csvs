const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'app', 'system-design', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.startsWith('Module') && f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the Card component definition
  // function Card({ children, className = '' }: { children: React.ReactNode; className?: string; }) {
  //   return (
  //     <div className={`rounded-2xl border border-slate-300/60 dark:border-slate-700/60 bg-slate-100/80 dark:bg-slate-800/50 backdrop-blur-sm p-6 shadow-xl ${className}`}>
  
  content = content.replace(
    /backdrop-blur-sm p-6 shadow-xl/g,
    'backdrop-blur-sm p-4 sm:p-6 shadow-xl'
  );

  fs.writeFileSync(filePath, content);
  console.log(`Patched Card padding in ${file}`);
}
