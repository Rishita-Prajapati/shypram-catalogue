const fs = require('fs');
const path = require('path');

const categoryMap = {
  'Alluminium Doors and windows gasket': 'alluminium-doors-windows-gasket',
  'Container Gasket': 'container-gasket',
  'Facade Rubber Gasket': 'facade-rubber-gasket',
  'Profiles for Alluminium Doors and Windows': 'profiles-alluminium-doors-windows',
  'Profiles for U_clamp & C_clamp EPDM Rubber & Silicon Rubber': 'profiles-u-clamp-c-clamp',
  'Railing Rubber Gasket': 'railing-rubber-gasket',
  'Sliding and Folding Rubber Gasket': 'sliding-folding-rubber-gasket',
  'UPVC Door and Window Rubber Gasket': 'upvc-door-window-gasket'
};

const productImagesPath = './public/product_images';
const products = [];
let productId = 1;

const categories = fs.readdirSync(productImagesPath);

categories.forEach(categoryFolder => {
  const categoryPath = path.join(productImagesPath, categoryFolder);
  
  if (fs.statSync(categoryPath).isDirectory()) {
    const images = fs.readdirSync(categoryPath).filter(file => 
      file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpg')
    );
    
    images.forEach(imageFile => {
      const productCode = path.parse(imageFile).name;
      const categoryId = categoryMap[categoryFolder];
      
      if (categoryId) {
        const product = {
          id: productId.toString(),
          name: productCode,
          category: categoryId,
          imageUrl: `/product_images/${categoryFolder}/${imageFile}`,
          cuttingQuantity: 0
        };
        
        products.push(product);
        productId++;
      }
    });
  }
});

const outputContent = `import type { Product } from "./types"

export const products: Product[] = ${JSON.stringify(products, null, 2)};`;

fs.writeFileSync('./lib/products-data.ts', outputContent);
console.log(`Generated ${products.length} simplified products`);