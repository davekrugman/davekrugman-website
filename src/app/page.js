'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

function TypeWriter({ text, delay = 30, onComplete }) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, delay)
      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, delay, onComplete])

  return <span>{displayText}<span className="animate-pulse">_</span></span>
}

function AnimatedItems({ items, isOpen }) {
  const [visibleItems, setVisibleItems] = useState([])

  useEffect(() => {
    if (isOpen) {
      setVisibleItems([])
      items.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems(prev => [...prev, index])
        }, index * 80)
      })
    } else {
      setVisibleItems([])
    }
  }, [isOpen, items.length])

  if (!isOpen) return null

  return (
    <div className="ml-6 mt-2 space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className={`transform transition-all duration-200 ${
            visibleItems.includes(index)
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-4'
          }`}
        >
          {item}
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [digitalArtOpen, setDigitalArtOpen] = useState(false)
  const [loadingStage, setLoadingStage] = useState(0)

  useEffect(() => {
    const stages = [500, 1500, 2500, 3500, 4500]
    stages.forEach((time, index) => {
      setTimeout(() => setLoadingStage(index + 1), time)
    })
  }, [])

  const digitalArtItems = [
    <a key="1" href="https://opensea.io/collection/nightmoves" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#e0e0e0] hover:text-white">
      <span className="text-[#666]">-</span> NIGHTMOVES
    </a>,
    <a key="2" href="https://opensea.io/collection/drip-drop-by-dave-krugman" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#e0e0e0] hover:text-white">
      <span className="text-[#666]">-</span> DRIP DROP
    </a>,
    <a key="3" href="https://opensea.io/collection/drive-dave-krugman" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#e0e0e0] hover:text-white">
      <span className="text-[#666]">-</span> DRIVE // LAP 1
    </a>,
    <a key="4" href="https://opensea.io/collection/drive-lap-2" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#e0e0e0] hover:text-white">
      <span className="text-[#666]">-</span> DRIVE // LAP 2
    </a>,
    <a key="5" href="https://opensea.io/collection/rolls-dave-krugman" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#e0e0e0] hover:text-white">
      <span className="text-[#666]">-</span> ROLLS
    </a>,
    <a key="6" href="https://opensea.io/collection/dave-krugman-editions" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#e0e0e0] hover:text-white">
      <span className="text-[#666]">-</span> EDITIONED WORK
    </a>,
    <a key="7" href="https://www.niftygateway.com/collections/dave-krugman/" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#e0e0e0] hover:text-white">
      <span className="text-[#666]">-</span> SPECTERS
    </a>,
    <a key="8" href="https://www.niftygateway.com/collections/chiaroscuro/" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#e0e0e0] hover:text-white">
      <span className="text-[#666]">-</span> CHIAROSCURO
    </a>,
    <a key="9" href="https://superrare.com/davekrugman" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#e0e0e0] hover:text-white">
      <span className="text-[#666]">-</span> SuperRare
    </a>,
  ]

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-mono flex flex-col md:justify-center">
      {/* Header with name - sticky on mobile, part of centered flow on desktop */}
      <header className="sticky md:static top-0 bg-[#0a0a0a] z-50 px-8 pt-8 md:pt-0 pb-6">
        <div className="max-w-[700px] mx-auto w-full">
          <h1 className="text-2xl font-normal text-white">
            {loadingStage >= 1 && (
              loadingStage === 1 ? (
                <TypeWriter text="DAVE KRUGMAN" delay={50} />
              ) : (
                'DAVE KRUGMAN'
              )
            )}
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="px-8 pb-12">
        <div className="max-w-[700px] mx-auto w-full">
          {/* Bio */}
          <div className={`mb-8 font-light text-[15px] leading-relaxed transition-opacity duration-500 ${loadingStage >= 2 ? 'opacity-100' : 'opacity-0'}`}>
            <p className="mb-4">
              Photographer, writer, and founder of{' '}
              <a 
                href="https://allships.co" 
                className="text-white border-b border-[#666] hover:border-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                ALLSHIPS
              </a>
              . Based in New York City.
            </p>
            <p>
              Creating work at the intersection of technology and art. 
              Documenting the beauty at confluences of circumstance.
            </p>
          </div>

          {/* Projects dropdown */}
          <div className={`mb-8 transition-opacity duration-500 ${loadingStage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              onClick={() => setProjectsOpen(!projectsOpen)}
              className="inline-flex items-center gap-2 text-sm text-[#e0e0e0] hover:text-white"
            >
              <span className="text-[#666]">&gt;&gt;&gt;</span> projects
              <span className="text-[#666] text-xs">{projectsOpen ? '[-]' : '[+]'}</span>
            </button>
            
            {projectsOpen && (
              <div className="ml-8 mt-3 space-y-2">
                {/* Digital Art submenu */}
                <div>
                  <button 
                    onClick={() => setDigitalArtOpen(!digitalArtOpen)}
                    className="inline-flex items-center gap-2 text-sm text-[#e0e0e0] hover:text-white"
                  >
                    <span className="text-[#666]">&gt;</span> digital art
                    <span className="text-[#666] text-xs">{digitalArtOpen ? '[-]' : '[+]'}</span>
                  </button>
                  <AnimatedItems items={digitalArtItems} isOpen={digitalArtOpen} />
                </div>

                <Link href="/client-work" className="block text-sm text-[#e0e0e0] hover:text-white">
                  <span className="text-[#666]">&gt;</span> client work
                </Link>
                <a href="https://stories.davekrugman.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#e0e0e0] hover:text-white">
                  <span className="text-[#666]">&gt;</span> photo essays
                </a>
              </div>
            )}
          </div>

          {/* Work with me */}
          <div className={`mb-8 transition-opacity duration-500 ${loadingStage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
            <a 
              href="mailto:dave@davekrugman.com"
              className="inline-flex items-center gap-2 text-sm text-[#e0e0e0] hover:text-white"
            >
              <span className="text-[#666]">&gt;&gt;&gt;</span> work with me
            </a>
          </div>

          {/* Connect section */}
          <div className={`transition-opacity duration-500 ${loadingStage >= 4 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-xs text-[#666] uppercase tracking-wider mb-3">// connect</div>
            <nav className="flex flex-wrap gap-6">
              <a href="https://instagram.com/dave.krugman" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[#e0e0e0] hover:text-white">
                <span className="text-[#666]">&gt;&gt;&gt;</span> instagram
              </a>
              <a href="https://twitter.com/dave_krugman" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[#e0e0e0] hover:text-white">
                <span className="text-[#666]">&gt;&gt;&gt;</span> x
              </a>
              <a href="https://threads.net/@dave.krugman" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[#e0e0e0] hover:text-white">
                <span className="text-[#666]">&gt;&gt;&gt;</span> threads
              </a>
              <a href="https://allships.co" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[#e0e0e0] hover:text-white">
                <span className="text-[#666]">&gt;&gt;&gt;</span> allships
              </a>
            </nav>
          </div>
        </div>
      </div>
    </main>
  )
}