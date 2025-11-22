import { useGetMonsters } from '@/services/api/generated/モンスター検索/モンスター検索'
import type { GetMonstersParams } from '@/services/api/generated/mhApi.schemas'

export const useMonsters = (params?: GetMonstersParams) => {
  const { data, isLoading, error, refetch } = useGetMonsters(params, {
    query: {
      staleTime: 10 * 60 * 1000, // 10分間キャッシュ
      refetchOnMount: false,
    },
  })

  return {
    monsters: data?.monsters ?? [],
    total: data?.total ?? 0,
    limit: data?.limit ?? 0,
    offset: data?.offset ?? 0,
    isLoading,
    error,
    refetch,
  }
}
