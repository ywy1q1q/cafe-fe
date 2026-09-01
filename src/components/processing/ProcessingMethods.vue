<script setup lang="ts">
  import honeyImage from '@/assets/processing/Honey.png'
  import naturalImage from '@/assets/processing/Natural.png'
  import washedImage from '@/assets/processing/Washed.png'

  interface ProcessingMethod {
    number: string
    title: string
    chineseTitle: string
    steps: string[]
    description: string
    flavors: string[]
    image: string
    alt: string
  }

  const methods: ProcessingMethod[] = [
    {
      number: '01',
      title: 'Natural',
      chineseTitle: '日曬處理',
      steps: ['採收', '整顆果實乾燥', '定期翻曬', '去除果皮果肉', '生豆'],
      description: '日曬處理會讓咖啡櫻桃保留果肉一起乾燥。乾燥過程中，果實的糖分與香氣可能帶來明顯的水果甜感與成熟果香。',
      flavors: ['莓果', '甜感', '酒香', '厚實口感'],
      image: naturalImage,
      alt: '咖啡果實日曬處理過程',
    },
    {
      number: '02',
      title: 'Washed',
      chineseTitle: '水洗處理',
      steps: ['採收', '去除果皮果肉', '發酵', '清水洗除果膠', '乾燥'],
      description: '水洗處理會先去除咖啡果實的大部分果肉，再透過發酵與清洗處理剩餘果膠，通常更容易呈現乾淨、清晰與明亮的風味輪廓。',
      flavors: ['乾淨', '明亮', '柑橘', '花香'],
      image: washedImage,
      alt: '咖啡櫻桃水洗處理過程',
    },
    {
      number: '03',
      title: 'Honey',
      chineseTitle: '蜜處理',
      steps: ['採收', '去除果皮', '保留部分果膠', '帶果膠乾燥', '生豆'],
      description: '蜜處理介於日曬與水洗之間。去除果皮後保留部分果膠進行乾燥，常呈現較明顯的甜感、圓潤口感與焦糖調性。',
      flavors: ['甜感', '圓潤', '焦糖', '核果'],
      image: honeyImage,
      alt: '咖啡蜜處理乾燥過程',
    },
  ]
</script>

<template>
  <section aria-labelledby="methods-title" class="methods">
    <header class="methods__heading">
      <div>
        <p class="methods__eyebrow">PROCESSING METHODS</p>
        <h2 id="methods-title">One fruit,<br>three expressions.</h2>
      </div>

      <p class="methods__lead">
        咖啡採收後如何去除果肉、發酵與乾燥，會將同一顆果實帶往截然不同的風味方向。
      </p>
    </header>

    <div class="methods__grid">
      <article
        v-for="method in methods"
        :key="method.title"
        class="method"
      >
        <div class="method__image-wrap">
          <img
            :alt="method.alt"
            class="method__image"
            loading="lazy"
            :src="method.image"
          >

          <span class="method__number">{{ method.number }}</span>
        </div>

        <div class="method__body">
          <h3>
            <span class="method__title-zh">{{ method.chineseTitle }}</span>
            <i aria-hidden="true">/</i>
            <small class="method__title-en">{{ method.title }}</small>
          </h3>

          <ol :aria-label="`${method.chineseTitle}步驟`" class="method__flow">
            <li v-for="(step, index) in method.steps" :key="step">
              <span>{{ step }}</span>
              <span v-if="index < method.steps.length - 1" aria-hidden="true" class="method__arrow">→</span>
            </li>
          </ol>

          <p class="method__description">{{ method.description }}</p>

          <ul aria-label="風味特徵" class="method__flavors">
            <li v-for="flavor in method.flavors" :key="flavor">{{ flavor }}</li>
          </ul>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.methods {
  --methods-text: var(--journey-light, #f8ecd3);
  --methods-muted: var(--journey-light-muted, rgb(248 236 211 / 78%));
  --methods-accent: #d7a06b;
  --methods-line: var(--journey-line, rgb(248 236 211 / 14%));

  background: rgb(36 22 14 / 34%);
  border-top: 1px solid var(--methods-line);
  padding: clamp(48px, 6vw, 80px) clamp(24px, 5vw, 72px) clamp(80px, 10vw, 140px);
}

.methods__heading,
.methods__grid {
  margin-inline: auto;
  max-width: 1320px;
}

.methods__heading {
  align-items: end;
  display: grid;
  gap: 48px;
  grid-template-columns: 1.25fr 0.75fr;
  margin-bottom: clamp(48px, 6vw, 80px);
}

.methods__eyebrow {
  color: var(--methods-accent);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  margin: 0 0 18px;
}

.methods__heading h2 {
  color: var(--methods-text);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(3.6rem, 7vw, 7rem);
  font-weight: 500;
  letter-spacing: -0.045em;
  line-height: 0.79;
  margin: 0;
}

.methods__lead {
  color: var(--methods-muted);
  font-family: "Noto Sans TC", sans-serif;
  line-height: 1.95;
  margin: 0 0 4px;
  max-width: 29rem;
}

.methods__grid {
  border-bottom: 1px solid var(--methods-line);
  border-top: 1px solid var(--methods-line);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.method {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: clamp(28px, 3vw, 42px);
}

.method + .method {
  border-left: 1px solid var(--methods-line);
}

.method__image-wrap {
  aspect-ratio: 4 / 3;
  margin-bottom: 32px;
  overflow: hidden;
  position: relative;
}

.method__image-wrap::after {
  background: linear-gradient(to top, rgb(39 24 15 / 38%), transparent 45%);
  content: "";
  inset: 0;
  position: absolute;
}

.method__image {
  display: block;
  height: 100%;
  object-fit: cover;
  transition: transform 600ms ease;
  width: 100%;
}

.method:hover .method__image {
  transform: scale(1.025);
}

.method__number {
  bottom: 16px;
  color: #fffaf3;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 2rem;
  left: 18px;
  position: absolute;
  z-index: 1;
}

.method__body {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.method h3 {
  align-items: baseline;
  color: var(--methods-text);
  display: flex;
  font-weight: 500;
  gap: 10px;
  line-height: 1;
  margin: 0;
}

.method h3 i {
  color: var(--methods-accent);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 1.1rem;
  font-style: normal;
  font-weight: 400;
}

.method__title-zh {
  font-family: "Noto Sans TC", sans-serif;
  font-size: clamp(1.75rem, 2.3vw, 2.45rem);
  letter-spacing: 0.02em;
}

.method__title-en {
  color: var(--methods-muted);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(1rem, 1.25vw, 1.35rem);
  font-weight: 500;
}

.method__flow {
  color: var(--methods-text);
  display: flex;
  flex-wrap: wrap;
  font-size: 0.72rem;
  font-weight: 650;
  gap: 6px;
  list-style: none;
  margin: 26px 0 0;
  padding: 0;
}

.method__flow li {
  display: flex;
  gap: 6px;
}

.method__arrow {
  color: var(--methods-accent);
}

.method__description {
  color: var(--methods-muted);
  font-size: 0.88rem;
  line-height: 1.85;
  margin: 22px 0 0;
}

.method__flavors {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  list-style: none;
  margin: auto 0 0;
  padding: 24px 0 0;
  border-top: 1px solid var(--methods-line);
}

.method__flavors li {
  color: var(--methods-text);
  font-size: 0.76rem;
}

.method__flavors li::before {
  color: var(--methods-accent);
  content: "·";
  margin-right: 6px;
}

@media (max-width: 980px) {
  .methods__grid {
    grid-template-columns: 1fr;
  }

  .method {
    display: grid;
    gap: 32px;
    grid-template-columns: minmax(240px, 0.85fr) 1fr;
  }

  .method + .method {
    border-left: 0;
    border-top: 1px solid var(--methods-line);
  }

  .method__image-wrap {
    margin-bottom: 0;
  }
}

@media (max-width: 680px) {
  .methods {
    padding-inline: 20px;
  }

  .methods__heading {
    align-items: start;
    gap: 28px;
    grid-template-columns: 1fr;
  }

  .methods__heading h2 {
    line-height: 0.86;
  }

  .method {
    display: block;
    padding: 28px 0 38px;
  }

  .method__image-wrap {
    margin-bottom: 28px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .method__image {
    transition: none;
  }
}
</style>
