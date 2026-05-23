import ForexTracker from './apps/ForexTracker'
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <ForexTracker />
      <Analytics />
    </div>
  )
}
