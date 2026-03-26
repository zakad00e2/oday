const fs = require('fs');
const file = 'app/[lang]/checkout/page.tsx';
const content = fs.readFileSync(file, 'utf8');
const newBlock = fs.readFileSync('block.txt', 'utf8') + '\n';

const startBlock = '<div className=\"mt-8 rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] p-5 md:p-6\">';
const endBlock = '<button';

const startIdx = content.indexOf(startBlock);
const endIdx = content.indexOf(endBlock, startIdx);

const startPart = content.substring(0, startIdx);
const endPart = content.substring(endIdx);

fs.writeFileSync(file, startPart + newBlock + "                        " + endPart);
console.log('done');
