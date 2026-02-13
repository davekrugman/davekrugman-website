const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PHOTO_DIR = path.join(process.cwd(), 'public', 'images', 'photography');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'og', 'photography');
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const JPEG_QUALITY = 80;

function stripOrderPrefix(name) {
  return name.replace(/^\d+-/, '');
}

function getGalleries() {
  if (!fs.existsSync(PHOTO_DIR)) return [];

  return fs
    .readdirSync(PHOTO_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((dir) => {
      const dirPath = path.join(PHOTO_DIR, dir.name);
      const files = fs.readdirSync(dirPath).filter((f) => {
        const ext = f.toLowerCase();
        return (
          !f.startsWith('.') &&
          (ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || ext.endsWith('.webp'))
        );
      });

      const thumbnailFile = files.find(
        (f) => f.toLowerCase().replace(/\.[^.]+$/, '') === 'thumbnail'
      );

      if (!thumbnailFile) return null;

      return {
        slug: stripOrderPrefix(dir.name).toLowerCase().replace(/\s+/g, '-'),
        thumbnailPath: path.join(dirPath, thumbnailFile),
      };
    })
    .filter(Boolean);
}

async function generateOGImages() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const galleries = getGalleries();
  console.log(`\nGenerating OG images for ${galleries.length} galleries...\n`);

  for (const gallery of galleries) {
    const outputPath = path.join(OUTPUT_DIR, `${gallery.slug}.jpg`);

    try {
      const meta = await sharp(gallery.thumbnailPath).metadata();

      await sharp(gallery.thumbnailPath)
        .resize(OG_WIDTH, OG_HEIGHT, {
          fit: 'cover',
          position: 'centre',
        })
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toFile(outputPath);

      const stats = fs.statSync(outputPath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      const originalKB = (fs.statSync(gallery.thumbnailPath).size / 1024).toFixed(0);

      console.log(`  ✓ ${gallery.slug}: ${meta.width}x${meta.height} (${originalKB} KB) → 1200x630 (${sizeKB} KB)`);
    } catch (error) {
      console.error(`  ✗ ${gallery.slug}: ${error.message}`);
    }
  }

  console.log('\nDone!\n');
}

generateOGImages().catch(console.error);
