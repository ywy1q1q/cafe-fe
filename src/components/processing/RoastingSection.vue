<script setup lang="ts">
  import darkRoastImage from '@/assets/processing/coffee-dark-roast-closeup.png'
  import lightRoastImage from '@/assets/processing/coffee-light-roast-closeup.png'
  import mediumRoastImage from '@/assets/processing/coffee-medium-roast-closeup.png'
  import roastingImage from '@/assets/processing/coffee-roasting-process.png'

  interface RoastLevel {
    alt: string
    flavors: string
    image: string
    label: string
    title: string
  }

  const roastLevels: RoastLevel[] = [
    {
      alt: '淺焙咖啡豆近照',
      flavors: '花香・柑橘・明亮',
      image: lightRoastImage,
      label: 'LIGHT',
      title: '淺焙',
    },
    {
      alt: '中焙咖啡豆近照',
      flavors: '焦糖・堅果・平衡',
      image: mediumRoastImage,
      label: 'MEDIUM',
      title: '中焙',
    },
    {
      alt: '深焙咖啡豆近照',
      flavors: '可可・焦糖・厚實',
      image: darkRoastImage,
      label: 'DARK',
      title: '深焙',
    },
  ]
</script>

<template>
  <section id="roasting" aria-labelledby="roasting-title" class="roasting-section">
    <div class="roasting-section__media">
      <img
        alt="烘豆機中翻動的咖啡豆"
        decoding="async"
        height="1086"
        loading="lazy"
        :src="roastingImage"
        width="1448"
      >
    </div>

    <div class="roasting-section__content">
      <p class="roasting-section__eyebrow">05&nbsp;&nbsp;ROASTING</p>

      <h2 id="roasting-title" class="roasting-section__title">
        火候，決定最後的風味輪廓
      </h2>

      <p class="roasting-section__description">
        烘焙不只是讓咖啡豆變深，也會重新塑造酸質、甜感與香氣的平衡。
      </p>

      <div aria-label="三種咖啡烘焙程度" class="roast-levels">
        <article
          v-for="level in roastLevels"
          :key="level.label"
          class="roast-level"
        >
          <div class="roast-level__image-wrap">
            <img
              :alt="level.alt"
              decoding="async"
              height="1086"
              loading="lazy"
              :src="level.image"
              width="1448"
            >
          </div>

          <h3>
            {{ level.title }}
            <span>{{ level.label }}</span>
          </h3>
          <p>{{ level.flavors }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.roasting-section {
  background: rgb(36 22 14 / 20%);
  border-top: 1px solid var(--journey-line, rgb(248 236 211 / 14%));
  color: var(--journey-light, #f8ecd3);
  display: grid;
  grid-template-columns: 44% 56%;
  min-height: 520px;
}

.roasting-section__media {
  min-height: 520px;
  overflow: hidden;
}

.roasting-section__media img {
  display: block;
  height: 100%;
  object-fit: cover;
  object-position: 54% center;
  width: 100%;
}

.roasting-section__content {
  align-self: center;
  min-width: 0;
  padding: clamp(48px, 5vw, 80px) clamp(40px, 6vw, 96px);
}

.roasting-section__eyebrow {
  color: #d7a06b;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  margin: 0 0 20px;
}

.roasting-section__title {
  color: var(--journey-light, #f8ecd3);
  font-family: "Noto Sans TC", sans-serif;
  font-size: clamp(2rem, 3.25vw, 3.5rem);
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 1.25;
  margin: 0;
  white-space: nowrap;
}

.roasting-section__description {
  color: var(--journey-light-muted, rgb(248 236 211 / 78%));
  font-family: "Noto Sans TC", sans-serif;
  font-size: 0.95rem;
  line-height: 1.85;
  margin: 22px 0 0;
  max-width: 34rem;
}

.roast-levels {
  display: grid;
  gap: clamp(14px, 2vw, 28px);
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: clamp(32px, 4vw, 52px);
}

.roast-level {
  min-width: 0;
  text-align: center;
}

.roast-level__image-wrap {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.roast-level__image-wrap img {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.roast-level h3 {
  color: var(--journey-light, #f8ecd3);
  font-family: "Noto Sans TC", sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.4;
  margin: 14px 0 0;
}

.roast-level h3 span {
  color: #d7a06b;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  margin-left: 5px;
}

.roast-level p {
  color: var(--journey-light-muted, rgb(248 236 211 / 78%));
  font-size: 0.75rem;
  line-height: 1.55;
  margin: 7px 0 0;
}

@media (max-width: 980px) {
  .roasting-section {
    grid-template-columns: 42% 58%;
  }

  .roasting-section__content {
    padding: 44px 32px;
  }

  .roast-levels {
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .roasting-section {
    grid-template-columns: 1fr;
    min-height: 0;
  }

  .roasting-section__media {
    aspect-ratio: 4 / 3;
    min-height: 0;
  }

  .roasting-section__content {
    padding: 42px 24px 48px;
  }

  .roasting-section__title {
    font-size: clamp(2.15rem, 9vw, 3rem);
    white-space: normal;
  }
}

@media (max-width: 480px) {
  .roast-levels {
    gap: 8px;
  }

  .roast-level h3 {
    font-size: 0.78rem;
  }

  .roast-level h3 span {
    display: block;
    margin: 2px 0 0;
  }

  .roast-level p {
    font-size: 0.68rem;
  }
}
</style>
