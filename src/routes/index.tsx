import { createFileRoute } from '@tanstack/react-router'
import { MonsterListPage } from '@/pages/MonsterListPage'

export const Route = createFileRoute('/')({
  component: MonsterListPage,
})
