import React, { useState, useEffect } from 'react'
import { Monster } from '../lib/types'
import { StarRating } from './StarRating'
import { Shield, Crosshair, Map, Ruler, AlertTriangle, Music, Volume2 } from 'lucide-react'

interface MonsterDetailProps {
  monster: Monster
}

// YouTube URLからビデオIDを抽出
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export const MonsterDetail: React.FC<MonsterDetailProps> = ({ monster }) => {
  const [currentBgmIndex, setCurrentBgmIndex] = useState(0)

  const hasBgm = monster.bgm && monster.bgm.length > 0
  const currentBgm = hasBgm && monster.bgm ? monster.bgm[currentBgmIndex] : null
  const youtubeId = currentBgm ? extractYouTubeId(currentBgm.url) : null

  useEffect(() => {
    // BGMが変更されたら選択をリセット
    setCurrentBgmIndex(0)
  }, [monster.monsterId])

  const handleBgmSelect = (index: number) => {
    setCurrentBgmIndex(index)
  }

  return (
    <div className="bg-[#f5f2eb] dark:bg-[#1a1816] rounded-sm shadow-2xl overflow-hidden border-4 border-[#d6cfb8] dark:border-[#2c2520] relative transition-colors duration-500">
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 opacity-40 dark:opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

      {/* Header Section */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <img
          id={`monster-detail-image-${monster.monsterId || monster.name}`}
          src={monster.imageUrl || `https://picsum.photos/seed/${monster.name}/800/600`}
          alt={monster.name}
          className="w-full h-full object-cover opacity-100 dark:opacity-60 sepia-[0.3] dark:sepia-0 transition-all duration-500"
          style={{ viewTransitionName: 'hero-image' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f5f2eb]/30 dark:via-[#1a1816]/60 to-[#f5f2eb] dark:to-[#1a1816]"></div>

        <div className="absolute bottom-0 left-0 w-full p-8">
          <div className="flex items-center gap-4 mb-2">
            <span className="px-3 py-1 bg-yellow-100/90 dark:bg-yellow-900/80 text-yellow-900 dark:text-yellow-200 text-xs font-bold tracking-wider border border-yellow-300 dark:border-yellow-700 shadow-sm">
              {monster.species.toUpperCase()}
            </span>
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wider">
                THREAT LEVEL: {monster.threatLevel}/10
              </span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-mincho font-bold text-stone-800 dark:text-stone-200 tracking-tight drop-shadow-sm dark:drop-shadow-lg">
            {monster.name}
          </h1>
          <p className="text-2xl text-yellow-700 dark:text-yellow-600 font-cinzel italic mt-2 dark:text-shadow">
            — {monster.title} —
          </p>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        {/* Left Column: Stats & Physiology */}
        <div className="lg:col-span-7 space-y-10">
          {/* Description */}
          <section>
            <h3 className="text-yellow-800 dark:text-yellow-600 font-cinzel text-xl border-b border-stone-300 dark:border-stone-700 pb-2 mb-4 flex items-center gap-2">
              <BookIcon /> Report / レポート
            </h3>
            <p className="text-stone-700 dark:text-stone-300 leading-loose font-mincho text-lg text-justify">
              {monster.description}
            </p>
          </section>

          {/* Weaknesses Table */}
          <section>
            <h3 className="text-yellow-800 dark:text-yellow-600 font-cinzel text-xl border-b border-stone-300 dark:border-stone-700 pb-2 mb-4 flex items-center gap-2">
              <Crosshair className="w-5 h-5" /> Physiology & Weaknesses / 生態・弱点
            </h3>
            <div className="bg-white/50 dark:bg-stone-900/50 p-6 rounded border border-stone-200 dark:border-stone-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {monster.weaknesses.map((weakness, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2"
                  >
                    <span className="font-bold text-stone-600 dark:text-stone-400">
                      {weakness.element}
                    </span>
                    <StarRating stars={weakness.stars} />
                  </div>
                ))}
              </div>
              {monster.weaknesses.length === 0 && (
                <p className="text-stone-500 dark:text-stone-600">
                  No significant data on weaknesses.
                </p>
              )}
            </div>
          </section>

          {/* Key Drops */}
          <section>
            <h3 className="text-yellow-800 dark:text-yellow-600 font-cinzel text-xl border-b border-stone-300 dark:border-stone-700 pb-2 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" /> Material Drops / 素材ドロップ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {monster.keyDrops.map((drop, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-stone-100/60 dark:bg-stone-800/40 p-3 rounded border border-stone-200 dark:border-stone-800"
                >
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-stone-900 ${getRarityColor(drop.rarity)} shadow-sm`}
                  >
                    R{drop.rarity}
                  </div>
                  <span className="text-stone-700 dark:text-stone-300 font-mincho">
                    {drop.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Ecology & Tips */}
        <div className="lg:col-span-5 space-y-8">
          {/* Basic Info Box */}
          <div className="bg-[#e6e2d3] dark:bg-[#23201d] p-6 border border-yellow-900/10 dark:border-yellow-900/30 shadow-inner">
            <h4 className="text-stone-500 dark:text-stone-500 text-xs font-bold uppercase mb-4 tracking-widest text-center border-b border-stone-300 dark:border-stone-700 pb-2">
              Ecological Data / 生態情報
            </h4>

            <div className="space-y-4">
              <div>
                <span className="block text-xs text-yellow-800 dark:text-yellow-700 mb-1">
                  ELEMENTS
                </span>
                <div className="flex flex-wrap gap-2">
                  {monster.elements.map(e => (
                    <Badge key={e} text={e} color="red" />
                  ))}
                  {monster.elements.length === 0 && <span className="text-stone-500">-</span>}
                </div>
              </div>

              <div>
                <span className="block text-xs text-yellow-800 dark:text-yellow-700 mb-1">
                  AILMENTS
                </span>
                <div className="flex flex-wrap gap-2">
                  {monster.ailments.map(e => (
                    <Badge key={e} text={e} color="purple" />
                  ))}
                  {monster.ailments.length === 0 && <span className="text-stone-500">-</span>}
                </div>
              </div>

              <div>
                <span className="block text-xs text-yellow-800 dark:text-yellow-700 mb-1">
                  HABITATS
                </span>
                <div className="flex flex-wrap gap-2">
                  {monster.habitats.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1 text-stone-600 dark:text-stone-400 text-sm"
                    >
                      <Map className="w-3 h-3" /> {h}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-300 dark:border-stone-700">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
                    <Ruler className="w-4 h-4" /> Size
                  </div>
                  <div className="text-stone-700 dark:text-stone-300">
                    {monster.size.min}cm ~ {monster.size.max}cm
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hunter Tips */}
          <div className="relative">
            <div className="absolute -inset-1 bg-yellow-600/10 dark:bg-yellow-900/20 blur-sm rounded"></div>
            <div className="relative bg-[#e8e4d9] dark:bg-[#2c2825] p-6 border border-yellow-200 dark:border-yellow-800">
              <h3 className="font-cinzel text-yellow-700 dark:text-yellow-500 mb-4 flex items-center gap-2">
                Hunter's Notes / ハンターズノート
              </h3>
              <ul className="space-y-4">
                {monster.tips.map((tip, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 text-sm text-stone-700 dark:text-stone-300 leading-relaxed"
                  >
                    <span className="text-yellow-800 dark:text-yellow-600 font-bold font-cinzel">
                      {idx + 1}.
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* BGM Player */}
          {hasBgm && (
            <div className="relative">
              <div className="absolute -inset-1 bg-blue-600/10 dark:bg-blue-900/20 blur-sm rounded"></div>
              <div className="relative bg-[#e8e4d9] dark:bg-[#2c2825] p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="font-cinzel text-blue-700 dark:text-blue-500 mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Battle Theme / 戦闘BGM
                </h3>

                {currentBgm && (
                  <div className="space-y-4">
                    <div className="bg-white/50 dark:bg-stone-900/50 p-4 rounded border border-stone-200 dark:border-stone-800">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-stone-700 dark:text-stone-300">
                          {currentBgm.name}
                        </span>
                        <Volume2 className="w-4 h-4 text-stone-500" />
                      </div>

                      {youtubeId ? (
                        <div className="aspect-video w-full rounded overflow-hidden">
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            title={currentBgm.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-stone-500 dark:text-stone-400">
                          BGMの再生には対応していません
                        </div>
                      )}
                    </div>

                    {monster.bgm && monster.bgm.length > 1 && (
                      <div className="space-y-2">
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                          Other Themes:
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {monster.bgm.map((bgm, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleBgmSelect(idx)}
                              className={`text-left px-3 py-2 rounded text-sm transition-colors ${
                                idx === currentBgmIndex
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                                  : 'bg-stone-100 dark:bg-stone-800/40 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700'
                              }`}
                            >
                              {bgm.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ranking */}
          {monster.ranking && monster.ranking.length > 0 && (
            <div className="relative">
              <div className="absolute -inset-1 bg-amber-600/10 dark:bg-amber-900/20 blur-sm rounded"></div>
              <div className="relative bg-[#e8e4d9] dark:bg-[#2c2825] p-6 border border-amber-200 dark:border-amber-800">
                <h3 className="font-cinzel text-amber-700 dark:text-amber-500 mb-4 flex items-center gap-2">
                  <TrophyIcon />
                  Popularity Rankings / 人気投票ランキング
                </h3>
                <div className="space-y-3">
                  {monster.ranking.map((rank, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white/50 dark:bg-stone-900/50 p-3 rounded border border-stone-200 dark:border-stone-800"
                    >
                      <span className="text-sm text-stone-600 dark:text-stone-400">
                        {rank.voteYear}
                      </span>
                      <span className="text-lg font-bold text-amber-700 dark:text-amber-500">
                        #{rank.ranking}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper Components
const BookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
)

const TrophyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
)

const Badge: React.FC<{ text: string; color: 'red' | 'purple' }> = ({ text, color }) => {
  const colors = {
    red: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-900',
    purple:
      'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-900',
  }
  return <span className={`px-2 py-0.5 text-xs border rounded ${colors[color]}`}>{text}</span>
}

const getRarityColor = (rarity: number) => {
  if (rarity >= 9) return 'bg-cyan-300 dark:bg-cyan-400'
  if (rarity >= 7) return 'bg-purple-300 dark:bg-purple-400'
  if (rarity >= 5) return 'bg-yellow-300 dark:bg-yellow-400'
  if (rarity >= 4) return 'bg-green-300 dark:bg-green-400'
  return 'bg-stone-300 dark:bg-stone-400'
}
