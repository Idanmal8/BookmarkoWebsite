import { onMounted, onBeforeUnmount } from 'vue'

export function useReveal() {
  let io: IntersectionObserver | null = null

  onMounted(() => {
    const els = document.querySelectorAll('[data-reveal]:not(.is-revealed)')
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach((el) => el.classList.add('is-revealed'))
      return
    }
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed')
            io?.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15 },
    )
    els.forEach((el) => io!.observe(el))
  })

  onBeforeUnmount(() => {
    io?.disconnect()
    io = null
  })
}
