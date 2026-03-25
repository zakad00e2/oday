const fs = require('fs');
const file = 'components/PackagesGallery.tsx';
let content = fs.readFileSync(file, 'utf8');

// The original class was "text-[#6B7280] text-base md:text-lg max-w-2xl mx-auto"
// We'll change it to  "text-[#6B7280] text-sm md:text-base max-w-2xl mx-auto leading-relaxed" to make it slightly smaller and more readable.

content = content.replace('text-[#6B7280] text-base md:text-lg max-w-2xl mx-auto', 'text-[#6B7280] text-sm md:text-base max-w-2xl mx-auto leading-relaxed');

fs.writeFileSync(file, content, 'utf8');
console.log('Replaced successfully');
