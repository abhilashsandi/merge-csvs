const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, 'app', 'system-design', 'page.tsx');
let content = fs.readFileSync(pageFile, 'utf8');

if (!content.includes('const toggleTheme = () => {')) {
  // Add Sun and Moon imports
  content = content.replace(
    /Server, Layers, Cloud, ShieldAlert, Network, BookOpen/,
    'Server, Layers, Cloud, ShieldAlert, Network, BookOpen, Sun, Moon'
  );

  // Add theme toggle state and function
  const themeLogic = `
  const [activeModule, setActiveModule] = useState(modules[0].id);
  const [isDark, setIsDark] = useState(true);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);
`;
  content = content.replace(/const \[activeModule, setActiveModule\] = useState\(modules\[0\].id\);/, themeLogic);

  // Add toggle button to the header
  const headerSearch = /(<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">)/;
  const toggleButton = `
      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme} 
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-xl hover:scale-110 transition-transform"
        title="Toggle Light/Dark Mode"
      >
        {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      $1`;
  content = content.replace(headerSearch, toggleButton);
  
  fs.writeFileSync(pageFile, content);
  console.log('Injected theme toggle!');
} else {
  console.log('Theme toggle already injected.');
}
