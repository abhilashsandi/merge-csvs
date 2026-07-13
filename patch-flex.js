const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'app', 'system-design', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.startsWith('Module') && f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add flex-wrap and shrink-0 to card headers
  content = content.replace(
    /className="flex items-center gap-3 mb-4"/g,
    'className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4"'
  );
  content = content.replace(
    /className="flex items-center gap-2 mb-2"/g,
    'className="flex flex-wrap items-center gap-2 mb-2"'
  );
  content = content.replace(
    /className="w-8 h-8 text-([^"]+)"/g,
    'className="w-8 h-8 text-$1 shrink-0"'
  );

  fs.writeFileSync(filePath, content);
  console.log(`Patched ${file}`);
}
