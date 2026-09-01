<script setup lang="ts">
  import harvestImg from '@/assets/coffee-origin/01-harvest.png'
  import fermentationImg from '@/assets/coffee-origin/02-fermentation.png'
  import washingImg from '@/assets/coffee-origin/03-Washing.png'
  import roastImg from '@/assets/coffee-origin/04-roast.png'

  const items = [
    {
      number: '01',
      title: 'Harvest',
      zhTitle: '採收',
      description: '只挑選成熟飽滿的咖啡果實，保留自然甜度與乾淨風味。',
      image: harvestImg,
    },
    {
      number: '02',
      title: 'Fermentation',
      zhTitle: '發酵',
      description: '控制時間與環境，讓果膠緩慢分解，建立細緻香氣與層次。',
      image: fermentationImg,
    },
    {
      number: '03',
      title: 'Washing',
      zhTitle: '水洗',
      description: '以清水洗去殘留果膠，呈現明亮酸質與清晰純淨的風味。',
      image: washingImg,
    },
    {
      number: '04',
      title: 'Roast',
      zhTitle: '烘焙',
      description: '依豆種調整火力與節奏，發展焦糖甜感與完整香氣。',
      image: roastImg,
    },
  ]
</script>

<template>
  <section aria-labelledby="coffee-origin-title" class="coffee-origin">
    <div class="coffee-origin__inner">
      <div class="coffee-origin__intro">
        <span class="coffee-origin__eyebrow">Our origin</span>

        <h2 id="coffee-origin-title" class="coffee-origin__title">
          <span>From origin</span>
          <span>to bean</span>
        </h2>

        <div aria-hidden="true" class="coffee-origin__line" />

        <p class="coffee-origin__description">
          一杯咖啡的風味，早在沖煮之前就已開始。從產地採收到烘焙，每一道工序都決定了豆子的甜度、香氣與口感。
        </p>
      </div>

      <div class="coffee-origin__grid">
        <article
          v-for="item in items"
          :key="item.number"
          class="origin-card"
        >
          <div class="origin-card__image-wrap">
            <img
              :alt="`${item.zhTitle}｜${item.title}`"
              class="origin-card__image"
              decoding="async"
              loading="lazy"
              :src="item.image"
            >
          </div>

          <div class="origin-card__content">
            <div class="origin-card__heading">
              <span class="origin-card__number">{{ item.number }}</span>
              <h3 class="origin-card__title">{{ item.title }}</h3>
            </div>

            <p class="origin-card__zh-title">{{ item.zhTitle }}</p>
            <div aria-hidden="true" class="origin-card__divider" />
            <p class="origin-card__description">{{ item.description }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.coffee-origin {
  --origin-bg: var(--story-bg, #faecd3);
  --origin-ink: var(--story-ink, #3f3027);
  --origin-primary: var(--story-primary, #6f4e37);
  --origin-primary-dark: #4d3527;
  --origin-accent: var(--story-accent, #9b643c);
  --origin-muted: var(--story-muted, #806b5c);
  --origin-line: var(--story-line, rgb(111 78 55 / 16%));
  background:
    radial-gradient(circle at 82% 12%, rgb(169 124 83 / 8%), transparent 27%),
    linear-gradient(180deg, var(--origin-bg) 0%, var(--origin-bg) 78%, #fdf0d1 100%);
  color: var(--origin-ink);
  margin-left: calc(50% - 50vw);
  padding: 96px 0 110px;
  width: 100vw;
}

.coffee-origin__inner {
  align-items: start;
  display: grid;
  gap: clamp(56px, 5vw, 76px);
  grid-template-columns: minmax(290px, 310px) minmax(0, 1fr);
  margin: 0 auto;
  width: min(1320px, calc(100% - 80px));
}

.coffee-origin__intro {
  min-width: 0;
  padding-top: 4px;
  padding-right: 8px;
}

.coffee-origin__eyebrow {
  color: var(--origin-accent);
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  margin-bottom: 18px;
  text-transform: uppercase;
}

.coffee-origin__title {
  color: var(--origin-primary-dark);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(2.65rem, 3.65vw, 3.75rem);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 0.88;
  margin: 0;
  text-transform: uppercase;
}

.coffee-origin__title span {
  display: block;
  white-space: nowrap;
}

.coffee-origin__line {
  background: var(--origin-primary);
  height: 1px;
  margin: 26px 0;
  width: 34px;
}

.coffee-origin__description {
  color: var(--origin-muted);
  font-family: "Noto Sans TC", sans-serif;
  font-size: 0.86rem;
  line-height: 1.9;
  margin: 0;
  max-width: 220px;
}

.coffee-origin__grid {
  border-left: 1px solid var(--origin-line);
  border-top: 1px solid var(--origin-line);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  min-width: 0;
}

.origin-card {
  background: rgb(255 247 232 / 38%);
  border-bottom: 1px solid var(--origin-line);
  border-right: 1px solid var(--origin-line);
  min-width: 0;
}

.origin-card__image-wrap {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  position: relative;
}

.origin-card__image {
  display: block;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition:
    transform 650ms cubic-bezier(0.2, 0.7, 0.2, 1),
    filter 650ms ease;
  width: 100%;
}

.origin-card:hover .origin-card__image {
  filter: saturate(1.04) contrast(1.02);
  transform: scale(1.045);
}

.origin-card__content {
  padding: 19px 17px 24px;
}

.origin-card__heading {
  align-items: baseline;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
}

.origin-card__number {
  color: var(--origin-accent);
  flex-shrink: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.45rem;
  line-height: 1;
}

.origin-card__title {
  color: var(--origin-primary-dark);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin: 0;
  text-transform: uppercase;
}

.origin-card__zh-title {
  color: var(--origin-primary);
  font-family: "Noto Sans TC", sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  margin: 0;
}

.origin-card__divider {
  background: var(--origin-line);
  height: 1px;
  margin: 13px 0;
  width: 100%;
}

.origin-card__description {
  color: var(--origin-muted);
  font-family: "Noto Sans TC", sans-serif;
  font-size: 0.8rem;
  line-height: 1.75;
  margin: 0;
}

@media (max-width: 1240px) {
  .coffee-origin {
    padding: 80px 0 88px;
  }

  .coffee-origin__inner {
    gap: 38px;
    grid-template-columns: 1fr;
    width: min(960px, calc(100% - 48px));
  }

  .coffee-origin__intro {
    padding-right: 0;
  }

  .coffee-origin__description {
    max-width: 520px;
  }

  .coffee-origin__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 650px) {
  .coffee-origin {
    padding: 64px 0 72px;
  }

  .coffee-origin__inner {
    gap: 30px;
    width: calc(100% - 40px);
  }

  .coffee-origin__title {
    font-size: clamp(2.5rem, 13vw, 3.4rem);
  }

  .coffee-origin__description {
    font-size: 0.86rem;
    max-width: 100%;
  }

  .coffee-origin__grid {
    grid-template-columns: 1fr;
  }

  .origin-card__content {
    padding: 20px 19px 25px;
  }

  .origin-card__description {
    font-size: 0.86rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .origin-card__image {
    transition: none;
  }

  .origin-card:hover .origin-card__image {
    transform: none;
  }
}
</style>
