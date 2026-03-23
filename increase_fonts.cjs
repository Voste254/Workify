const fs = require('fs');
const path = require('path');

const walk = dir => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
};

const employerDir = 'c:/PROJECTS/REACT/Workify/Frontend/src/Components/Dashboards/Employer';
const employeeDir = 'c:/PROJECTS/REACT/Workify/Frontend/src/Components/Dashboards/Employee';

const files = [...walk(employerDir), ...walk(employeeDir)];

let changedCnt = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let orig = content;

  // 1. Replace inline styles fontSize: number
  // increase by 2
  content = content.replace(/fontSize:\s*(\d+)/g, (match, p1) => {
    return `fontSize: ${parseInt(p1) + 2}`;
  });

  // 2. Replace Tailwind classes
  const tailwindMap = {
    'text-4xl': 'text-5xl',
    'text-3xl': 'text-4xl',
    'text-2xl': 'text-3xl',
    'text-xl': 'text-2xl',
    'text-lg': 'text-xl',
    'text-base': 'text-lg',
    'text-sm': 'text-base',
    'text-xs': 'text-sm'
  };

  content = content.replace(/\b(text-4xl|text-3xl|text-2xl|text-xl|text-lg|text-base|text-sm|text-xs)\b/g, (match) => {
    return tailwindMap[match] || match;
  });

  // 3. Replace text-[XXpx]
  content = content.replace(/text-\[(\d+)px\]/g, (match, p1) => {
    return `text-[${parseInt(p1) + 2}px]`;
  });

  if (orig !== content) {
    fs.writeFileSync(f, content);
    console.log(`Updated: ${f}`);
    changedCnt++;
  }
});

console.log(`Changed ${changedCnt} files.`);
