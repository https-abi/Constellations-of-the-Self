"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import Image from "next/image"

interface ImageGalleryProps {
  images: { src: string; alt: string }[]
  brightness: number
  slideIndex?: number
}

export function ImageGallery({ images, brightness, slideIndex = 0 }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)

  // Keep dark theme for slides 8+ (index 7+)
  const isDark = slideIndex >= 7 || brightness <= 0.6

  const nextImage = () => {
    setCurrentGalleryIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentGalleryIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (images.length === 1) {
    return (
      <div className="mt-6">
        <motion.div
          className="relative cursor-pointer group overflow-hidden rounded-xl"
          onClick={() => setSelectedImage(0)}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Image
            src={images[0].src}
            alt={images[0].alt}
            width={600}
            height={800}
            className="w-full h-auto max-h-[50vh] object-contain rounded-xl"
          />
          <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
            isDark ? 'bg-black/30' : 'bg-white/30'
          }`}>
            <ZoomIn className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-800'}`} />
          </div>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
              </button>
              <Image
                src={images[0].src}
                alt={images[0].alt}
                width={1200}
                height={1600}
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="mt-6">
      {/* Gallery carousel */}
      <div className="relative">
        <motion.div
          className="relative cursor-pointer group overflow-hidden rounded-xl"
          onClick={() => setSelectedImage(currentGalleryIndex)}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGalleryIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={images[currentGalleryIndex].src}
                alt={images[currentGalleryIndex].alt}
                width={600}
                height={800}
                className="w-full h-auto max-h-[45vh] object-contain rounded-xl"
              />
            </motion.div>
          </AnimatePresence>
          <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
            isDark ? 'bg-black/30' : 'bg-white/30'
          }`}>
            <ZoomIn className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-800'}`} />
          </div>
        </motion.div>

        {/* Navigation arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); prevImage(); }}
          className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-md transition-all ${
            isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/10 hover:bg-black/20 text-gray-800'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); nextImage(); }}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-md transition-all ${
            isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/10 hover:bg-black/20 text-gray-800'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentGalleryIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentGalleryIndex
                ? isDark ? 'bg-white w-6' : 'bg-gray-800 w-6'
                : isDark ? 'bg-white/30 hover:bg-white/50' : 'bg-black/30 hover:bg-black/50'
            }`}
          />
        ))}
      </div>

      {/* Image counter */}
      <p className={`text-center text-sm mt-2 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
        {currentGalleryIndex + 1} of {images.length}
      </p>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                setSelectedImage((prev) => (prev! - 1 + images.length) % images.length);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <Image
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              width={1200}
              height={1600}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                setSelectedImage((prev) => (prev! + 1) % images.length);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {selectedImage + 1} of {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
