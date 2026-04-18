import { onBeforeUnmount, onMounted } from 'vue'

export const useReveal = (selector = '.reveal-item') => {
  let observer

  onMounted(() => {
    const items = Array.from(document.querySelectorAll(selector))
    if (!items.length) {
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -10% 0px' }
    )

    items.forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${Math.min(index * 28, 220)}ms`)
      observer.observe(item)
    })
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })
}

export const useCursorSpark = () => {
  const cleanup = []

  onMounted(() => {
    const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!desktopPointer || document.querySelector('.cursor-dot')) {
      return
    }

    const dot = document.createElement('div')
    dot.className = 'cursor-dot'

    const spark = document.createElement('div')
    spark.className = 'cursor-spark'

    document.body.append(dot, spark)

    const onMove = (e) => {
      dot.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`
      dot.classList.add('is-visible')
    }

    const onLeave = () => dot.classList.remove('is-visible')

    const onDown = (e) => {
      spark.style.left = `${e.clientX}px`
      spark.style.top = `${e.clientY}px`
      spark.classList.remove('animate')
      void spark.offsetWidth
      spark.classList.add('animate')
    }

    const interactiveSelector = 'a,button,input,select,textarea,.gallery-slide img,.gallery-arrow,.hero-tab,.card,.slide'

    const onOver = (e) => {
      if (e.target.closest(interactiveSelector)) {
        dot.classList.add('is-hover')
      }
    }

    const onOut = (e) => {
      if (e.target.closest(interactiveSelector)) {
        dot.classList.remove('is-hover')
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('blur', onLeave)
    window.addEventListener('mousedown', onDown)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    cleanup.push(() => window.removeEventListener('mousemove', onMove))
    cleanup.push(() => window.removeEventListener('mouseleave', onLeave))
    cleanup.push(() => window.removeEventListener('blur', onLeave))
    cleanup.push(() => window.removeEventListener('mousedown', onDown))
    cleanup.push(() => document.removeEventListener('mouseover', onOver))
    cleanup.push(() => document.removeEventListener('mouseout', onOut))
  })

  onBeforeUnmount(() => {
    cleanup.forEach((fn) => fn())
  })
}
