import React from 'react'
import { Star } from 'lucide-react'

export const StarRating: React.FC<{ stars: number }> = ({ stars }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map(i => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= stars ? 'text-yellow-500 fill-yellow-500' : 'text-stone-700'}`}
        />
      ))}
    </div>
  )
}
