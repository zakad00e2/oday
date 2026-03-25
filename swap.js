const fs = require('fs');

function swapInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // We are looking for this block:
  // <div className="inline-flex ... mb-6"> (or mb-2, etc.)
  //   <span className="flex items-center ..."> <svg>...</svg> </span>
  //   <span className="text-xs font-medium text-[#111]">{...}</span>
  // </div>

  const regex = /(<div className="inline-flex[^>]*?bg-white border border-\[#E5E7EB\] rounded-full[^>]*?>\s*)(<span className="flex items-center justify-center[^>]*?>[\s\S]*?<\/span>\s*)(<span className="text-xs font-medium text-\[#111\]">[\s\S]*?<\/span>\s*)(<\/div>)/g;

  content = content.replace(regex, (match, divOpen, iconSpan, textSpan, divClose) => {
    return divOpen + textSpan + iconSpan + divClose;
  });

  fs.writeFileSync(filePath, content, 'utf8');
}

const files = [
  'components/Hero.tsx',
  'components/PackagesGallery.tsx',
  'components/Packages.tsx',
  'components/HowItWorks.tsx',
  'components/ShowcaseGallery.tsx',
  'components/CTAHeroBanner.tsx'
];

files.forEach(swapInFile);
console.log('Swapped successfully');
