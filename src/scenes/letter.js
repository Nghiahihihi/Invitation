import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initLetter() {
  const page = document.getElementById('page-letter')
  if (!page) return

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Aurora blobs drift animation
  if (!prefersReduced) {
    const blobs = page.querySelectorAll('.aurora-blob')
    const movements = [
      { x: 60, y: 40, duration: 9  },
      { x: -50, y: 60, duration: 11 },
      { x: 40, y: -50, duration: 13 },
    ]
    blobs.forEach((blob, i) => {
      const m = movements[i] || movements[0]
      gsap.set(blob, { opacity: 0.18 })
      gsap.to(blob, {
        x: m.x,
        y: m.y,
        duration: m.duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })
  }

  // Letter content reveal on scroll
  const salutation = page.querySelector('.letter__salutation')
  const lines      = page.querySelectorAll('.letter__line')
  const sig        = page.querySelector('.letter__sig')

  const revealDefaults = {
    opacity: 0,
    y: 18,
    duration: 0.7,
    ease: 'power2.out',
  }

  if (salutation) {
    gsap.to(salutation, {
      ...revealDefaults,
      opacity: 1,
      y: 0,
      duration: 0.9,
      scrollTrigger: {
        trigger: page,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    })
  }

  if (lines.length) {
    gsap.to(lines, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.18,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: page,
        start: 'top 65%',
        toggleActions: 'play none none reverse',
      },
    })
  }

  if (sig) {
    gsap.to(sig, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: 0.55,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: page,
        start: 'top 60%',
        toggleActions: 'play none none reverse',
      },
    })
  }
}
