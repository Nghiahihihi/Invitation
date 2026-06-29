import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initPainting() {
  const cue = document.querySelector('.cover__scroll-cue')
  if (!cue) return

  ScrollTrigger.create({
    trigger: '.page--painting',
    start: 'top 60%',
    onEnter: () => gsap.to(cue, { opacity: 0, duration: 0.4 }),
    onLeaveBack: () => gsap.to(cue, { opacity: 1, duration: 0.4 }),
  })
}
