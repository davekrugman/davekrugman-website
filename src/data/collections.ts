export interface CollectionStat {
  value: string;
  label: string;
}

export interface CollectionLink {
  label: string;
  url: string;
}

export interface Collection {
  id: string;
  name: string;
  tag: string;
  description: string;
  image: string;
  imageAlt: string;
  stats: CollectionStat[];
  links: CollectionLink[];
}

export const collections: Collection[] = [
  {
    id: 'drip-drop',
    name: 'DRIP DROP',
    tag: '1,011 Works \u00B7 Jun 2022',
    description: 'A cohesive collection of 1,111 1/1 photography NFTs \u2014 an ode to generative art, inspired by Art Blocks. A study of the generative beauty of the universe, viewed through the lens of rain hitting puddles in Times Square.',
    image: '/images/collections/drip-drop-thumb.jpg',
    imageAlt: 'DRIP DROP collection preview',
    stats: [
      { value: '0.0699', label: 'Floor (ETH)' },
      { value: '384.91', label: 'Vol (ETH)' },
      { value: '518', label: 'Owners' },
      { value: 'Transient Labs', label: 'Platform' },
    ],
    links: [
      { label: 'View on OpenSea', url: 'https://opensea.io/collection/drip-drop-by-dave-krugman' },
    ],
  },
  {
    id: 'drive-lap-1',
    name: 'DRIVE // LAP 1',
    tag: '111 Vehicles \u00B7 Sep 2021',
    description: '111 unique vehicles aggregated over a decade of street photography. More than a collection \u2014 an ecosystem of access, a dynamic community game, and an entry ticket to future endeavors.',
    image: '/images/collections/drive-lap1-thumb.jpg',
    imageAlt: 'DRIVE // LAP 1 collection preview',
    stats: [
      { value: '0.25', label: 'Floor (ETH)' },
      { value: '197.90', label: 'Vol (ETH)' },
      { value: '87', label: 'Owners' },
    ],
    links: [
      { label: 'View on OpenSea', url: 'https://opensea.io/collection/drive-dave-krugman' },
    ],
  },
  {
    id: 'drive-lap-2',
    name: 'DRIVE // LAP 2',
    tag: '333 Vehicles \u00B7 Aug 2024',
    description: 'The second season of DRIVE \u2014 an exercise in world building on the blockchain. Featuring a full commercial, billboards, merch, and the spirit of a used car business brought to life on-chain.',
    image: '/images/collections/drive-lap2-thumb.jpg',
    imageAlt: 'DRIVE // LAP 2 collection preview',
    stats: [
      { value: '0.0684', label: 'Floor (ETH)' },
      { value: '1.31', label: 'Vol (ETH)' },
      { value: '102', label: 'Owners' },
    ],
    links: [
      { label: 'View on OpenSea', url: 'https://opensea.io/collection/drive-lap-2' },
    ],
  },
  {
    id: 'nightmoves',
    name: 'NIGHTMOVES',
    tag: '10 Works \u00B7 Aug 2025',
    description: 'Nocturnal explorations of the city \u2014 where darkness reveals a different kind of light. A study in urban nightscapes and the energy that emerges after sundown.',
    image: '/images/collections/NIGHTMOVES_SELECTS_BLACK.jpg',
    imageAlt: 'NIGHTMOVES collection preview',
    stats: [
      { value: '10', label: 'Works' },
      { value: '9', label: 'Owners' },
      { value: '90%', label: 'Unique' },
      { value: 'Transient Labs', label: 'Platform' },
    ],
    links: [
      { label: 'View on OpenSea', url: 'https://opensea.io/collection/nightmoves' },
    ],
  },
  {
    id: 'editioned-work',
    name: 'EDITIONED WORK',
    tag: '9 Unique \u00B7 264 Editions \u00B7 Jan 2023',
    description: 'A curated selection of editioned photography \u2014 accessible entry points into the broader ecosystem of on-chain work.',
    image: '/images/collections/editioned-work-thumb.jpg',
    imageAlt: 'EDITIONED WORK collection preview',
    stats: [
      { value: '0.127', label: 'Floor (ETH)' },
      { value: '6.16', label: 'Vol (ETH)' },
      { value: '164', label: 'Owners' },
    ],
    links: [
      { label: 'View on OpenSea', url: 'https://opensea.io/collection/dave-krugman-editions' },
    ],
  },
  {
    id: 'rolls',
    name: 'ROLLS',
    tag: 'Film \u00D7 Blockchain \u00B7 Aug 2023',
    description: 'Exploring parallels between film photography and blockchain \u2014 both act as time chains with proof of work mechanisms. Tokens are sold before capture, then \u201Cdevelop\u201D with high-res Mamiya 7ii film scans.',
    image: '/images/collections/rolls-thumb.jpg',
    imageAlt: 'ROLLS collection preview',
    stats: [
      { value: '10', label: 'Works' },
      { value: '10', label: 'Owners' },
      { value: '100%', label: 'Unique' },
      { value: 'Transient Labs', label: 'Platform' },
    ],
    links: [
      { label: 'View on OpenSea', url: 'https://opensea.io/collection/rolls-dave-krugman' },
    ],
  },
  {
    id: 'specters',
    name: 'SPECTERS',
    tag: 'Editions',
    description: 'Spectral figures and ghostly presences captured in the urban landscape \u2014 exploring the ephemeral traces people leave as they move through the city.',
    image: '/images/collections/specters-thumb.jpg',
    imageAlt: 'SPECTERS collection preview',
    stats: [
      { value: 'ETH', label: 'Chain' },
      { value: 'OpenSea', label: 'Platform' },
    ],
    links: [
      { label: 'View on OpenSea', url: 'https://opensea.io/collection/dave-krugman' },
    ],
  },
  {
    id: 'chiaroscuro',
    name: 'CHIAROSCURO',
    tag: 'Editions',
    description: 'Named for the Renaissance technique of bold contrasts between light and dark \u2014 photography that embraces dramatic illumination and deep shadow as its primary language.',
    image: '/images/collections/chiaroscuro-thumb.jpg',
    imageAlt: 'CHIAROSCURO collection preview',
    stats: [
      { value: 'ETH', label: 'Chain' },
      { value: 'OpenSea', label: 'Platform' },
    ],
    links: [
      { label: 'View on OpenSea', url: 'https://opensea.io/collection/chiaroscuro-by-dave-krugman' },
    ],
  },
  {
    id: 'superrare',
    name: 'SuperRare',
    tag: '1/1 Works',
    description: 'Original 1/1 works on SuperRare \u2014 including the Neo Noir: New York series. A decade of candid street photography exploring the illuminated structure of the city. 80% of proceeds support ALLSHIPS.',
    image: '/images/collections/superrare-thumb.jpg',
    imageAlt: 'SuperRare collection preview',
    stats: [
      { value: '1/1', label: 'Originals' },
      { value: 'SuperRare', label: 'Platform' },
    ],
    links: [
      { label: 'View on SuperRare', url: 'https://superrare.com/davekrugman' },
    ],
  },
];

export const cryptoStats = [
  { value: '590+', label: 'Total Volume (ETH)' },
  { value: '9', label: 'Collections' },
  { value: '1,800+', label: 'Works On-Chain' },
  { value: '900+', label: 'Unique Owners' },
];
