const fs = require('fs');
let content = fs.readFileSync('app/system-design/page.tsx', 'utf8');
content = content.replace(/<SearchCommandPalette onSelect=\{setActiveModule\} \/> bg-[^>]+>/g, '<SearchCommandPalette onSelect={setActiveModule} />');
fs.writeFileSync('app/system-design/page.tsx', content);
