import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initCover() {
  // Điền tên từ hash base64: yoursite.com/#<base64(tên)>
  const hash = window.location.hash.slice(1)
  const recipient = document.getElementById('cover-recipient')
  if (recipient && hash) {
    try {
      // atob cho ra Latin-1 bytes — cần decode lại đúng UTF-8
      const bytes = Uint8Array.from(atob(hash), c => c.charCodeAt(0))
      recipient.textContent = new TextDecoder('utf-8').decode(bytes)
    } catch {
      // hash không hợp lệ — giữ nguyên placeholder
    }
  }

  // Cover text fade-in khi load + aurora blobs
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const toEl    = document.querySelector('.cover__to')
  const title   = document.querySelector('.cover__title')
  const salut   = document.querySelector('.cover__letter-salutation')
  const body    = document.querySelector('.cover__letter-body')

  if (!prefersReduced) {
    if (toEl)  gsap.from(toEl,  { opacity: 0, y: -18, duration: 1,   delay: 0.3, ease: 'power3.out' })
    if (title) gsap.from(title, { opacity: 0, y:  14, duration: 1,   delay: 0.6, ease: 'power3.out' })
    if (salut) gsap.from(salut, { opacity: 0, y:  12, duration: 0.9, delay: 0.5, ease: 'power3.out' })
    if (body)  gsap.from(body,  { opacity: 0, y:  10, duration: 0.9, delay: 0.8, ease: 'power3.out' })

    // Aurora blobs drift trên cover
    const cover = document.getElementById('page-cover')
    if (cover) {
      const blobs = cover.querySelectorAll('.aurora-blob')
      const movements = [
        { x:  50, y:  35, duration: 9  },
        { x: -45, y:  55, duration: 11 },
        { x:  35, y: -45, duration: 13 },
      ]
      blobs.forEach((blob, i) => {
        const m = movements[i] || movements[0]
        gsap.set(blob, { opacity: 0.14 })
        gsap.to(blob, { x: m.x, y: m.y, duration: m.duration, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      })
    }
  }

  // Scroll cue
  const cue = document.querySelector('.cover__scroll-cue')
  if (cue) {
    ScrollTrigger.create({
      trigger: '.page--cover',
      start: 'top top',
      end: '15% top',
      onLeave:     () => gsap.to(cue, { opacity: 0, duration: 0.4 }),
      onEnterBack: () => gsap.to(cue, { opacity: 1, duration: 0.4 }),
    })
  }

  // ── Snap kéo lên ──────────────────────────────────────────────
  if (prefersReduced) return

  const cover = document.getElementById('page-cover')
  if (!cover) return

  let isSnapping = false
  let touchStartY = 0

  function doSnap() {
    if (isSnapping) return
    isSnapping = true

    window.removeEventListener('wheel',      onWheel,      { passive: false })
    window.removeEventListener('touchstart', onTouchStart, { passive: true })
    window.removeEventListener('touchmove',  onTouchMove,  { passive: false })

    // Snap tới cuối Cover (offsetTop + height), không phải cứng 100vh
    const targetY = cover.offsetTop + cover.offsetHeight

    const proxy = { y: window.scrollY }
    gsap.to(proxy, {
      y: targetY,
      duration: 1.15,
      ease: 'back.out(1.6)',
      onUpdate() {
        window.scrollTo(0, proxy.y)
      },
      onComplete() {
        ScrollTrigger.refresh()
      },
    })
  }

  function onWheel(e) {
    // Chỉ kích hoạt khi Cover đang chiếm phần lớn viewport và cuộn xuống
    const rect = cover.getBoundingClientRect()
    if (rect.top < -window.innerHeight * 0.5) return
    if (e.deltaY <= 0) return
    e.preventDefault()
    doSnap()
  }

  function onTouchStart(e) {
    touchStartY = e.touches[0].clientY
  }

  function onTouchMove(e) {
    const rect = cover.getBoundingClientRect()
    if (rect.top < -window.innerHeight * 0.5) return
    const dy = touchStartY - e.touches[0].clientY
    if (dy < 10) return
    e.preventDefault()
    doSnap()
  }

  window.addEventListener('wheel',      onWheel,      { passive: false })
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchmove',  onTouchMove,  { passive: false })
}
