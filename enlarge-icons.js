const fs = require('fs');

const files = [
  'components/Hero.tsx',
  'components/PackagesGallery.tsx',
  'components/Packages.tsx',
  'components/HowItWorks.tsx',
  'components/ShowcaseGallery.tsx',
  'components/CTAHeroBanner.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Remove span wrapper and enlarge SVG to 16px (w-4 h-4)
  const regexStart = /<span className="flex items-center justify-center w-\[16px\] h-\[16px\] rounded-full bg-\[#111\]\/5\"><svg className="w-3 h-3 text-\[#111\]"/g;
  content = content.replace(regexStart, '<svg className="w-4 h-4 text-[#111]"');
  
  const regexEnd = /<\/svg><\/span>/g;
  content = content.replace(regexEnd, '</svg>');

  // Also adjust stroke width a bit so it's not too thick at 16px
  // Change strokeWidth="2.5" to strokeWidth="2" or "2.25"
  // Let's let it be strokeWidth="2" for a cleaner look at larger sizes
  // But wait, the previous ones have strokeWidth="2.5".
  // content = content.replace(/strokeWidth="2.5"/g, 'strokeWidth="2"'); // Maybe unnecessary, let's keep it 2 for crispness.

  fs.writeFileSync(f, content, 'utf8');
});

console.log('Icons enlarged and background removed successfully');
