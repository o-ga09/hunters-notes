import { FC } from 'react'
import { Filter } from 'lucide-react'
import { Monster } from '@/lib/types'
import { MonsterCard } from './MonsterCard'

interface MonsterListProps {
  monsters: Monster[]
  onResetFilters: () => void
}

export const MonsterList: FC<MonsterListProps> = ({ monsters, onResetFilters }) => {
  if (monsters.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-stone-500 dark:text-stone-600 font-mincho">
        <Filter className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-lg">条件に一致するモンスターが見つかりません。</p>
        <button
          onClick={onResetFilters}
          className="mt-4 px-4 py-2 text-sm bg-stone-200 dark:bg-stone-800 rounded hover:bg-stone-300 dark:hover:bg-stone-700"
        >
          条件をリセット
        </button>
      </div>
    )
  }

  return (
    <>
      {monsters.map(monster => (
        <MonsterCard key={monster.monsterId || monster.name} monster={monster} />
      ))}
    </>
  )
}
