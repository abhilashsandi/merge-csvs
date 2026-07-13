const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'app', 'system-design', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.startsWith('Module') && f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // We want to replace `<svg viewBox="0 0 W H" className="...`
  // with `<div className="w-full overflow-x-auto slick-scrollbar pb-2"><svg viewBox="..." className="... min-w-[Wpx] lg:min-w-0"`
  
  // We can do this with a replace function
  content = content.replace(/<svg viewBox="0 0 (\d+) (\d+)" className="([^"]+)"([\s\S]*?)<\/svg>/g, (match, w, h, classNames, rest) => {
    // If it's already wrapped or processed, skip or be careful.
    // Actually, running it once is fine.
    
    // Determine a safe min-width. If width > 500, use it. If it's 300, 300 is fine.
    // Let's cap the min-width to its viewBox width.
    const minWidth = parseInt(w, 10);
    // Add min-w to the classes if not already there
    let newClassNames = classNames;
    if (!newClassNames.includes('min-w-')) {
       // Only add min-w if it's a large diagram
       if (minWidth > 400) {
         newClassNames += ` min-w-[${Math.min(minWidth, 800)}px] lg:min-w-0`;
       } else {
         newClassNames += ` min-w-[${minWidth}px] lg:min-w-0`;
       }
    }

    return `<div className="w-full overflow-x-auto slick-scrollbar pb-2 -mx-2 px-2 sm:mx-0 sm:px-0">\n<svg viewBox="0 0 ${w} ${h}" className="${newClassNames}"${rest}</svg>\n</div>`;
  });

  fs.writeFileSync(filePath, content);
  console.log(`Patched SVGs in ${file}`);
}
