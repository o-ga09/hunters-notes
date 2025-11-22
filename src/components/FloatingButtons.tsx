import { useState, useEffect } from 'react'
import { ArrowUp, MessageCircle } from 'lucide-react'

interface FloatingButtonsProps {
  onAskAI: () => void
}

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({ onAskAI }) => {
  const [showScrollTop, setShowScrollTop] = useState(false)

  // スクロール位置を監視
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* AIに聞くボタン */}
      <button
        onClick={onAskAI}
        className="group relative w-14 h-14 bg-yellow-600 hover:bg-yellow-500 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border-2 border-yellow-800 dark:border-yellow-900 hover:scale-110"
        aria-label="AIに聞く"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-full mr-3 px-3 py-1 bg-stone-800 dark:bg-stone-200 text-stone-100 dark:text-stone-900 text-sm font-bold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          AIに聞く
        </span>
      </button>

      {/* トップに戻るボタン */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="group relative w-14 h-14 bg-stone-700 hover:bg-stone-600 dark:bg-stone-600 dark:hover:bg-stone-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border-2 border-stone-800 dark:border-stone-700 hover:scale-110 animate-fadeIn"
          aria-label="トップに戻る"
        >
          <ArrowUp className="w-6 h-6" />
          <span className="absolute right-full mr-3 px-3 py-1 bg-stone-800 dark:bg-stone-200 text-stone-100 dark:text-stone-900 text-sm font-bold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            トップへ
          </span>
        </button>
      )}
    </div>
  )
}
