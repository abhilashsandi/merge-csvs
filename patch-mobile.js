const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, 'app', 'system-design', 'page.tsx');
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Fix header size
content = content.replace(
  'text-5xl md:text-7xl font-extrabold',
  'text-4xl sm:text-5xl md:text-7xl font-extrabold'
);
content = content.replace(
  'pt-20 pb-12 px-6 text-center max-w-4xl mx-auto',
  'pt-16 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 text-center max-w-4xl mx-auto'
);

// 2. Fix sidebar for mobile (horizontal scroll)
content = content.replace(
  '<div className="sticky top-8 space-y-3">',
  '<div className="sticky top-2 z-40 bg-slate-50/95 dark:bg-[#0a0f1c]/95 backdrop-blur-xl pb-4 lg:bg-transparent lg:dark:bg-transparent lg:pb-0 pt-2 lg:pt-8 -mx-4 px-4 lg:mx-0 lg:px-0 rounded-b-xl lg:rounded-none shadow-sm lg:shadow-none">\n              <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 lg:mb-6 ml-2 hidden lg:block">Modules</h3>\n              <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible snap-x pb-2 slick-scrollbar">'
);
// Make sure to close the new div: Find `</button>\n              ))}\n            </div>` and replace it
content = content.replace(
  '</button>\n              ))}\n            </div>\n          </div>',
  '</button>\n              ))}\n              </div>\n            </div>\n          </div>'
);

// Modify the button itself to work in horizontal scroll
content = content.replace(
  /className=\{`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-4 group \$\{/g,
  "className={`min-w-[260px] lg:min-w-0 w-full text-left p-3 lg:p-4 rounded-2xl transition-all flex items-center gap-3 lg:gap-4 group snap-center ${"
);

// 3. Fix main content paddings
content = content.replace(
  /className="bg-white dark:bg-\[#111827\] border border-slate-200 dark:border-slate-800\/80 rounded-3xl overflow-hidden shadow-2xl"/g,
  'className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl lg:shadow-2xl"'
);
content = content.replace(
  /className=\{`px-8 md:px-12 py-12 bg-gradient-to-br \$\{modules\[activeModule\]\.gradient\} border-b \$\{modules\[activeModule\]\.border\}`\}/g,
  'className={`px-5 sm:px-8 md:px-12 py-8 sm:py-12 bg-gradient-to-br ${modules[activeModule].gradient} border-b ${modules[activeModule].border}`}'
);
content = content.replace(
  'text-4xl md:text-5xl font-extrabold',
  'text-3xl sm:text-4xl md:text-5xl font-extrabold'
);
content = content.replace(
  'className="p-8 md:p-12"',
  'className="p-4 sm:p-8 md:p-12"'
);

// 4. Fix Theme toggle position
content = content.replace(
  'className="fixed top-6 right-6 z-50 p-3 rounded-full',
  'className="fixed top-3 right-3 sm:top-6 sm:right-6 z-50 p-2 sm:p-3 rounded-full scale-90 sm:scale-100'
);

fs.writeFileSync(pageFile, content);
console.log("Patched page.tsx for mobile");

// 5. Fix Search Palette position
const searchFile = path.join(__dirname, 'app', 'system-design', 'components', 'SearchCommandPalette.tsx');
let searchContent = fs.readFileSync(searchFile, 'utf8');
searchContent = searchContent.replace(
  'className="fixed top-6 right-20 z-50 p-3 rounded-full',
  'className="fixed top-3 right-14 sm:top-6 sm:right-20 z-50 p-2 sm:p-3 rounded-full scale-90 sm:scale-100'
);
fs.writeFileSync(searchFile, searchContent);
console.log("Patched SearchCommandPalette.tsx for mobile");

