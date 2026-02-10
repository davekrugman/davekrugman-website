import fs from 'fs';
import path from 'path';

export interface PhotoProject {
  slug: string;
  title: string;
  thumbnail: string;
  images: string[];
  imageCount: number;
}

const PHOTO_DIR = path.join(process.cwd(), 'public', 'images', 'photography');

function stripOrderPrefix(name: string): string {
  return name.replace(/^\d+-/, '');
}

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getProjects(): PhotoProject[] {
  if (!fs.existsSync(PHOTO_DIR)) return [];

  const entries = fs.readdirSync(PHOTO_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((dir) => {
      const dirPath = path.join(PHOTO_DIR, dir.name);
      const files = fs.readdirSync(dirPath).filter((f) => {
        const ext = f.toLowerCase();
        return (
          !f.startsWith('.') &&
          (ext.endsWith('.jpg') ||
            ext.endsWith('.jpeg') ||
            ext.endsWith('.png') ||
            ext.endsWith('.webp'))
        );
      });

      const thumbnailFile = files.find(
        (f) => f.toLowerCase().replace(/\.[^.]+$/, '') === 'thumbnail'
      );

      const galleryImages = files
        .filter((f) => f.toLowerCase().replace(/\.[^.]+$/, '') !== 'thumbnail')
        .sort()
        .map((f) => `/images/photography/${dir.name}/${f}`);

      return {
        slug: stripOrderPrefix(dir.name).toLowerCase().replace(/\s+/g, '-'),
        title: slugToTitle(stripOrderPrefix(dir.name).toLowerCase().replace(/\s+/g, '-')),
        thumbnail: thumbnailFile
          ? `/images/photography/${dir.name}/${thumbnailFile}`
          : galleryImages[0] || '',
        images: galleryImages,
        imageCount: galleryImages.length,
      };
    })
    .filter((p) => p.thumbnail)
;
}

export function getProject(slug: string): PhotoProject | undefined {
  return getProjects().find((p) => p.slug === slug);
}
