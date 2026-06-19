import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const VERT = `attribute vec2 uv; attribute vec2 position; varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`

const FRAG = `precision highp float; varying vec2 vUv; uniform float uTime;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p);
  float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
  vec2 u=f*f*(3.-2.*f); return mix(mix(a,b,u.x), mix(c,d,u.x), u.y); }
float fbm(vec2 p){ return 0.62*noise(p) + 0.38*noise(p*2.1+10.0); }
void main(){
  vec2 uv = vUv; uv.x += uv.y * 0.2;
  vec2 p = uv * 2.2; float t = uTime * 0.06;
  float n1 = fbm(p + vec2(t, t*0.5));
  float n2 = fbm(p*1.3 - vec2(t*0.7, t));
  vec3 violet = vec3(0.30,0.18,0.55), cyan = vec3(0.10,0.55,0.50), base = vec3(0.02,0.02,0.05);
  vec3 col = base;
  col += violet * smoothstep(0.38, 0.92, n1) * 0.95;
  col += cyan   * smoothstep(0.45, 0.96, n2) * 0.70;
  float fall = smoothstep(1.1, 0.2, length(vUv - 0.5));
  col *= fall;
  gl_FragColor = vec4(col, 1.0);
}`

export default function ShaderBg() {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce || window.innerWidth < 720) return
    const canvas = ref.current
    if (!canvas) return
    let raf = null, visible = true, renderer, program, mesh, io, cleanup = () => {}

    let cancelled = false
    ;(async () => {
      try {
        const { Renderer, Triangle, Program, Mesh } = await import('ogl')
        if (cancelled) return
        renderer = new Renderer({ canvas, dpr: Math.min(window.devicePixelRatio, 2), alpha: true })
        const gl = renderer.gl
        program = new Program(gl, { vertex: VERT, fragment: FRAG, uniforms: { uTime: { value: 0 } } })
        mesh = new Mesh(gl, { geometry: new Triangle(gl), program })
        const parent = canvas.parentElement
        const resize = () => renderer.setSize(parent.clientWidth, parent.clientHeight)
        resize()
        window.addEventListener('resize', resize)
        const loop = (t) => { program.uniforms.uTime.value = t * 0.001; renderer.render({ scene: mesh }); raf = requestAnimationFrame(loop) }
        const play = () => { if (raf == null && visible && !document.hidden) raf = requestAnimationFrame(loop) }
        const stop = () => { if (raf != null) { cancelAnimationFrame(raf); raf = null } }
        io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; visible ? play() : stop() })
        io.observe(parent)
        const onVis = () => (document.hidden ? stop() : play())
        document.addEventListener('visibilitychange', onVis)
        play()
        cleanup = () => {
          stop(); io.disconnect(); window.removeEventListener('resize', resize)
          document.removeEventListener('visibilitychange', onVis)
          const ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext()
        }
      } catch (e) { /* CSS fallback (.hero-fallback) stays visible */ }
    })()

    return () => { cancelled = true; cleanup() }
  }, [reduce])

  return <canvas ref={ref} className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />
}
