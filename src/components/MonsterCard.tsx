import React from 'react'
import { Monster } from '../lib/types'
import { Flame, Droplets, Zap, Snowflake, Skull, Swords, AlertTriangle } from 'lucide-react'

interface MonsterCardProps {
  monster: Monster
  onClick: () => void
  activeTransition?: boolean
}

export const MonsterCard: React.FC<MonsterCardProps> = ({ monster, onClick, activeTransition }) => {
  const getElementIcon = (elements: string[]) => {
    if (elements.includes('火') || elements.includes('Fire'))
      return <Flame className="w-3 h-3 sm:w-5 sm:h-5 text-red-600 dark:text-red-500" />
    if (elements.includes('水') || elements.includes('Water'))
      return <Droplets className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-500" />
    if (elements.includes('雷') || elements.includes('Thunder'))
      return <Zap className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
    if (elements.includes('氷') || elements.includes('Ice'))
      return <Snowflake className="w-3 h-3 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-300" />
    if (elements.includes('龍') || elements.includes('Dragon'))
      return <Skull className="w-3 h-3 sm:w-5 sm:h-5 text-purple-700 dark:text-purple-500" />
    return <Swords className="w-3 h-3 sm:w-5 sm:h-5 text-stone-500" />
  }

  return (
    <div
      onClick={onClick}
      className="group relative bg-[#f5f2eb] dark:bg-[#1a1918] border border-stone-300 dark:border-stone-800 hover:border-yellow-600/80 dark:hover:border-yellow-600/80 transition-all duration-300 rounded shadow-lg hover:shadow-2xl hover:shadow-yellow-900/10 hover:-translate-y-1 cursor-pointer overflow-hidden h-full flex flex-col"
    >
      {/* Image Section */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-200 dark:bg-stone-900">
        <img
          id={`monster-image-${monster.name}`}
          src={monster.imageUrl || `https://picsum.photos/seed/${monster.name}/500/500`}
          alt={monster.name}
          className="w-full h-full object-cover opacity-100 dark:opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 sepia-[0.2] dark:sepia-0"
          style={activeTransition ? { viewTransitionName: 'hero-image' } : undefined}
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f5f2eb] dark:from-[#1a1918] via-transparent to-transparent opacity-90"></div>

        {/* Floating Badge (Top Left) - Element */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          <div className="bg-[#fbf9f5]/90 dark:bg-stone-900/80 backdrop-blur border border-stone-300 dark:border-stone-700 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full flex items-center gap-1 shadow-sm">
            {getElementIcon(monster.elements)}
            <span className="text-[8px] sm:text-[10px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {monster.elements[0] || '無'}
            </span>
          </div>
        </div>

        {/* Species Badge (Top Right) */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <span className="text-[8px] sm:text-[10px] font-mincho bg-yellow-100/90 dark:bg-yellow-900/90 text-yellow-900 dark:text-yellow-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border border-yellow-300 dark:border-yellow-700 shadow-md">
            {monster.species}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative p-3 sm:p-4 flex-1 flex flex-col -mt-8 sm:-mt-12 z-10">
        <div className="mb-auto">
          <div className="flex justify-between items-end mb-1">
            <span className="text-[10px] sm:text-xs text-stone-600 dark:text-stone-500 font-cinzel italic truncate w-full">
              {monster.title}
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-mincho font-bold text-stone-900 dark:text-stone-100 group-hover:text-yellow-700 dark:group-hover:text-yellow-500 transition-colors drop-shadow-sm truncate">
            {monster.name}
          </h2>

          <div className="h-0.5 w-8 sm:w-12 bg-yellow-600 dark:bg-yellow-800 mt-1 mb-2 sm:mt-2 sm:mb-3 group-hover:w-full transition-all duration-500 ease-out"></div>

          <p className="text-[10px] sm:text-xs text-stone-600 dark:text-stone-400 line-clamp-2 font-mincho leading-relaxed group-hover:text-stone-800 dark:group-hover:text-stone-300">
            {monster.description}
          </p>
        </div>

        {/* Footer Stats */}
        <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-stone-300 dark:border-stone-800 flex items-center justify-between">
          <div
            className="flex items-center gap-1 text-red-800/80 dark:text-red-900/80"
            title="Threat Level"
          >
            <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full ${i < Math.min(monster.threatLevel, 5) ? 'bg-red-600' : 'bg-stone-300 dark:bg-stone-800'}`}
                />
              ))}
            </div>
          </div>
          <span className="text-[8px] sm:text-[10px] text-yellow-800 dark:text-yellow-700 font-bold group-hover:translate-x-1 transition-transform">
            DETAILS &gt;
          </span>
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 sm:w-2 sm:h-2 border-b border-l border-yellow-600 dark:border-yellow-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 border-b border-r border-yellow-600 dark:border-yellow-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  )
}
