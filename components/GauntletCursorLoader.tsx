'use client'

import dynamic from 'next/dynamic'

const GauntletCursor = dynamic(() => import('./GauntletCursor'), { ssr: false })

export default function GauntletCursorLoader() {
  return <GauntletCursor />
}
