import Link from 'next/link'
import { client } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'

async function getGalleries() {
  const query = `*[_type == "gallery"] | order(order asc) {
    _id,
    title,
    slug,
    coverImage,
    description
  }`
  
  try {
    const galleries = await client.fetch(query)
    return galleries
  } catch (error) {
    return []
  }
}

export default async function Work() {
  const galleries = await getGalleries()

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-mono px-8 py-12">
      <div className="max-w-[700px] mx-auto w-full">
        <Link href="/" className="text-sm text-[#666] hover:text-white mb-8 inline-block">
          &lt;-- back
        </Link>
        
        <h1 className="text-2xl font-normal text-white mb-8">WORK</h1>

        {galleries.length === 0 ? (
          <p className="text-[#666] text-sm">No galleries yet.</p>
        ) : (
          <div className="space-y-8">
            {galleries.map((gallery) => (
              <Link 
                key={gallery._id} 
                href={`/work/${gallery.slug.current}`}
                className="block group"
              >
                {gallery.coverImage && (
                  <div className="mb-3 overflow-hidden">
                    <img 
                      src={urlFor(gallery.coverImage).width(700).quality(80).url()}
                      alt={gallery.title}
                      className="w-full transition-opacity group-hover:opacity-80"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#666]">&gt;&gt;&gt;</span>
                  <span className="text-[#e0e0e0] group-hover:text-white">{gallery.title}</span>
                </div>
                {gallery.description && (
                  <p className="text-[#666] text-sm mt-1 ml-7">{gallery.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}