import { createFileRoute } from '@tanstack/react-router'
import { MonsterListPage } from '@/pages/MonsterListPage'
import { z } from 'zod'

const searchSchema = z.object({
  page: z.number().int().positive().optional().catch(1),
})

export const Route = createFileRoute('/')({
  component: MonsterListPage,
  validateSearch: searchSchema,
})
