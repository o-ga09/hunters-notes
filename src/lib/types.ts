export enum ElementType {
  FIRE = 'Fire',
  WATER = 'Water',
  THUNDER = 'Thunder',
  ICE = 'Ice',
  DRAGON = 'Dragon',
  NONE = 'None',
  POISON = 'Poison',
  SLEEP = 'Sleep',
  PARALYSIS = 'Paralysis',
  BLAST = 'Blast',
}

export interface Weakness {
  element: string
  stars: number // 1-3 stars usually
}

export interface DropItem {
  name: string
  rarity: number // 1-10
}

export interface BGM {
  name: string
  url: string
}

export interface Ranking {
  ranking: string
  voteYear: string
}

export interface Monster {
  name: string
  title: string // e.g. "King of the Skies"
  species: string // e.g. "Flying Wyvern"
  description: string
  elements: string[]
  ailments: string[]
  weaknesses: Weakness[]
  habitats: string[]
  threatLevel: number // 1-10
  size: {
    min: number
    max: number
  }
  keyDrops: DropItem[]
  tips: string[]
  imageUrl?: string
  monsterId?: string
  bgm?: BGM[]
  ranking?: Ranking[]
}
