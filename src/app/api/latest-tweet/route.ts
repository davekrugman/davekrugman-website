import { NextResponse } from 'next/server';
import fallbackTweet from '@/data/latest-tweet.json';

export const revalidate = 900; // Cache for 15 minutes

export async function GET() {
  const feedUrl = process.env.TWITTER_RSS_URL;

  // Try RSS feed first
  if (feedUrl) {
    try {
      const res = await fetch(feedUrl, {
        next: { revalidate: 900 },
      });

      if (res.ok) {
        const xml = await res.text();

        const itemMatch = xml.match(/<item>([\s\S]*?)<\/item>/);
        if (itemMatch) {
          const item = itemMatch[1];

          const titleMatch =
            item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ||
            item.match(/<title>([\s\S]*?)<\/title>/);
          const text = titleMatch ? titleMatch[1].trim() : null;

          const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
          const url = linkMatch ? linkMatch[1].trim() : null;

          const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
          const date = dateMatch ? dateMatch[1].trim() : null;

          if (text && url) {
            return NextResponse.json({ text, url, date });
          }
        }
      }
    } catch (error) {
      console.error('RSS fetch failed, falling back to JSON:', error);
    }
  }

  // Fall back to manual JSON file
  if (fallbackTweet.text && fallbackTweet.url) {
    return NextResponse.json(fallbackTweet);
  }

  return NextResponse.json({ text: null, url: null, date: null });
}
