import Link from 'next/link'
import { client } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'
import GalleryViewer from '@/components/GalleryViewer'

async function getGallery(slug) {
  const query = `*[_type == "gallery" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    introText,
    outroText,
    images[] {
      _key,
      asset,
      caption
    }
  }`
  
  try {
    const gallery = await client.fetch(query, { slug })
    return gallery
  } catch (error) {
    return null
  }
}

export default async function GalleryPage({ params }) {
  const { slug } = await params
  const gallery = await getGallery(slug)

  if (!gallery) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-mono px-[5%] py-12">
        <Link href="/work" className="text-sm text-[#666] hover:text-white mb-8 inline-block">
          &lt;-- back
        </Link>
        <p className="text-white">Gallery not found.</p>
      </main>
    )
  }

  const images = gallery.images?.map(img => ({
    url: urlFor(img.asset).width(1400).quality(85).url(),
    caption: img.caption,
    key: img._key
  })) || []

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-mono">
      <div className="px-[5%] py-8">
        <Link href="/work" className="text-sm text-[#666] hover:text-white mb-6 inline-block">
          &lt;-- back
        </Link>
        
        <h1 className="text-2xl font-normal text-white mb-6">{gallery.title}</h1>
        
        {gallery.introText && (
          <p className="text-[#e0e0e0] text-sm font-light leading-relaxed mb-8">{gallery.introText}</p>
        )}
      </div>

      <GalleryViewer images={images} />

      {gallery.outroText && (
        <div className="px-[5%] py-8">
          <p className="text-[#e0e0e0] text-sm font-light leading-relaxed">{gallery.outroText}</p>
        </div>
      )}

      <div className="px-[5%] py-8">
        <Link href="/work" className="text-sm text-[#666] hover:text-white">
          &lt;-- back
        </Link>
      </div>
    </main>
  )
}