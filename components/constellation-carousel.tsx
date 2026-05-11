"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ParallaxStars } from "./parallax-stars"
import { ConstellationMap } from "./constellation-map"
import { SlideContent, TitleSlide, ContentSlide } from "./slide-content"
import { ImageGallery } from "./image-gallery"

// Image collections for each slide
const SLIDE_IMAGES = {
  smartGoal: [
    { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SMART%20goals-1-1GtcbGCAYcxqNICInheNJL6GNfd6ne.png", alt: "SMART Goals infographic" }
  ],
  easternWestern: [
    { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/premiuim%20canva-1-fwP9mmC7vjHGvxKb1ylWcYE30SqBlf.png", alt: "Get to Know Me - A Mix Blood" },
    { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/premiuim%20canva-2-kq62tlbpPwIVJqDQgmc9uLrJOwnEuB.png", alt: "Eastern and Western Influences in My Identity" },
    { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/premiuim%20canva-3-XiROWHv8Z1EBPb8a1y9bI2BuARDrep.png", alt: "Promoting Cultural Empathy" }
  ],
  philosophical: [
    { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SS1-3pYMGT1vUgmN9dDnqyEQsYqItZL7tE.png", alt: "Video presentation screenshot 1" },
    { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SS2-5cHb5MPmdksQTaXHpwkR430yxSnVdW.png", alt: "Sailboat at sunset - reflection" }
  ],
  anthropological: [
    { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/socialself-VL1s9ggt3r6ag9zqswAsG4prztVFui.png", alt: "Anthropological and Sociological Perspectives of the Self" }
  ],
  physical: [
    { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ARNOLD_M4%20Reflective%20Essay-1-HZTgUkQEE0eGouyYkDkgYs77I3o7G4.png", alt: "Physical and Sexual Self - Reflective Essay Part 1" },
    { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ARNOLD_M4%20Reflective%20Essay-2-ushyp3ckyKjVGgYmibXDZbIqHxx01s.png", alt: "Physical and Sexual Self - Reflective Essay Part 2" },
    { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ARNOLD_M4%20Reflective%20Essay-3-ZsHNEYvOsR556qWVnwhkrCncSx5WQl.png", alt: "Physical and Sexual Self - Reflective Essay Part 3" },
    { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ARNOLD_M4%20Reflective%20Essay-4-0mDPS2JLn5XGZr7hPpiuIhe0ERHRQh.png", alt: "Physical and Sexual Self - Reflective Essay Part 4" }
  ],
  material: [
    { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ARNOLD_MaterialDigitalSelf-1-7gzBW9nDvOfEwpQ363odnZpwMf7AIq.png", alt: "Material and Digital Self Reflection Part 1" },
    { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ARNOLD_MaterialDigitalSelf-2-pBb7X1FD2rMs99KLPSWgfEy7ELDbTP.png", alt: "Material and Digital Self Reflection Part 2" }
  ],
  spiritual: [
    { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ARNOLD%20-%20Reflection%20on%20Spiritual%20and%20Political%20Self-1-ufep4oLyS0sjJlsYLFHpw5oI733tWr.png", alt: "Reflection on Political Self" },
    { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ARNOLD%20-%20Reflection%20on%20Spiritual%20and%20Political%20Self-2-JlHDQkA57YGnZ2Lzev7ZqVPPYmczie.png", alt: "Reflection on Spiritual Self" }
  ]
}

const SLIDES = [
  {
    id: 1,
    name: "Title",
    romanNumeral: "I",
    title: "The Constellation of Me",
  },
  {
    id: 2,
    name: "Contents",
    romanNumeral: "II",
    title: "Table of Contents",
  },
  {
    id: 3,
    name: "Introduction",
    romanNumeral: "III",
    title: "Brief Introduction",
  },
  {
    id: 4,
    name: "SMART Goal",
    romanNumeral: "IV",
    title: "SMART Goal Reflection",
  },
  {
    id: 5,
    name: "Eastern & Western",
    romanNumeral: "V",
    title: "Eastern and Western Self",
  },
  {
    id: 6,
    name: "Philosophical",
    romanNumeral: "VI",
    title: "Philosophical and Psychological Self",
  },
  {
    id: 7,
    name: "Anthropological",
    romanNumeral: "VII",
    title: "Anthropological and Sociological Self",
  },
  {
    id: 8,
    name: "Physical",
    romanNumeral: "VIII",
    title: "Physical and Sexual Self",
  },
  {
    id: 9,
    name: "Material",
    romanNumeral: "IX",
    title: "Material and Digital Self",
  },
  {
    id: 10,
    name: "Spiritual",
    romanNumeral: "X",
    title: "Spiritual and Political Self",
  },
  {
    id: 11,
    name: "Parting Words",
    romanNumeral: "XI",
    title: "Parting Words",
  },
]

export function ConstellationCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [isTransitioning, setIsTransitioning] = useState(false)

  const totalSlides = SLIDES.length
  const brightness = currentIndex / (totalSlides - 1)

  // Handle mouse movement for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault()
        goToNext()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        goToPrevious()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, isTransitioning])

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 800)
  }, [currentIndex, isTransitioning])

  const goToNext = useCallback(() => {
    if (currentIndex < totalSlides - 1) {
      goToSlide(currentIndex + 1)
    }
  }, [currentIndex, totalSlides, goToSlide])

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1)
    }
  }, [currentIndex, goToSlide])

  // Dynamic button colors based on brightness (use dark theme for slides 8+)
  const useDarkNav = currentIndex >= 7 || brightness <= 0.6
  const buttonBg = useDarkNav
    ? "bg-white/10 hover:bg-white/20 text-white" 
    : "bg-black/10 hover:bg-black/20 text-gray-800"
  
  const buttonDisabled = useDarkNav
    ? "bg-white/5 text-white/30"
    : "bg-black/5 text-gray-400"

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Parallax star background */}
      <ParallaxStars
        currentIndex={currentIndex}
        totalSlides={totalSlides}
        mouseX={mousePosition.x}
        mouseY={mousePosition.y}
      />

      {/* Slide content */}
      <AnimatePresence mode="wait">
        <SlideContent
          key={currentIndex}
          isActive={true}
          brightness={brightness}
          slideIndex={currentIndex}
        >
          {currentIndex === 0 && (
            <TitleSlide
              title="The Constellation of Me"
              subtitle="A cosmic exploration of identity, consciousness, and the many dimensions of who I am"
              brightness={brightness}
            />
          )}

          {currentIndex === 1 && (
            <ContentSlide
              title="Table of Contents"
              romanNumeral="II"
              brightness={brightness}
            >
              <nav className="flex flex-col gap-2 mt-6 max-h-[50vh] overflow-y-auto pr-2">
                {SLIDES.map((slide, idx) => (
                  <motion.button
                    key={slide.id}
                    onClick={() => goToSlide(idx)}
                    className={`flex items-center justify-between text-left p-3 rounded-lg transition-all ${
                      idx === currentIndex 
                        ? brightness > 0.6 ? 'bg-black/10' : 'bg-white/10'
                        : brightness > 0.6 ? 'hover:bg-black/5' : 'hover:bg-white/5'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium ${
                        brightness > 0.6 ? 'bg-black/10' : 'bg-white/10'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs opacity-50">{slide.romanNumeral}</span>
                        <span className="font-medium">{slide.title}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      brightness > 0.6 ? 'bg-black/5' : 'bg-white/5'
                    }`}>
                      Page {idx + 1}
                    </span>
                  </motion.button>
                ))}
              </nav>
            </ContentSlide>
          )}

          {currentIndex === 2 && (
            <ContentSlide
              title="Brief Introduction"
              romanNumeral="III"
              brightness={brightness}
            >
              <div className="space-y-4 text-base md:text-lg leading-relaxed opacity-90">
                <p>
                  Identity is rarely a single, solid object; rather, it is a collection of moments, lessons, and reflections scattered across time. I have titled my final requirement &apos;The Constellation of Me&apos; to represent this complexity. Much like stars in the night sky, the individual essays, videos, and reflections in this gallery might seem distant or distinct on their own. However, when viewed together, they form a unique map outlining my true self. This portfolio traces the lines between my internal psyche and my external world, revealing the &apos;constellation&apos; of the person I am becoming.
                </p>
              </div>
            </ContentSlide>
          )}

          {currentIndex === 3 && (
            <ContentSlide
              title="SMART Goal Reflection"
              romanNumeral="IV"
              brightness={brightness}
            >
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="lg:w-1/2 space-y-4 text-base md:text-lg leading-relaxed opacity-90">
                  <p>
                    I am proud to say that I have achieved my goal for the midterm period and am hoping to achieve it again this final term! Through rigourously yet intuitively being guided by the SMART goal system, I was motivated to strive achieving my goal in realistic and measurable means. I learned that structured framework for accomplishment is incredibly useful especially to a perfectionist who constantly struggles in unrealistic idealistic measures. It&apos;s important to fully understand my capabilities and push myself through my limitations yet within that capability matrix to achieve my heart&apos;s desires.
                  </p>
                </div>
                <div className="lg:w-1/2">
                  <ImageGallery images={SLIDE_IMAGES.smartGoal} brightness={brightness} slideIndex={3} />
                </div>
              </div>
            </ContentSlide>
          )}

          {currentIndex === 4 && (
            <ContentSlide
              title="Eastern and Western Self"
              romanNumeral="V"
              brightness={brightness}
            >
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="lg:w-1/2 space-y-4 text-base md:text-lg leading-relaxed opacity-90">
                  <p>
                    I am a product of two worlds. With a Western father and an Eastern mother, I have grown up navigating two very different sets of values and communication styles. From my father, I inherited directness, independence, and a fast-paced drive toward my personal goals. From my mother, I learned the importance of family, respect, and keeping relationships at the center of my decisions.
                  </p>
                  <p>
                    These influences do not always sit comfortably side by side. There are moments where I feel the tension between wanting to speak my mind and knowing that the situation calls for a softer, more considerate approach. It is something I actively work through, and over time I have come to see that balance not as a contradiction but as one of my strengths.
                  </p>
                  <p>
                    My upbringing has also made me deeply aware of how culture shapes the way people communicate and receive feedback. I have seen firsthand how the same words can land very differently depending on where someone comes from. As I grow into my future profession, I carry that awareness with me, knowing that empathy and cultural sensitivity are just as important as competence and confidence.
                  </p>
                </div>
                <div className="lg:w-1/2">
                  <ImageGallery images={SLIDE_IMAGES.easternWestern} brightness={brightness} slideIndex={4} />
                </div>
              </div>
            </ContentSlide>
          )}

          {currentIndex === 5 && (
            <ContentSlide
              title="Philosophical and Psychological Self"
              romanNumeral="VI"
              brightness={brightness}
            >
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="lg:w-1/2 space-y-4 text-base md:text-lg leading-relaxed opacity-90">
                  <p>
                    I believe that life is not something to be controlled but something to be navigated with intention and grace. I have faced real hardship, loss, financial struggle, isolation, and periods where I deeply questioned my own worth and direction. I did not always move through these moments gracefully, but I always moved. And that, I have come to understand, is enough.
                  </p>
                  <p>
                    Philosophy has given me a framework for making sense of these experiences. I find truth in the idea that virtue and growth are not built in comfort but through the choices we make under pressure. Suffering is not something to suppress or rush past. It is something to feel, learn from, and eventually rise beyond.
                  </p>
                  <p>
                    I am honest with myself about where I am. My real self and my ideal self are not yet fully aligned. I carry resilience alongside self-doubt, and I am still learning to show up for myself with the same empathy I extend to others. But I believe that the gap between who I am and who I want to be closes through small, honest choices made every day.
                  </p>
                  <p>
                    To nurture the soul is to keep moving, keep reflecting, and keep choosing growth even when it is uncomfortable. That is the practice I am committed to.
                  </p>
                </div>
                <div className="lg:w-1/2">
                  <ImageGallery images={SLIDE_IMAGES.philosophical} brightness={brightness} slideIndex={5} />
                </div>
              </div>
            </ContentSlide>
          )}

          {currentIndex === 6 && (
            <ContentSlide
              title="Anthropological and Sociological Self"
              romanNumeral="VII"
              brightness={brightness}
            >
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="lg:w-1/2 space-y-4 text-base md:text-lg leading-relaxed opacity-90">
                  <p>
                    I am someone whose identity has been shaped by the many roles I play and the communities I belong to as a student, a freelance model, a friend, and a daughter. Each of these spaces has contributed to who I am and how I carry myself in the world.
                  </p>
                  <p>
                    I am driven, socially active, and known for bringing energy and confidence to the people around me. To most, I may come across as self-sufficient and a little difficult to read — and honestly, that is not entirely wrong. I have different sides of myself that I share depending on who I am with and what the situation calls for. I adapt, I lead, and I connect but I also guard my inner world carefully, allowing only a few people to truly know me.
                  </p>
                  <p>
                    At my core, I am someone who is constantly performing and constantly growing. I am building myself through every environment I enter, while quietly holding space for the version of me that exists beyond what others see.
                  </p>
                </div>
                <div className="lg:w-1/2">
                  <ImageGallery images={SLIDE_IMAGES.anthropological} brightness={brightness} slideIndex={6} />
                </div>
              </div>
            </ContentSlide>
          )}

          {currentIndex === 7 && (
            <ContentSlide
              title="Physical and Sexual Self"
              romanNumeral="VIII"
              brightness={brightness}
              slideIndex={7}
            >
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="lg:w-1/2 space-y-4 text-base md:text-lg leading-relaxed opacity-90">
                  <p>
                    I am someone who values and takes care of my physical self, not just for appearance but for the strength and discipline it takes to keep up with everything I do. I am comfortable and confident in my body, and I take that responsibility seriously through consistent healthy habits.
                  </p>
                  <p>
                    I am secure in my identity and orientation, and while my own experience has been straightforward, I deeply respect that others navigate this differently. What matters most to me is that every person is met with understanding and respect regardless of where they fall on that spectrum.
                  </p>
                  <p>
                    I believe strongly in human dignity. Body shaming, gender-based violence, and discrimination are issues I take seriously because they cause real harm to real people and to society as a whole. I try to live out my opposition to these not just in words but in how I treat people, how I speak, and the spaces I choose to show up in.
                  </p>
                </div>
                <div className="lg:w-1/2">
                  <ImageGallery images={SLIDE_IMAGES.physical} brightness={brightness} slideIndex={7} />
                </div>
              </div>
            </ContentSlide>
          )}

          {currentIndex === 8 && (
            <ContentSlide
              title="Material and Digital Self"
              romanNumeral="IX"
              brightness={brightness}
              slideIndex={8}
            >
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="lg:w-1/2 space-y-4 text-base md:text-lg leading-relaxed opacity-90">
                  <p>
                    My identity is made up of the things I carry, the people I keep close, and the versions of myself I choose to show depending on where I am. In my material world, I am defined by resilience, femininity, and the relationships that reflect the best of who I am. The people closest to me, my friends and my boyfriend, are as much a part of my identity as anything I own.
                  </p>
                  <p>
                    Online, however, I show far less of myself. My digital presence is intentionally professional, centered on my modelling work, and rarely gives people a real glimpse of my personality. While this curation serves a purpose, I am aware that it also flattens who I truly am.
                  </p>
                  <p>
                    I am not immune to the pressures that come with existing in a competitive, image-driven space. Comparison is something I actively have to manage. But I hold on to the reminder that my worth is not defined by any single role or career. My identity is far bigger than what any profile can contain, and I am slowly learning that sharing more of myself honestly is not a vulnerability. It is a strength.
                  </p>
                </div>
                <div className="lg:w-1/2">
                  <ImageGallery images={SLIDE_IMAGES.material} brightness={brightness} slideIndex={8} />
                </div>
              </div>
            </ContentSlide>
          )}

          {currentIndex === 9 && (
            <ContentSlide
              title="Spiritual and Political Self"
              romanNumeral="X"
              brightness={brightness}
              slideIndex={9}
            >
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="lg:w-1/2 space-y-4 text-base md:text-lg leading-relaxed opacity-90">
                  <p>
                    I am someone who thinks deeply about the world around me and holds strong convictions about what good leadership and genuine service look like. I believe in questioning, learning, and forming my own opinions rather than simply accepting what I am told. My values have always centered on fairness, honesty, and the idea that society should work for everyone, not just a few.
                  </p>
                  <p>
                    On a more personal level, I find meaning in my relationships, my family, and my commitment to becoming a better version of myself each day. I believe in something greater than myself, though I express that belief quietly — less through ritual and more through how I choose to live and treat the people around me.
                  </p>
                  <p>
                    I am someone driven by purpose, guided by values, and always looking to grow.
                  </p>
                </div>
                <div className="lg:w-1/2">
                  <ImageGallery images={SLIDE_IMAGES.spiritual} brightness={brightness} slideIndex={9} />
                </div>
              </div>
            </ContentSlide>
          )}

          {currentIndex === 10 && (
            <ContentSlide
              title="Parting Words"
              romanNumeral="XI"
              brightness={brightness}
              slideIndex={10}
            >
              <div className="space-y-4 text-base md:text-lg leading-relaxed opacity-90">
                <p>
                  At first, UTS was just another minor subject I had to accomplish. Honestly, I thought of it as another obstacle into my focus on computer science. Why do I need to learn about myself if I already know myself? I mean, I am the one living in this body. But whenever a requirement was assigned to ascertain the description of myself based on this or that, I struggled to answer. I had to really think critically, subjectively, and objectively about myself.
                </p>
                <p>
                  And that struggle taught me something. Knowing yourself and understanding yourself are two very different things. I have always been self-aware to a degree, but this subject pushed me to examine the layers underneath. The political, spiritual, physical, material, digital, cultural, philosophical, and psychological dimensions of who I am did not just exist separately. They were all connected, all informing each other in ways I had never stopped to consciously recognize. And somewhere in that process, I stopped seeing this subject as an obstacle. Computer science is a field built on problem solving, collaboration, and communication across cultures and perspectives. Understanding myself, how I think, how I adapt, where my blind spots are, and how I relate to others, makes me a more capable and more human professional. Self-awareness is not separate from competence. It is part of it.
                </p>
                <p>
                  I learned that my identity is not a fixed thing. It is assembled through my relationships, my experiences, the cultures I was raised between, and the choices I make every single day. I am a product of a Western father and an Eastern mother, of academic spaces and the modelling industry, of hardship and growth and everything in between. I have many facets, and depending on the angle you look from, you will see something different. But every side belongs to the same me.
                </p>
                <p>
                  I also realized that the version of myself I show the world is only a fraction of who I truly am. My digital self is curated, my social self is adaptive, and my inner world is something I guard carefully. This subject made me confront that gap honestly, not with shame, but with the intention to slowly close it.
                </p>
                <p>
                  What I will carry with me after this semester is the understanding that education to understand the self must be a continued practice. I am resilient yet prone to self-doubt. I am driven yet still learning to extend to myself the same compassion I give others. My real self and my ideal self are not yet fully aligned, and that is okay. Growth is rarely comfortable, but it is necessary.
                </p>
                <blockquote className="border-l-2 pl-4 my-6 italic border-violet-400/50">
                  To my future self, I promise to keep moving even when it is not graceful. To feel the hard things without letting them become permanent. To keep shining, not just for myself but because of the people whose light I carry within me. No star shines alone, and I have never truly been one. I promise to remember that the trail I leave behind is not just a record of where I have been, but proof that I kept going. You will thank me not for having had it all figured out, but for never having stopped trying.
                </blockquote>
              </div>
            </ContentSlide>
          )}
        </SlideContent>
      </AnimatePresence>

      {/* Constellation minimap */}
      <ConstellationMap
        currentIndex={currentIndex}
        totalSlides={totalSlides}
        onNavigate={goToSlide}
        slideNames={SLIDES.map((s) => s.name)}
      />

      {/* Navigation buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <motion.button
          onClick={goToPrevious}
          disabled={currentIndex === 0 || isTransitioning}
          className={`p-3 rounded-full backdrop-blur-md transition-all ${
            currentIndex === 0 ? buttonDisabled : buttonBg
          }`}
          whileHover={{ scale: currentIndex === 0 ? 1 : 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <div 
          className={`px-4 py-2 rounded-full backdrop-blur-md text-sm font-medium ${
            useDarkNav ? 'bg-white/10 text-white' : 'bg-black/10 text-gray-800'
          }`}
        >
          {currentIndex + 1} / {totalSlides}
        </div>

        <motion.button
          onClick={goToNext}
          disabled={currentIndex === totalSlides - 1 || isTransitioning}
          className={`p-3 rounded-full backdrop-blur-md transition-all ${
            currentIndex === totalSlides - 1 ? buttonDisabled : buttonBg
          }`}
          whileHover={{ scale: currentIndex === totalSlides - 1 ? 1 : 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Keyboard hint */}
      <motion.div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 text-xs tracking-wider ${
          useDarkNav ? 'text-white/40' : 'text-gray-500'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Use arrow keys or click constellation stars to navigate
      </motion.div>
    </div>
  )
}
