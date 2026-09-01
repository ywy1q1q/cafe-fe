<script setup lang="ts">
  import harvestImage from '@/assets/processing/coffee-harvest.png'
  import originImage from '@/assets/processing/coffee-origin.png'
</script>

<template>
  <section
    id="origin-harvest"
    aria-labelledby="origin-harvest-title"
    class="origin-harvest"
  >
    <div class="origin-harvest__copy">
      <p class="origin-harvest__eyebrow">01&nbsp;&nbsp;ORIGIN &amp; HARVEST</p>

      <h2 id="origin-harvest-title" class="origin-harvest__title">
        從產地，<br>到成熟的果實
      </h2>

      <p class="origin-harvest__description">
        好的咖啡，從生長的土地開始。海拔、氣候、日照與成熟度，共同形塑一杯咖啡最初的風味方向。
      </p>

      <p class="origin-harvest__note">
        風味的旅程，在採收之前就已經開始。
      </p>
    </div>

    <article id="origin" class="journey-image-panel origin-panel">
      <img
        alt="高山咖啡產地與咖啡園"
        decoding="async"
        height="1086"
        :src="originImage"
        width="1448"
      >

      <div class="journey-image-panel__overlay">
        <span class="journey-image-panel__number">01&nbsp;&nbsp;ORIGIN</span>
        <h3 class="journey-image-panel__title">產地</h3>

        <p class="journey-image-panel__description">
          高海拔、氣候與日照，塑造咖啡最初的風味。
        </p>
      </div>
    </article>

    <article id="harvest" class="journey-image-panel harvest-panel">
      <img
        alt="採摘成熟紅色咖啡果實"
        decoding="async"
        height="1086"
        :src="harvestImage"
        width="1448"
      >

      <div class="journey-image-panel__overlay">
        <span class="journey-image-panel__number">02&nbsp;&nbsp;HARVEST</span>
        <h3 class="journey-image-panel__title">採收</h3>

        <p class="journey-image-panel__description">
          只採收成熟紅果，讓甜度與風味停留在最佳狀態。
        </p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.origin-harvest {
  background: var(--processing-bg, #f5e8c6);
  color: var(--processing-ink, #3b2419);
  display: grid;
  grid-template-columns: var(--journey-grid, minmax(280px, 0.85fr) repeat(2, minmax(0, 1fr)));
  min-height: 560px;
}

.origin-harvest__copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(56px, 6vw, 96px) clamp(40px, 4vw, 72px);
}

.origin-harvest__eyebrow {
  color: var(--processing-accent, #a86537);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  margin: 0 0 26px;
}

.origin-harvest__title {
  color: var(--processing-ink, #3b2419);
  font-family: "Noto Sans TC", sans-serif;
  font-size: clamp(2.5rem, 3.8vw, 4.125rem);
  font-weight: 400;
  letter-spacing: 0.015em;
  line-height: 1.18;
  margin: 0;
}

.origin-harvest__description {
  color: var(--processing-muted, #806957);
  font-family: "Noto Sans TC", sans-serif;
  font-size: 1rem;
  line-height: 1.9;
  margin: 28px 0 0;
  max-width: 26rem;
}

.origin-harvest__note {
  color: var(--processing-primary, #6f4e37);
  font-size: 0.78rem;
  line-height: 1.7;
  margin: 28px 0 0;
}

.journey-image-panel {
  min-width: 0;
  overflow: hidden;
  position: relative;
}

.journey-image-panel::after {
  background: linear-gradient(180deg, transparent 42%, rgb(30 20 13 / 62%) 100%);
  content: "";
  inset: 0;
  pointer-events: none;
  position: absolute;
}

.journey-image-panel img {
  display: block;
  height: 100%;
  max-width: 100%;
  object-fit: cover;
  width: 100%;
}

.origin-panel img {
  object-position: center;
}

.harvest-panel img {
  object-position: 62% center;
}

.journey-image-panel__overlay {
  bottom: clamp(24px, 3vw, 40px);
  color: #f8ecd3;
  left: clamp(24px, 3vw, 44px);
  max-width: 17.5rem;
  position: absolute;
  right: 24px;
  z-index: 1;
}

.journey-image-panel__number {
  color: rgb(248 236 211 / 76%);
  display: block;
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  margin-bottom: 8px;
}

.journey-image-panel__title {
  font-family: "Noto Sans TC", sans-serif;
  font-size: 1.75rem;
  font-weight: 500;
  line-height: 1.25;
  margin: 0 0 8px;
}

.journey-image-panel__description {
  color: rgb(248 236 211 / 88%);
  font-family: "Noto Sans TC", sans-serif;
  font-size: 0.875rem;
  line-height: 1.7;
  margin: 0;
}

@media (max-width: 1100px) {
  .origin-harvest {
    grid-template-columns: var(--journey-grid, minmax(260px, 0.85fr) repeat(2, minmax(0, 1fr)));
  }

  .origin-harvest__copy {
    padding: 48px 32px;
  }

  .origin-harvest__title {
    font-size: clamp(2rem, 4vw, 3rem);
  }
}

@media (max-width: 768px) {
  .origin-harvest {
    grid-template-columns: 1fr;
    min-height: 0;
  }

  .origin-harvest__copy {
    padding: 42px 24px 34px;
  }

  .origin-harvest__title {
    font-size: clamp(2.25rem, 10vw, 3.25rem);
  }

  .journey-image-panel {
    aspect-ratio: 4 / 3;
  }

  .journey-image-panel__overlay {
    bottom: 24px;
    left: 24px;
  }

  .harvest-panel img {
    object-position: 68% center;
  }
}
</style>
