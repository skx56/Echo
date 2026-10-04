import type { Metadata } from 'next'
import GrainApp from '@/components/grain/GrainApp'

export const metadata: Metadata = {
  title: 'Grain — SQL agent that shows its work',
  description:
    'Grain answers business questions over a messy ledger only after it locks the metric, the join path, and the grain. It runs SQLite in the browser.',
}

export default function GrainPage() {
  return <GrainApp />
}
