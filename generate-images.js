const fs = require('fs');
const path = require('path');

const dirs = [
  'public/images/hero',
  'public/images/products',
  'public/images/categories'
];

// 1×1 transparent PNG buffer
const dummyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

const files = [
  'public/images/hero/tile-women.jpg',
  'public/images/hero/tile-holders.jpg',
  'public/images/hero/tile-bathroom.jpg',
  'public/images/hero/tile-kitchen.jpg',
  'public/images/categories/holders.jpg',
  'public/images/categories/women-accessories.jpg',
  'public/images/categories/bathroom.jpg',
  'public/images/categories/kitchen.jpg',
  'public/images/categories/tissue-boxes.jpg',
  'public/images/categories/decor.jpg',
  'public/images/products/holders-1.jpg',
  'public/images/products/holders-2.jpg',
  'public/images/products/women-1.jpg',
  'public/images/products/women-2.jpg',
  'public/images/products/bathroom-1.jpg',
  'public/images/products/bathroom-3.jpg',
  'public/images/products/kitchen-1.jpg',
  'public/images/products/kitchen-3.jpg'
];

// Create Directories
dirs.forEach(dir => {
  fs.mkdirSync(path.join(process.cwd(), dir), { recursive: true });
});

// Create Dummy Files
files.forEach(file => {
  fs.writeFileSync(path.join(process.cwd(), file), dummyPng);
});

console.log('✅ تم إنشاء كل الصور بنجاح داخل مجلد public!');