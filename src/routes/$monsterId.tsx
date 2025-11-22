import { createFileRoute } from '@tanstack/react-router'
import { MonsterDetailPage } from '@/pages/MonsterDetailPage'

export const Route = createFileRoute('/$monsterId')({
  component: MonsterDetailPage,
})
