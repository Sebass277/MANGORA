import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './public/monster-ultra-white/textures';

async function processImages() {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
  
  for (const file of files) {
    const inputPath = path.join(dir, file);
    const outputPath = path.join(dir, file.replace('.png', '.webp'));
    
    console.log(`Compressing ${file}...`);
    await sharp(inputPath)
      .webp({ quality: 75 })
      .toFile(outputPath);
      
    console.log(`Saved ${outputPath}`);
  }
}

processImages().catch(console.error);
