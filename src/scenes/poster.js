import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initPoster() {
  const sheet   = document.querySelector('.page--poster .paper-sheet')
  const photo   = document.querySelector('.poster__photo-side')
  const info    = document.querySelector('.poster__info-side')
  if (!sheet) return

  gsap.from(sheet, {
    yPercent: 10,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.page--poster',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  })

  // Ảnh slide từ trái, info từ phải — spring mạnh hơn
  if (photo) {
    gsap.from(photo, {
      xPercent: -12,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: '.poster__frame',
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    })
  }
  if (info) {
    gsap.from(info, {
      xPercent: 12,
      opacity: 0,
      duration: 1,
      delay: 0.1,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: '.poster__frame',
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    })
  }

  // Heading stagger riêng — tên xuất hiện trước
  const headings = document.querySelectorAll('.poster__label, .poster__event, .poster__name')
  if (headings.length) {
    gsap.from(headings, {
      opacity: 0,
      y: 10,
      stagger: 0.12,
      duration: 0.55,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.poster__info-side',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })
  }

  // Detail rows stagger với spring
  gsap.from('.poster__detail-row', {
    xPercent: 14,
    opacity: 0,
    stagger: 0.12,
    duration: 0.6,
    ease: 'back.out(1.6)',
    scrollTrigger: {
      trigger: '.poster__details',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  })
}
