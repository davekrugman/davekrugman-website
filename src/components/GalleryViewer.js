'use client'

import { useState, useRef } from 'react'

export default function GalleryViewer({ images }) {
  const [zoomedIndex, setZoomedIndex] = useState(null)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)

  const handleImageTap = (index) => {
    if (zoomedIndex === index) {
      setZoomedIndex(null)
      setPanPosition({ x: 0, y: 0 })
    } else {
      setZoomedIndex(index)
      setPanPosition({ x: 0, y: 0 })
    }
  }

  const handlePan = (e) => {
    if (zoomedIndex === null) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * -50
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -50
    setPanPosition({ x, y })
  }

  const handleTouchMove = (e) => {
    if (zoomedIndex === null) return
    
    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((touch.clientX - rect.left) / rect.width - 0.5) * -50
    const y = ((touch.clientY - rect.top) / rect.height - 0.5) * -50
    setPanPosition({ x, y })
  }

  return (
    <div ref={containerRef} className="px-[5%]">
      {images.map((image, index) => (
        <div key={image.key || index} className="mb-2">
          <div 
            className={`relative overflow-hidden cursor-pointer ${
              zoomedIndex === index ? 'z-50' : ''
            }`}
            onClick={() => handleImageTap(index)}
            onMouseMove={zoomedIndex === index ? handlePan : undefined}
            onTouchMove={zoomedIndex === index ? handleTouchMove : undefined}
          >
            <img
              src={image.url}
              alt={image.caption || ''}
              loading="lazy"
              className={`w-full h-auto transition-transform duration-300 ${
                zoomedIndex === index ? 'scale-[2.5]' : 'scale-100'
              }`}
              style={
                zoomedIndex === index
                  ? { transform: `scale(2.5) translate(${panPosition.x}%, ${panPosition.y}%)` }
                  : undefined
              }
            />
          </div>
          
          {image.caption && (
            <p className="text-[#e0e0e0] text-sm font-light leading-relaxed mt-4 mb-6">{image.caption}</p>
          )}
        </div>
      ))}
    </div>
  )
}