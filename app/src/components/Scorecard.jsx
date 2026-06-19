import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const ROWS = [
  { label: 'Hallucination', v: 67 },
  { label: 'Prompt injection', v: 100 },
  { label: 'PII leakage', v: 100 },
  { label: 'Out-of-scope', v: 0 },
  { label: 'Brand / tone', v: 50 },
]

function barColor(v) {
  if (v >= 90) return 'var(--color-accent)'
  if (v >= 40) return 'var(--color-warn)'
  return 'var(--color-fail)'
}

export default function Scorecard() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const active = inView || reduce
  const [pct, setPct] = useState(reduce ? 60 : 0)

  useEffect(() => {
    if (!inView || reduce) return
    let raf, start
    const dur = 1100
    const tick = (t) => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / dur)
      setPct(Math.round(p * 60))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce])

  return (
    <div ref={ref} className="rounded-[18px] border border-line bg-surface p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_70px_-40px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between mb-1">
        <span className="mono text-[13px] text-low">support-assistant · reliability scorecard</span>
        <span className="mono font-semibold px-3 py-1 rounded-lg bg-fail/12 text-fail border border-fail/30">GRADE F</span>
      </div>
      <div className="text-[46px] font-bold tracking-tight tabular-nums">
        {pct}<span className="text-[22px] text-mid font-medium">% pass</span>
      </div>
      <div className="mt-3 space-y-3">
        {ROWS.map((row) => (
          <div key={row.label} className="grid grid-cols-[130px_1fr_44px] items-center gap-3 text-[13px]">
            <span className="text-mid">{row.label}</span>
            <span className="h-2.5 rounded-md bg-white/[0.06] overflow-hidden">
              <motion.span
                className="block h-full rounded-md"
                style={{ background: barColor(row.v) }}
                initial={{ width: 0 }}
                animate={{ width: active ? `${row.v}%` : 0 }}
                transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
              />
            </span>
            <span className="mono text-right text-mid">{row.v}%</span>
          </div>
        ))}
      </div>
      <div className="mt-3.5 pt-3 border-t border-dashed border-line mono text-[12.5px]">
        <span className="text-fail font-semibold">✗ CRITICAL</span>{' '}
        <span className="text-low">— fabricated a QuickBooks integration that doesn't exist.</span>
      </div>
    </div>
  )
}
