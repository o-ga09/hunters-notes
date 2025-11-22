import { useState } from 'react'
import { flushSync } from 'react-dom'

export const useViewTransition = () => {
  const [transitionId, setTransitionId] = useState<string | null>(null)

  const startTransition = (id: string, callback: () => void, onFinished?: () => void) => {
    setTransitionId(id)
    const img = document.getElementById(`monster-image-${id}`)
    if (img) img.style.viewTransitionName = 'hero-image'

    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        flushSync(callback)
      })
      transition.finished.then(() => {
        if (img) img.style.viewTransitionName = ''
        onFinished?.()
      })
    } else {
      callback()
      onFinished?.()
    }
  }

  return { transitionId, startTransition, setTransitionId }
}
