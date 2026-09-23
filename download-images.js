const fs = require('fs');
const path = require('path');
const https = require('https');

const downloads = [
  { url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800', file: 'public/images/hero/tile-holders.jpg' },
  { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800', file: 'public/images/hero/tile-women.jpg' },
  { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800', file: 'public/images/hero/tile-bathroom.jpg' },
  { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800', file: 'public/images/hero/tile-kitchen.jpg' },
  
  { url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800', file: 'public/images/categories/holders.jpg' },
  { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800', file: 'public/images/categories/women-accessories.jpg' },
  { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800', file: 'public/images/categories/bathroom.jpg' },
  { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800', file: 'public/images/categories/kitchen.jpg' },
  { url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800', file: 'public/images/categories/tissue-boxes.jpg' },
  { url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800', file: 'public/images/categories/decor.jpg' },

  { url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800', file: 'public/images/products/holders-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800', file: 'public/images/products/holders-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800', file: 'public/images/products/women-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800', file: 'public/images/products/women-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800', file: 'public/images/products/bathroom-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800', file: 'public/images/products/bathroom-3.jpg' },
  { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800', file: 'public/images/products/kitchen-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=800', file: 'public/images/products/kitchen-3.jpg' }
];

downloads.forEach(({ url, file }) => {
  const dest = path.join(process.cwd(), file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const fileStream = fs.createWriteStream(dest);
  
  https.get(url, (response) => {
    response.pipe(fileStream);
    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`✅ تم تحميل: ${file}`);
    });
  }).on('error', (err) => {
    console.error(`❌ خطأ في تحميل ${file}:`, err.message);
  });
});