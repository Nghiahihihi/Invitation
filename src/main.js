import { gsap } from 'gsap'
import './style.css'
import { initCover }  from './scenes/cover.js'
import { initPoster } from './scenes/poster.js'
import { initRsvp }   from './scenes/rsvp.js'

// Painting không phải trang điều hướng — luôn fixed ở nền
const PAGE_IDS = ['page-cover', 'page-painting', 'page-poster', 'page-rsvp']
let current = 0
let isAnimating = false

function getPage(i) {
  return document.getElementById(PAGE_IDS[i])
}

// Reset inline GSAP state trước khi animate vào trang
function resetPage(el) {
  gsap.set(el.querySelectorAll('.poster__card, .poster__detail-row, .paper-sheet, .rsvp__inner'), {
    clearProps: 'all'
  })
}

// ── Transition ────────────────────────────────────────────────────
function goTo(next) {
  if (isAnimating || next === current || next < 0 || next >= PAGE_IDS.length) return
  isAnimating = true

  const outEl = getPage(current)
  const inEl  = getPage(next)
  const dir   = next > current ? 1 : -1

  const outIsCover    = PAGE_IDS[current] === 'page-cover'
  const inIsPainting  = PAGE_IDS[next]    === 'page-painting'
  const outIsPainting = PAGE_IDS[current] === 'page-painting'
  const inIsCover     = PAGE_IDS[next]    === 'page-cover'

  resetPage(inEl)

  const tl = gsap.timeline({
    onComplete() {
      // Ẩn cover sau khi trượt lên (không ẩn painting)
      if (!outIsPainting) {
        outEl.classList.remove('is-active')
        gsap.set(outEl, { display: 'none', yPercent: 0, opacity: 1 })
      }
      current = next
      isAnimating = false
      updateNav()
    }
  })

  // Cover → Painting: cover trượt lên, painting lộ ra
  if (outIsCover && inIsPainting) {
    tl.to(outEl, { yPercent: -100, duration: 0.7, ease: 'power2.inOut' }, 0)
    return
  }

  // Painting → Cover: cover trượt xuống vào
  if (outIsPainting && inIsCover) {
    gsap.set(inEl, { yPercent: -100, display: 'flex', opacity: 1 })
    inEl.classList.add('is-active')
    tl.to(inEl, { yPercent: 0, duration: 0.7, ease: 'power2.inOut' }, 0)
    return
  }

  // Poster/RSVP → Painting: trang hiện tại trượt xuống, painting lộ ra
  if (inIsPainting) {
    tl.to(outEl, { yPercent: 100, duration: 0.7, ease: 'power2.inOut' }, 0)
    return
  }

  // Painting → Poster/RSVP: fade + slide thường (giữ nguyên cũ)
  if (outIsPainting) {
    gsap.set(inEl, { yPercent: 6, opacity: 0, display: 'flex' })
    inEl.classList.add('is-active')
    triggerEnter(next)
    tl.to(inEl, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0)
    return
  }

  // Các trang khác: fade + slide thường
  if (!inIsPainting) {
    gsap.set(inEl, { yPercent: dir * 6, opacity: 0, display: 'flex' })
    inEl.classList.add('is-active')
    triggerEnter(next)

    if (!outIsPainting) {
      tl.to(outEl, { yPercent: -dir * 5, opacity: 0, duration: 0.4, ease: 'power2.in' }, 0)
    }
    tl.to(inEl, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, outIsPainting ? 0 : 0.1)
  }
}

// ── Enter animations ──────────────────────────────────────────────
function triggerEnter(index) {
  if (index === 2) {
    const card = document.querySelector('.poster__card')
    if (card) {
      gsap.fromTo(card,
        { scale: 0.93, opacity: 0, y: 28 },
        { scale: 1, opacity: 1, y: 0, duration: 0.65, ease: 'back.out(1.4)' }
      )
    }
    gsap.fromTo('.poster__detail-row',
      { x: 16, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.09, duration: 0.45, delay: 0.25, ease: 'power2.out' }
    )
  }
  if (index === 3) {
    const sheet = document.querySelector('.page--rsvp .paper-sheet')
    if (sheet) {
      gsap.fromTo(sheet,
        { clipPath: 'inset(0 0 100% 0)', boxShadow: 'none' },
        { clipPath: 'inset(0 0 0% 0)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', duration: 0.7, ease: 'power2.inOut' }
      )
    }
    const inner = document.querySelector('.rsvp__inner')
    if (inner) gsap.fromTo(inner, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: 'power2.out' })
  }
}

// ── Nav ───────────────────────────────────────────────────────────
function updateNav() {
  document.querySelectorAll('.nav-dot').forEach((d, i) => {
    d.classList.toggle('is-active', i === current)
    d.setAttribute('aria-current', i === current ? 'true' : 'false')
  })
  const prev = document.getElementById('nav-prev')
  const next = document.getElementById('nav-next')
  prev.style.opacity = current === 0 ? '0' : '1'
  prev.style.pointerEvents = current === 0 ? 'none' : 'auto'
  next.style.opacity = current === PAGE_IDS.length - 1 ? '0' : '1'
  next.style.pointerEvents = current === PAGE_IDS.length - 1 ? 'none' : 'auto'
}

function buildNav() {
  const nav = document.createElement('nav')
  nav.className = 'page-nav'
  nav.setAttribute('aria-label', 'Page navigation')

  const prev = document.createElement('button')
  prev.id = 'nav-prev'
  prev.className = 'nav-arrow nav-arrow--prev'
  prev.setAttribute('aria-label', 'Previous page')
  prev.innerHTML = '&#8593;'
  prev.addEventListener('click', () => goTo(current - 1))

  const dots = document.createElement('div')
  dots.className = 'nav-dots'
  PAGE_IDS.forEach((_, i) => {
    const dot = document.createElement('button')
    dot.className = 'nav-dot'
    dot.setAttribute('aria-label', `Page ${i + 1}`)
    dot.setAttribute('aria-current', 'false')
    dot.addEventListener('click', () => goTo(i))
    dots.appendChild(dot)
  })

  const next = document.createElement('button')
  next.id = 'nav-next'
  next.className = 'nav-arrow nav-arrow--next'
  next.setAttribute('aria-label', 'Next page')
  next.innerHTML = '&#8595;'
  next.addEventListener('click', () => goTo(current + 1))

  nav.appendChild(prev)
  nav.appendChild(dots)
  nav.appendChild(next)
  document.body.appendChild(nav)
}

// ── Keyboard + Swipe ──────────────────────────────────────────────
function initKeyboard() {
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goTo(current + 1)
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  goTo(current - 1)
  })
}

function initSwipe() {
  let startY = 0
  window.addEventListener('touchstart', e => { startY = e.touches[0].clientY }, { passive: true })
  window.addEventListener('touchend', e => {
    const dy = startY - e.changedTouches[0].clientY
    if (Math.abs(dy) < 40) return
    dy > 0 ? goTo(current + 1) : goTo(current - 1)
  }, { passive: true })
}

// ── Init ──────────────────────────────────────────────────────────
function init() {
  document.fonts.ready.then(() => {
    PAGE_IDS.forEach((id, i) => {
      const el = document.getElementById(id)
      if (!el) return
      if (id === 'page-painting') return  // luôn fixed ở nền, không JS-manage
      if (i === 0) {
        el.classList.add('is-active')
        gsap.set(el, { display: 'flex' })
      } else {
        gsap.set(el, { display: 'none', opacity: 0 })
      }
    })

    buildNav()
    updateNav()
    initKeyboard()
    initSwipe()
    initCover()
    initPoster()
    initRsvp()
  })
}

init()
