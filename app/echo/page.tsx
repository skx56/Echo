import type { Metadata } from 'next'
import EchoApp from '@/components/echo/EchoApp'

export const metadata: Metadata = {
  title: 'Echo — Real-Time Voice Agent',
  description:
    'Duplex voice runtime with barge-in, cancellable tool calls, Twilio media-stream control, TTFA percentiles, and a Hinglish task bench.',
}

export default function EchoPage() {
  return <EchoApp />
}
