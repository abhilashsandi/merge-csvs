const fs = require('fs');
let content = fs.readFileSync('app/system-design/components/Quiz.tsx', 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');
fs.writeFileSync('app/system-design/components/Quiz.tsx', content);
console.log("Fixed Quiz.tsx escapes");
