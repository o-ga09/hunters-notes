import type { MonsterResponseJson } from '@/services/api/generated/mhApi.schemas'
import type { Monster } from '@/lib/types'

/**
 * APIレスポンスのMonsterResponseJsonを内部のMonster型に変換
 */
export const convertApiMonsterToMonster = (apiMonster: MonsterResponseJson): Monster | null => {
  if (!apiMonster.name) return null

  // モンスターが持つ属性（APIから直接取得）
  const elements: string[] = []
  if (apiMonster.element) {
    elements.push(apiMonster.element)
  } else {
    // 属性情報がない場合は無属性
    elements.push('無')
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
    bgm: apiMonster.bgm?.map(b => ({
      name: b.name ?? '',
      url: b.url ?? '',
    })),
    ranking: apiMonster.ranking?.map(r => ({
      ranking: r.ranking ?? '',
      voteYear: r.vote_year ?? '',
    })),
    titles: apiMonster.title ?? [],
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
