import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTS = [
  'cdninstagram.com',
  'instagram.com',
  'twimg.com',
  'pbs.twimg.com',
];

function isAllowedHost(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return ALLOWED_HOSTS.some((allowed) => host === allowed || host.endsWith('.' + allowed));
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url || !isAllowedHost(url)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)',
      },
    });

    if (!res.ok) {
      return new NextResponse('Image fetch failed', { status: res.status });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch {
    return new NextResponse('Proxy error', { status: 500 });
  }
}
