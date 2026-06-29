import { RSVP_SCRIPT_URL } from '../rsvp-config.js'

export function initRsvp() {
  const form      = document.getElementById('rsvp-form')
  const toggles   = document.querySelectorAll('.rsvp__toggle')
  const hidden    = document.getElementById('rsvp-attending')
  const submitBtn = document.getElementById('rsvp-submit')
  const successEl = document.getElementById('rsvp-success')
  const errorEl   = document.getElementById('rsvp-error')
  const displayName = document.getElementById('rsvp-display-name')

  if (!form) return

  // Lấy tên từ trang 1
  const recipientEl = document.getElementById('cover-recipient')
  const name = recipientEl?.textContent?.trim() || ''
  if (displayName && name && name !== 'Họ Tên') {
    displayName.textContent = name
    displayName.hidden = false
  }

  // Toggle yes/no
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      toggles.forEach(b => {
        b.classList.remove('is-active')
        b.setAttribute('aria-pressed', 'false')
      })
      btn.classList.add('is-active')
      btn.setAttribute('aria-pressed', 'true')
      hidden.value = btn.dataset.value
    })
  })

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const attending = hidden.value
    if (!attending) {
      toggles[0]?.focus()
      return
    }

    submitBtn.disabled = true
    submitBtn.querySelector('.rsvp__submit-text').hidden = true
    submitBtn.querySelector('.rsvp__submit-loading').hidden = false
    if (errorEl) errorEl.hidden = true

    const payload = {
      name: btoa(String.fromCharCode(...new TextEncoder().encode(name))),  // UTF-8 → base64
      attending,
      timestamp: new Date().toISOString()
    }

    try {
      if (!RSVP_SCRIPT_URL) {
        console.log('[RSVP dev] payload:', payload)
        await new Promise(r => setTimeout(r, 600))
      } else {
        await fetch(RSVP_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      form.hidden = true
      if (successEl) successEl.hidden = false
    } catch {
      submitBtn.disabled = false
      submitBtn.querySelector('.rsvp__submit-text').hidden = false
      submitBtn.querySelector('.rsvp__submit-loading').hidden = true
      if (errorEl) errorEl.hidden = false
    }
  })
}
