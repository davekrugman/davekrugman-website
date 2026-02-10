export interface PressItem {
  label: string;
  url: string;
  featured: boolean;
}

export const pressItems: PressItem[] = [
  // Featured (shown by default)
  { label: 'New York Times', url: 'https://www.nytimes.com/2014/06/18/arts/design/sharing-cultural-jewels-via-instagram.html', featured: true },
  { label: 'Bloomberg', url: 'https://www.bloomberg.com/news/videos/2014-12-30/meet-the-prolific-instagrammer-who-landed-bbdo-job', featured: true },
  { label: 'GQ x Prada', url: 'http://gq.com/pradaaliveinblack/index.html', featured: true },
  { label: 'Four Seasons', url: 'https://www.fourseasons.com/magazine/discover/reconnect-with-the-world-how-travel-can-free-creativity/', featured: true },
  { label: 'Coindesk: Most Influential', url: 'https://www.coindesk.com/consensus-magazine/2022/12/05/dave-krugman-most-influential-2022/', featured: true },
  { label: 'The Art Newspaper', url: 'https://www.theartnewspaper.com/2024/06/24/as-winner-of-renamed-abs-digital-art-prize-is-announced-have-we-reached-a-turning-point-for-conversations-around-nfts-and-culture', featured: true },
  { label: 'SuperRare Magazine', url: 'https://superrare.com/magazine/2021/06/03/neo-noir-new-york-by-dave-krugman/', featured: true },
  { label: 'PROOF Podcast', url: 'https://www.youtube.com/watch?v=PTDNAB0ctQs&ab_channel=PROOF', featured: true },
  { label: 'Decrypt x META', url: 'https://decrypt.co/113395/metas-instagram-plans-nft-minting-trading-tools', featured: true },
  { label: 'Sony Alpha', url: 'https://www.youtube.com/watch?v=t-jRGSXxyko&ab_channel=SonyElectronics', featured: true },

  // All others
  { label: 'Coindesk TV', url: 'https://www.coindesk.com/video/this-nft-success-story-involves-traditional-marketing/', featured: false },
  { label: 'NFT NOW x Meta', url: 'https://nftnow.com/culture/instagram-is-officially-an-nft-marketplace/', featured: false },
  { label: 'White Hot Magazine', url: 'https://whitehotmagazine.com/articles/digital-media-becoming-sovereign-entity/5267', featured: false },
  { label: 'All About Photo', url: 'https://www.all-about-photo.com/photo-articles/photo-article/1147/exclusive-interview-with-dave-krugman', featured: false },
  { label: 'CoinDesk x Instagram', url: 'https://www.coindesk.com/web3/2022/11/02/instagram-users-will-soon-be-able-to-mint-and-sell-nfts/', featured: false },
  { label: 'Phoblographer', url: 'https://www.thephoblographer.com/tag/dave-krugman/', featured: false },
  { label: 'Feature Shoot', url: 'https://www.featureshoot.com/2022/05/how-photographs-of-cars-created-a-web3-community/', featured: false },
  { label: 'Phlearn', url: 'https://phlearn.com/magazine/storytelling-through-candid-street-photography-with-dave-krugman/', featured: false },
  { label: "That's Nifty Podcast", url: 'https://podcasts.apple.com/es/podcast/dave-krugman/id1554794204?i=1000533518300', featured: false },
  { label: 'Yahoo News', url: 'https://www.yahoo.com/now/everything-know-instagram-digital-collectibles-203140114.html', featured: false },
  { label: 'NFT Evening', url: 'https://nftevening.com/miami-art-week-art-basel-heres-what-you-missed/', featured: false },
  { label: 'We Do a Little Pod', url: 'https://www.youtube.com/watch?v=lkpXgRescXU&ab_channel=WeDoALittle', featured: false },
  { label: 'The Aubservation', url: 'https://www.youtube.com/watch?app=desktop&v=H3Z41Ms1oD8&ab_channel=TheAubservation', featured: false },
  { label: 'The Ledge Podcast', url: 'https://open.spotify.com/episode/2k2eSf0hYHOGp6cQAFhFk2', featured: false },
  { label: 'Coindesk x Meta', url: 'https://www.coindesk.com/web3/2023/01/11/top-nft-artists-are-launching-projects-on-instagram-and-selling-out-in-seconds/', featured: false },
  { label: 'Yahoo Finance', url: 'https://www.yahoo.com/lifestyle/moon-labs-announces-opening-nft-074500650.html', featured: false },
  { label: 'NFT NOW Podcast', url: 'https://www.youtube.com/watch?v=g2m3Qv-zAnw&ab_channel=nftnow', featured: false },
  { label: 'Particle Collectors', url: 'https://podcasts.apple.com/us/podcast/dave-krugman/id1712241977?i=1000631555816', featured: false },
  { label: 'Sloika Podcast', url: 'https://open.spotify.com/show/2SZ2Z56tkd0kbhctUw4s5g', featured: false },
  { label: 'Sloika Article', url: 'https://sloika.xyz/blog/dave-krugman-pioneering-creativity-in-web3', featured: false },
  { label: 'Wealth Briefing', url: 'https://www.wealthbriefing.com/html/article.php?id=199910', featured: false },
  { label: 'Archiv3', url: 'https://www.archiv3.xyz/articles/pulling-slices-from-time-with-dave-krugman', featured: false },
  { label: 'NFT NOW: Drive', url: 'https://nftnow.com/features/dave-krugman-drive-lap-2-feature/', featured: false },
  { label: 'The Baer Facts', url: 'https://thebaerfaxt.com/the-baer-faxt-with-dave-krugman/', featured: false },
  { label: 'Mint Gold Dust', url: 'https://mintgolddust.medium.com/capturing-beauty-through-a-unique-lens-an-interview-with-dave-krugman-3c53ecefef58', featured: false },
  { label: 'John Knoph Photo Podcast', url: 'https://podcasts.apple.com/us/podcast/episode-9-dave-krugman/id1835537302?i=1000727259891', featured: false },
  { label: 'ETH Barcelona', url: 'https://www.youtube.com/watch?v=3Ped-EK5oSQ&ab_channel=ETHBarcelona', featured: false },
  { label: 'TIME Pieces', url: 'https://www.youtube.com/watch?v=ignSno-dLKk&ab_channel=TIMEPieces', featured: false },
  { label: 'Avalanche Summit', url: 'https://www.youtube.com/watch?v=loNUVms3sdA&t=778s&ab_channel=Avalanche', featured: false },
];
