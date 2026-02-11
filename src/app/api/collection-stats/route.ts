import { NextResponse } from 'next/server';
import { collections } from '@/data/collections';

export const revalidate = 900;

interface OpenSeaStats {
  total: {
    volume: number;
    sales: number;
    average_price: number;
    num_owners: number;
    market_cap: number;
    floor_price: number;
    floor_price_symbol: string;
  };
}

export interface CollectionStatsResponse {
  [collectionId: string]: {
    floor: number;
    volume: number;
    owners: number;
  };
}

export async function GET() {
  const apiKey = process.env.OPENSEA_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  const slugCollections = collections.filter((c) => c.openseaSlug);

  const results: CollectionStatsResponse = {};

  await Promise.all(
    slugCollections.map(async (collection) => {
      try {
        const res = await fetch(
          `https://api.opensea.io/api/v2/collections/${collection.openseaSlug}/stats`,
          {
            headers: { 'x-api-key': apiKey },
            next: { revalidate: 900 },
          },
        );

        if (!res.ok) return;

        const data: OpenSeaStats = await res.json();
        const osVolume = data.total?.volume ?? 0;
        const baseline = collection.primaryBaseline ?? 0;

        results[collection.id] = {
          floor: data.total?.floor_price ?? 0,
          volume: Math.round((baseline + osVolume) * 100) / 100,
          owners: data.total?.num_owners ?? 0,
        };
      } catch {
        // Skip failed collections — card will use static fallback
      }
    }),
  );

  return NextResponse.json(results);
}
