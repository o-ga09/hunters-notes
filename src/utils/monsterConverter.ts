import type { MonsterResponseJson } from '@/services/api/generated/mhApi.schemas'
import type { Monster } from '@/lib/types'

/**
 * APIレスポンスのMonsterResponseJsonを内部のMonster型に変換
 */
export const convertApiMonsterToMonster = (apiMonster: MonsterResponseJson): Monster | null => {
  if (!apiMonster.name) return null

  // 属性をマッピング
  const elements: string[] = []
  if (apiMonster.first_weak_element) {
    elements.push(apiMonster.first_weak_element)
  }
  if (
    apiMonster.second_weak_element &&
    apiMonster.second_weak_element !== apiMonster.first_weak_element
  ) {
    elements.push(apiMonster.second_weak_element)
  }

  // 弱点をマッピング
  const weaknesses = []
  if (apiMonster.first_weak_element) {
    weaknesses.push({
      element: apiMonster.first_weak_element,
      stars: 3,
    })
  }
  if (
    apiMonster.second_weak_element &&
    apiMonster.second_weak_element !== apiMonster.first_weak_element
  ) {
    weaknesses.push({
      element: apiMonster.second_weak_element,
      stars: 2,
    })
  }

  return {
    name: apiMonster.name,
    title: apiMonster.another_name ?? '未知のモンスター',
    species: apiMonster.category ?? '不明',
    description: `${apiMonster.another_name ?? ''}として知られるモンスター。`,
    elements,
    ailments: [],
    weaknesses,
    habitats: apiMonster.location ?? [],
    threatLevel: 5, // デフォルト値
    size: { min: 1000, max: 2000 }, // デフォルト値
    keyDrops: [],
    tips: [],
    imageUrl: apiMonster.image_url,
    monsterId: apiMonster.monster_id,
  }
}

/**
 * 複数のAPIモンスターを変換
 */
export const convertApiMonstersToMonsters = (apiMonsters?: MonsterResponseJson[]): Monster[] => {
  if (!apiMonsters) return []

  return apiMonsters
    .map(convertApiMonsterToMonster)
    .filter((monster): monster is Monster => monster !== null)
}
