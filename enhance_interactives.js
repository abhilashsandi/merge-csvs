const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'app', 'system-design', 'components');

// 1. Inject into Module 1 (InteractiveLoadBalancer)
let m1 = fs.readFileSync(path.join(dir, 'Module1.tsx'), 'utf8');
if (!m1.includes('InteractiveLoadBalancer')) {
  m1 = m1.replace(/(import React.*?;\n)/, `$1import InteractiveLoadBalancer from './InteractiveLoadBalancer';\n`);
  
  // Find Scalability section (near vertical/horizontal scaling) to inject it
  const balRegex = /(<h4 className="text-lg font-semibold text-white mb-4">Scaling Strategies<\/h4>[\s\S]*?<\/ul>\n\s*<\/Card>)/;
  m1 = m1.replace(balRegex, `$1\n<InteractiveLoadBalancer />`);
  fs.writeFileSync(path.join(dir, 'Module1.tsx'), m1);
}

// 2. Inject into Module 3 (InteractivePubSub)
let m3 = fs.readFileSync(path.join(dir, 'Module3.tsx'), 'utf8');
if (!m3.includes('InteractivePubSub')) {
  m3 = m3.replace(/(import React.*?;\n)/, `$1import InteractivePubSub from './InteractivePubSub';\n`);
  
  // Find Messaging section
  const msgRegex = /(<p className="text-slate-300 mb-6 leading-relaxed">.*?The caller fires a message into a broker.*?<\/p>)/;
  m3 = m3.replace(msgRegex, `$1\n<InteractivePubSub />`);
  fs.writeFileSync(path.join(dir, 'Module3.tsx'), m3);
}

// 3. Inject into Module 4 (InteractiveChaosMonkey)
let m4 = fs.readFileSync(path.join(dir, 'Module4.tsx'), 'utf8');
if (!m4.includes('InteractiveChaosMonkey')) {
  m4 = m4.replace(/(import React.*?;\n)/, `$1import InteractiveChaosMonkey from './InteractiveChaosMonkey';\n`);
  
  // Find Design Lessons / Cascading Failures section
  const chaosRegex = /(<strong className="text-white">Cascading Failures:<\/strong>.*?<\/li>)/;
  m4 = m4.replace(chaosRegex, `$1\n<li className="mt-8 mb-4 list-none"><InteractiveChaosMonkey /></li>`);
  fs.writeFileSync(path.join(dir, 'Module4.tsx'), m4);
}

console.log('Successfully injected interactive components!');
