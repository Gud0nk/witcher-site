<script setup>
import { useLocale } from '../composables/useLocale'

const { t } = useLocale()
</script>

<template>
  <footer class="site-footer" aria-label="Спонсоры">
    <div class="footer-inner">
      <div class="footer-top">
        <p class="footer-find">{{ t('findUs') }}</p>
        <div class="footer-social" aria-label="Социальные сети">
          <a href="https://www.youtube.com/@Gud0nk290" class="social-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.6V8.4L16 12l-6.4 3.6Z"/>
            </svg>
          </a>
          <button class="social-link has-tip" type="button" aria-label="Telegram" data-tip="@gud0nk">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M21.4 4.3a1 1 0 0 0-1-.1L3.1 10.9a1 1 0 0 0 .1 1.9l4.1 1.4 1.6 5.1a1 1 0 0 0 1.8.3l2.3-3.1 3.9 2.9a1 1 0 0 0 1.6-.6l2.8-13.5a1 1 0 0 0-.3-1ZM9.8 16.8l-.8-2.6 7.9-6.9-6.2 7.7-.9 1.8Z"/>
            </svg>
          </button>
          <a href="https://vk.com/gutek290" class="social-link" aria-label="VK" target="_blank" rel="noopener noreferrer"><img src="/assets/sponsor/vk-gold.svg" alt="VK"></a>
          <button class="social-link has-tip" type="button" aria-label="Discord" data-tip="gutek228">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M20.3 4.4a16 16 0 0 0-4.1-1.3l-.2.4c-.1.4-.3.8-.4 1.2a15 15 0 0 0-7 0 13 13 0 0 0-.4-1.2l-.2-.4A16 16 0 0 0 3.8 4.4C1.3 8.1.7 11.7 1 15.2a16 16 0 0 0 5 2.6l.2-.3c.4-.5.7-1.1 1-1.7a10 10 0 0 1-1.6-.8l.4-.3c3.1 1.5 6.5 1.5 9.5 0l.4.3a10 10 0 0 1-1.6.8c.3.6.6 1.2 1 1.7l.2.3a16 16 0 0 0 5-2.6c.4-4-.7-7.6-3.2-10.8ZM8.8 13.2c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Zm6.4 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Z"/>
            </svg>
          </button>
        </div>
        <div class="footer-tech">
          <img src="https://www.cyberpunk.net/build/images/CDProjektRed-White-e4ac7847.svg" alt="CD PROJEKT RED">
          <img src="https://www.cyberpunk.net/build/images/footer/partners/nvidia-5a0ab065.svg" alt="NVIDIA">
          <img src="https://www.cyberpunk.net/build/images/footer/partners/amd-a823d277.svg" alt="AMD">
          <img class="age-img" src="https://common.cdn.cdpr.app/rating/f0c096183057e260495e0cb8d518fd18.svg" alt="18+">
        </div>
      </div>

      <div class="footer-links">
        <a href="#">{{ t('terms') }}</a>
        <a href="#">{{ t('privacy') }}</a>
        <a href="#">{{ t('career') }}</a>
        <a href="#">User Agreement</a>
        <a href="#">Content Guidelines</a>
        <a href="#">Cookie</a>
      </div>

      <div class="footer-bottom">
        <div class="footer-brand">
          <img src="https://www.cyberpunk.net/build/images/CDProjektRed-White-e4ac7847.svg" alt="CD PROJEKT RED">
        </div>
        <p class="footer-copy">{{ t('footerCopy') }}</p>
        <div class="footer-game">
          <img src="../../public/assets/logotype.png" alt="Ведьмак 3: Дикая Охота">
        </div>
      </div>
    </div>
  </footer>
</template>
