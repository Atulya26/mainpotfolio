// Minimal split-text helper: wraps each word in a mask span + inner span.
// Avoids paid GSAP SplitText; good enough for a reveal animation.
export class SplitText {
  constructor(el) {
    this.el = el
    this.words = []
    const text = el.textContent
    el.textContent = ''
    text.split(/(\s+)/).forEach((chunk) => {
      if (!chunk) return
      if (/^\s+$/.test(chunk)) {
        el.appendChild(document.createTextNode(chunk))
        return
      }
      const mask = document.createElement('span')
      mask.className = 'split-mask'
      const inner = document.createElement('span')
      inner.className = 'split-inner'
      inner.textContent = chunk
      mask.appendChild(inner)
      el.appendChild(mask)
      this.words.push(inner)
    })
  }
}
