export type SocialPlatform = 'twitter' | 'substack' | 'instagram' | 'threads';

export interface SocialPost {
  platform: SocialPlatform;
  text: string;
  url: string;
  date: string | null;
  description?: string;
  imageUrl?: string;
}

export interface SocialFeedResponse {
  posts: SocialPost[];
  error?: string;
}
