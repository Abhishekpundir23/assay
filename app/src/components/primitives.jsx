import { motion, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

const EASE = [0.22, 0.61, 0.36, 1]

// Scroll-reveal wrapper. Respects prefers-reduced-motion (renders visible, no motion).
export function Reveal({ children, delay = 0, y = 24, className = '', as = 'div' }) {
  const reduce = useReducedMotion()
  const M = motion[as] || motion.div
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </M>
  )
}

// Staggered container + item (for bento / lists).
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
export const riseItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

// Magnetic CTA — translates toward the cursor, springs back on leave. No-op when reduced motion / touch.
export function MagneticButton({ href, children, className = '', primary = true }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  function onMove(e) {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.25 - 2}px)`
  }
  function onLeave() { if (ref.current) ref.current.style.transform = '' }
  const base = primary
    ? 'bg-accent text-[#04130f] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18),0_0_28px_rgba(61,245,208,0.45),0_8px_24px_rgba(20,200,168,0.35)]'
    : 'bg-transparent text-ink border border-line hover:border-linestrong hover:bg-white/[0.04]'
  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold transition-[transform,box-shadow] duration-150 will-change-transform ${base} ${className}`}
    >
      {children}
    </a>
  )
}

// Cursor-spotlight card wrapper.
export function SpotlightCard({ children, className = '' }) {
  const ref = useRef(null)
  function onMove(e) {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div ref={ref} onMouseMove={onMove} className={`spotlight relative overflow-hidden ${className}`}>
      {children}
    </div>
  )
}
