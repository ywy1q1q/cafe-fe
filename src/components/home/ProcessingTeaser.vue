<script setup lang="ts">
  import fermentationImage from '@/assets/processing/fermentation-24h.png'
</script>

<template>
  <section aria-labelledby="processing-teaser-title" class="processing-teaser">
    <div class="processing-teaser__inner">
      <div class="processing-teaser__copy">
        <p class="processing-teaser__eyebrow">PROCESSING</p>

        <h2 id="processing-teaser-title">
          Time shapes<br>the flavor.
        </h2>

        <p class="processing-teaser__lead">
          從果實發酵到乾燥處理，每一段時間都在重新書寫咖啡的香氣、甜感與層次。
        </p>

        <div aria-label="發酵時間範例" class="processing-teaser__times">
          <span>12h</span><i />
          <span>24h</span><i />
          <span>48h</span><i />
          <span>72h</span>
        </div>

        <RouterLink class="processing-teaser__link" to="/processing">
          探索咖啡處理法
          <span aria-hidden="true">↗</span>
        </RouterLink>
      </div>

      <RouterLink
        aria-label="前往咖啡發酵與處理法介紹"
        class="processing-teaser__visual"
        to="/processing"
      >
        <img alt="咖啡發酵罐與果實" :src="fermentationImage">

        <div class="processing-teaser__stamp">
          <strong>24h</strong>
          <span>Balanced & Sweet</span>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.processing-teaser {
  background: var(--home-bg, #fdf0d1);
  border-top: 1px solid var(--story-line, rgb(111 78 55 / 14%));
  margin-left: calc(50% - 50vw);
  padding: clamp(76px, 9vw, 126px) max(24px, calc((100vw - 1320px) / 2));
  width: 100vw;
}

.processing-teaser__inner {
  align-items: center;
  display: grid;
  gap: clamp(48px, 7vw, 108px);
  grid-template-columns: minmax(280px, 0.72fr) minmax(0, 1.28fr);
  margin-inline: auto;
  max-width: 1320px;
}

.processing-teaser__eyebrow {
  color: var(--story-accent, #9b643c);
  font-size: 0.72rem;
  font-weight: 750;
  letter-spacing: 0.22em;
  margin: 0 0 18px;
}

.processing-teaser h2 {
  color: var(--story-ink, #3f3027);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(4rem, 7vw, 7.6rem);
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 0.76;
  margin: 0;
}

.processing-teaser__lead {
  color: var(--story-muted, #806b5c);
  font-family: "Noto Sans TC", sans-serif;
  line-height: 1.9;
  margin: 34px 0 0;
  max-width: 32rem;
}

.processing-teaser__times {
  align-items: center;
  color: var(--story-primary, #6f4e37);
  display: flex;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 1.1rem;
  gap: 10px;
  margin-top: 28px;
}

.processing-teaser__times i {
  background: var(--story-line, rgb(111 78 55 / 18%));
  height: 1px;
  width: 22px;
}

.processing-teaser__link {
  align-items: center;
  color: var(--story-primary, #6f4e37);
  display: inline-flex;
  font-size: 0.84rem;
  font-weight: 700;
  gap: 10px;
  letter-spacing: 0.08em;
  margin-top: 36px;
  padding-bottom: 7px;
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}

.processing-teaser__link span {
  font-size: 1.05rem;
  transition: transform 180ms ease;
}

.processing-teaser__link:hover span,
.processing-teaser__link:focus-visible span {
  transform: translate(3px, -3px);
}

.processing-teaser__visual {
  aspect-ratio: 1.32 / 1;
  border-radius: 50% 50% 18px 18px / 44% 44% 18px 18px;
  display: block;
  overflow: hidden;
  position: relative;
}

.processing-teaser__visual::after {
  background: linear-gradient(to top, rgb(35 20 12 / 62%), transparent 56%);
  content: "";
  inset: 0;
  position: absolute;
}

.processing-teaser__visual:focus-visible {
  outline: 3px solid var(--story-primary, #6f4e37);
  outline-offset: 4px;
}

.processing-teaser__visual img {
  display: block;
  height: 100%;
  object-fit: cover;
  transition: transform 700ms ease;
  width: 100%;
}

.processing-teaser__visual:hover img {
  transform: scale(1.025);
}

.processing-teaser__stamp {
  bottom: 8%;
  color: #fffaf3;
  left: 8%;
  position: absolute;
  z-index: 1;
}

.processing-teaser__stamp strong {
  display: block;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(3.5rem, 6vw, 6rem);
  font-weight: 400;
  line-height: 0.8;
}

.processing-teaser__stamp span {
  color: #efc58d;
  display: block;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(1.2rem, 2vw, 1.8rem);
  margin-top: 14px;
}

@media (max-width: 800px) {
  .processing-teaser {
    padding-inline: 20px;
  }

  .processing-teaser__inner {
    grid-template-columns: 1fr;
  }

  .processing-teaser__visual {
    aspect-ratio: 1 / 1.05;
    border-radius: 50% 50% 16px 16px / 35% 35% 16px 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .processing-teaser__link span,
  .processing-teaser__visual img {
    transition: none;
  }
}
</style>
