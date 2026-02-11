import { NextResponse } from 'next/server';
import type { SocialPost, SocialFeedResponse } from '@/types/social';
import fallbackData from '@/data/fallback-threads.json';

export const revalidate = 900;

function decodeEntities(str: string): string {
  return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export async function GET() {
  const feedUrl = process.env.THREADS_RSS_URL;

  if (feedUrl) {
    try {
      const res = await fetch(feedUrl, { next: { revalidate: 900 } });

      if (res.ok) {
        const xml = await res.text();
        const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 10);

        if (items.length > 0) {
          const posts: SocialPost[] = items
            .map((match) => {
              const item = match[1];

              const titleMatch =
                item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ||
                item.match(/<title>([\s\S]*?)<\/title>/);
              const titleText = titleMatch ? titleMatch[1].trim() : '';

              const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
              const url = linkMatch ? linkMatch[1].trim() : '';

              const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
              const date = dateMatch ? dateMatch[1].trim() : null;

              const mediaMatch = item.match(/<media:content[^>]+url="([^"]+)"/);
              const enclosureMatch = item.match(/<enclosure[^>]+url="([^"]+)"/);
              const descMatch =
                item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
                item.match(/<description>([\s\S]*?)<\/description>/);
              const rawDesc = descMatch ? descMatch[1].trim() : '';
              const imgMatch = rawDesc.match(/<img[^>]+src="([^"]+)"/);
              const rawImageUrl = mediaMatch?.[1] || enclosureMatch?.[1] || imgMatch?.[1] || undefined;
              const imageUrl = rawImageUrl ? decodeEntities(rawImageUrl) : undefined;

              // Use description text (full) over title (truncated by rss.app)
              const descText = stripHtml(rawDesc);
              const text = descText.length > titleText.length ? descText : titleText;

              return { platform: 'threads' as const, text, url, date, imageUrl };
            })
            .filter((p) => p.text && p.url);

          if (posts.length > 0) {
            return NextResponse.json({ posts } satisfies SocialFeedResponse);
          }
        }
      }
    } catch (error) {
      console.error('Threads RSS fetch failed:', error);
    }
  }

  return NextResponse.json({ posts: fallbackData.posts } as SocialFeedResponse);
}
