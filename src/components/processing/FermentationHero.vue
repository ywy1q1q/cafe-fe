<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { fermentationStages } from '@/data/fermentation'

  const activeIndex = ref(1)
  const activeStage = computed(() => fermentationStages[activeIndex.value]!)
  const activeHour = computed(() => activeStage.value.time.replace(/h$/i, ''))

  function selectStage (index: number) {
    activeIndex.value = index
  }
</script>

<template>
  <section aria-labelledby="fermentation-title" class="fermentation">
    <div class="fermentation__main">
      <div class="fermentation__copy">
        <div class="fermentation__copy-inner">
          <p class="eyebrow">FERMENTATION TIME</p>

          <h1 id="fermentation-title">
            探索發酵時間，<br class="mobile-title-break">風味的祕密
          </h1>

          <div aria-hidden="true" class="editorial-divider">
            <span />
            <i />
            <span />
          </div>

          <p class="description">
            同一顆咖啡果實，在不同的發酵時間下，<br class="desktop-break">
            可能展現不同的香氣、甜感與風味層次。
          </p>

          <Transition mode="out-in" name="copy-fade">
            <p :key="activeStage.time" class="active-description">
              {{ activeStage.description }}
            </p>
          </Transition>

          <p class="knowledge-note">
            發酵時間並非唯一因素，品種、溫度、環境、處理方式與後續烘焙也會共同塑造風味。
          </p>
        </div>
      </div>

      <div class="fermentation__media-column">
        <figure class="fermentation__visual">
          <Transition mode="out-in" name="image-fade">
            <img
              :key="activeStage.time"
              :alt="`${activeStage.time} 發酵階段的咖啡果實`"
              class="media-image"
              :src="activeStage.image"
            >
          </Transition>

          <div class="image-content">
            <div class="hour">
              <strong>{{ activeHour }}</strong>
              <span>HOURS</span>
            </div>

            <span aria-hidden="true" class="image-content__rule" />

            <h2>{{ activeStage.subtitle }}</h2>
            <p>{{ activeStage.title }}</p>
            <small>{{ activeStage.flavor }}</small>
          </div>
        </figure>

        <div class="mobile-flavor">
          <h2>{{ activeStage.subtitle }}</h2>
          <p>{{ activeStage.title }}</p>
          <small>{{ activeStage.flavor }}</small>
        </div>
      </div>
    </div>

    <div aria-label="選擇發酵時間" class="time-selector" role="group">
      <button
        v-for="(stage, index) in fermentationStages"
        :key="stage.time"
        :aria-label="`顯示 ${stage.time} 發酵風味`"
        :aria-pressed="activeIndex === index"
        :class="{ active: activeIndex === index }"
        type="button"
        @click="selectStage(index)"
      >
        <span class="time-selector__circle">
          <strong>{{ stage.time.toUpperCase() }}</strong>
        </span>

        <span class="time-selector__label">{{ stage.title }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.fermentation {
  background: linear-gradient(rgb(111 78 55 / 14%), rgb(111 78 55 / 14%)) top / 100% 1px no-repeat;
  color: var(--processing-ink, #3f3027);
  margin: 0 auto;
  overflow: hidden;
  padding-top: 1px;
  width: 100%;
}

.fermentation__main {
  align-items: stretch;
  display: grid;
  grid-template-columns: var(--journey-grid, minmax(280px, 0.85fr) repeat(2, minmax(0, 1fr)));
}

.fermentation__copy {
  background: #f6e6c4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(36px, 3.2vw, 56px) clamp(32px, 3vw, 54px);
}

.fermentation__copy-inner {
  margin-inline: auto;
  max-width: 620px;
  width: 100%;
}

.eyebrow {
  align-items: center;
  color: var(--processing-accent, #9b643c);
  display: flex;
  font-size: 0.72rem;
  font-weight: 700;
  gap: 14px;
  letter-spacing: 0.22em;
  margin: 0;
}

.eyebrow::before {
  background: currentColor;
  content: "";
  height: 1px;
  width: 36px;
}

.fermentation h1 {
  color: var(--processing-ink, #3f3027);
  font-family: "Noto Sans TC", sans-serif;
  font-size: clamp(2rem, 2.15vw, 2.55rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.22;
  margin: 22px 0 0;
  max-width: 620px;
  white-space: normal;
}

.mobile-title-break {
  display: inline;
}

.description {
  color: var(--processing-muted, #806b5c);
  font-family: "Noto Sans TC", sans-serif;
  font-size: 0.98rem;
  line-height: 1.9;
  margin: 0;
  max-width: 560px;
}

.editorial-divider {
  align-items: center;
  color: rgb(63 48 39 / 24%);
  display: flex;
  gap: 12px;
  margin: 18px 0;
  width: min(100%, 560px);
}

.editorial-divider span {
  background: currentColor;
  height: 1px;
  flex: 1;
}

.editorial-divider i {
  border: 1px solid currentColor;
  border-radius: 50%;
  height: 7px;
  width: 7px;
}

.active-description {
  background: rgb(255 255 255 / 8%);
  border: 1px solid rgb(155 100 60 / 14%);
  border-left: 2px solid var(--processing-accent, #9b643c);
  border-radius: 6px;
  color: var(--processing-ink, #3f3027);
  font-size: 0.92rem;
  line-height: 1.7;
  margin: 0;
  max-width: 560px;
  padding: 16px 20px;
}

.active-description::before {
  color: var(--processing-accent, #9b643c);
  content: "“";
  font-family: Georgia, serif;
  font-size: 1.7rem;
  line-height: 0;
  margin-right: 10px;
  vertical-align: -0.18em;
}

.knowledge-note {
  color: var(--processing-muted, #806b5c);
  font-size: 0.76rem;
  line-height: 1.8;
  margin: 24px 0 0;
  max-width: 560px;
}

.fermentation__media-column {
  display: flex;
  flex-direction: column;
  grid-column: 2 / -1;
  min-width: 0;
}

.fermentation__visual {
  background: transparent;
  height: 100%;
  margin: 0;
  min-height: 500px;
  overflow: hidden;
  position: relative;
}

.fermentation__visual img {
  display: block;
  height: 100%;
  position: absolute;
}

.media-image {
  filter: brightness(0.98) contrast(0.98) saturate(0.92);
  inset: 0 auto 0 0;
  object-fit: cover;
  object-position: center;
  width: 50%;
}

.fermentation__visual::after {
  background: linear-gradient(
    90deg,
    transparent 42%,
    rgb(45 28 18 / 34%) 51%,
    rgb(45 28 18 / 58%) 100%
  );
  content: "";
  inset: 0;
  pointer-events: none;
  position: absolute;
}

.image-content {
  color: #fffaf3;
  left: calc(50% + clamp(28px, 3.5vw, 58px));
  max-width: none;
  position: absolute;
  right: clamp(32px, 4vw, 72px);
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

.hour {
  align-items: baseline;
  display: flex;
  gap: 10px;
}

.hour strong {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(4rem, 6vw, 6.25rem);
  font-weight: 400;
  line-height: 0.85;
}

.hour span {
  font-size: clamp(0.78rem, 1.2vw, 1.08rem);
  letter-spacing: 0.08em;
}

.image-content__rule {
  background: rgb(255 250 243 / 52%);
  display: block;
  height: 1px;
  margin-top: 24px;
  width: 68px;
}

.image-content h2 {
  color: #efc58d;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(1.75rem, 2.2vw, 2.625rem);
  font-weight: 400;
  line-height: 1.15;
  margin: 26px 0 0;
}

.image-content p {
  font-size: 1.08rem;
  font-weight: 500;
  margin: 16px 0 0;
}

.image-content small {
  color: rgb(255 250 243 / 80%);
  display: block;
  font-size: 0.92rem;
  line-height: 1.6;
  margin-top: 8px;
}

.mobile-flavor {
  display: none;
}

.time-selector {
  background: rgb(45 28 18 / 28%);
  border-top: 1px solid var(--journey-line, rgb(248 236 211 / 14%));
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  padding: 16px 6% 14px;
  position: relative;
}

.time-selector::before {
  background: rgb(248 236 211 / 22%);
  content: "";
  height: 1px;
  left: 10%;
  position: absolute;
  right: 10%;
  top: 43px;
}

.time-selector button {
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--journey-light-muted, rgb(248 236 211 / 78%));
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0;
  position: relative;
  transition: color 180ms ease;
  z-index: 1;
}

.time-selector button:hover {
  color: var(--journey-light, #f8ecd3);
}

.time-selector button:focus-visible {
  outline: 2px solid #d79a62;
  outline-offset: 4px;
}

.time-selector button.active {
  color: var(--journey-light, #f8ecd3);
  font-weight: 600;
}

.time-selector__circle {
  align-items: center;
  background: rgb(45 28 18 / 72%);
  border: 1px solid #b87a49;
  border-radius: 50%;
  display: flex;
  height: 54px;
  justify-content: center;
  transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease;
  width: 54px;
}

.time-selector button.active .time-selector__circle {
  background: #a86537;
  border-color: #d6a272;
  color: #fffaf3;
}

.time-selector__circle strong {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 1rem;
  font-weight: 500;
}

.time-selector__label {
  font-size: 0.74rem;
  white-space: nowrap;
}

.image-fade-enter-active,
.image-fade-leave-active {
  transition: opacity 450ms ease, transform 450ms ease;
}

.image-fade-enter-from {
  opacity: 0;
  transform: scale(1.015);
}

.image-fade-leave-to {
  opacity: 0;
}

.copy-fade-enter-active,
.copy-fade-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.copy-fade-enter-from,
.copy-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (max-width: 1100px) {
  .fermentation {
    width: 100%;
  }

  .fermentation__main {
    grid-template-columns: var(--journey-grid, minmax(260px, 0.85fr) repeat(2, minmax(0, 1fr)));
  }

  .fermentation__copy {
    padding: 38px 32px;
  }

  .fermentation__visual {
    min-height: 460px;
  }

  .desktop-break {
    display: none;
  }
}

@media (max-width: 768px) {
  .fermentation {
    margin-block: 0;
    width: 100%;
  }

  .fermentation__main {
    grid-template-columns: 1fr;
  }

  .fermentation__copy {
    padding: 42px 24px 34px;
  }

  .fermentation__media-column {
    grid-column: auto;
  }

  .fermentation h1 {
    font-size: clamp(2.2rem, 10vw, 3rem);
    white-space: normal;
  }

  .mobile-title-break {
    display: inline;
  }

  .description {
    font-size: 0.94rem;
    margin-top: 26px;
  }

  .fermentation__visual {
    aspect-ratio: 4 / 3;
    height: auto;
    min-height: 0;
  }

  .media-image {
    inset: 0;
    object-fit: cover;
    width: 100%;
  }

  .image-content {
    bottom: 22px;
    left: 24px;
    max-width: none;
    right: auto;
    top: auto;
    transform: none;
  }

  .hour strong {
    font-size: 3.6rem;
  }

  .hour span {
    font-size: 0.78rem;
  }

  .image-content__rule,
  .image-content h2,
  .image-content p,
  .image-content small {
    display: none;
  }

  .mobile-flavor {
    background: rgb(45 28 18 / 72%);
    display: block;
    padding: 24px;
  }

  .mobile-flavor h2 {
    color: var(--journey-light, #f8ecd3);
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 2rem;
    font-weight: 500;
    margin: 0;
  }

  .mobile-flavor p {
    color: var(--journey-light, #f8ecd3);
    font-size: 0.96rem;
    font-weight: 600;
    margin: 12px 0 0;
  }

  .mobile-flavor small {
    color: var(--journey-light-muted, rgb(248 236 211 / 78%));
    display: block;
    font-size: 0.84rem;
    margin-top: 7px;
  }

  .time-selector {
    padding: 22px 12px 18px;
  }

  .time-selector::before {
    left: 12.5%;
    right: 12.5%;
    top: 49px;
  }

  .time-selector__circle {
    height: 46px;
    width: 46px;
  }

  .time-selector__circle strong {
    font-size: 0.82rem;
  }

  .time-selector__label {
    font-size: 0.68rem;
  }
}

@media (max-width: 420px) {
  .fermentation h1 {
    font-size: 2.05rem;
  }

  .time-selector__label {
    font-size: 0.62rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .image-fade-enter-active,
  .image-fade-leave-active,
  .copy-fade-enter-active,
  .copy-fade-leave-active,
  .time-selector button,
  .time-selector__circle {
    transition: none;
  }
}
</style>
