import { NextResponse } from 'next/server';
import type { SocialPost, SocialFeedResponse } from '@/types/social';
import fallbackData from '@/data/fallback-substack.json';

export const revalidate = 900;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').trim();
}

export async function GET() {
  const feedUrl = process.env.SUBSTACK_RSS_URL;

  if (feedUrl) {
    try {
      const res = await fetch(feedUrl, { next: { revalidate: 900 } });

      if (res.ok) {
        const xml = await res.text();
        const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 20);

        if (items.length > 0) {
          const posts: SocialPost[] = items
            .map((match) => {
              const item = match[1];

              const titleMatch =
                item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ||
                item.match(/<title>([\s\S]*?)<\/title>/);
              const text = titleMatch ? titleMatch[1].trim() : '';

              const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
              const url = linkMatch ? linkMatch[1].trim() : '';

              const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
              const date = dateMatch ? dateMatch[1].trim() : null;

              const descMatch =
                item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
                item.match(/<description>([\s\S]*?)<\/description>/);
              const rawDesc = descMatch ? descMatch[1].trim() : '';
              const description = stripHtml(rawDesc).slice(0, 400);

              const enclosureMatch = item.match(/<enclosure[^>]+url="([^"]+)"/);
              const mediaMatch = item.match(/<media:content[^>]+url="([^"]+)"/);
              const imgMatch = rawDesc.match(/<img[^>]+src="([^"]+)"/);
              const imageUrl = enclosureMatch?.[1] || mediaMatch?.[1] || imgMatch?.[1] || undefined;

              // Reading time from content:encoded
              const contentMatch =
                item.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/) ||
                item.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/);
              const wordCount = contentMatch ? stripHtml(contentMatch[1]).split(/\s+/).filter(Boolean).length : 0;
              const readingTime = Math.max(1, Math.ceil(wordCount / 200));

              return { platform: 'substack' as const, text, url, date, description, imageUrl, readingTime };
            })
            .filter((p) => p.text && p.url);

          if (posts.length > 0) {
            return NextResponse.json({ posts } satisfies SocialFeedResponse);
          }
        }
      }
    } catch (error) {
      console.error('Substack RSS fetch failed:', error);
    }
  }

  return NextResponse.json({ posts: fallbackData.posts } as SocialFeedResponse);
}
