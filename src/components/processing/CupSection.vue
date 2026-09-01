<script setup lang="ts">
  import finalCupImage from '@/assets/processing/coffee-final-cup.png'
</script>

<template>
  <section id="cup" aria-labelledby="cup-title" class="cup-section">
    <div class="cup-section__media">
      <img
        alt="木桌上的一杯熱拿鐵咖啡"
        decoding="async"
        height="1086"
        loading="lazy"
        :src="finalCupImage"
        width="1448"
      >
    </div>

    <div class="cup-section__content">
      <p class="cup-section__eyebrow">06&nbsp;&nbsp;FROM BEAN TO CUP</p>

      <h2 id="cup-title" class="cup-section__title">
        每一步，<br><span>只為這一杯美好</span>
      </h2>

      <p class="cup-section__description">
        從產地、採收、發酵、處理到烘焙，每一步都讓風味更加完整。
      </p>
    </div>
  </section>
</template>

<style scoped>
.cup-section {
  border-top: 1px solid var(--journey-line, rgb(248 236 211 / 14%));
  min-height: clamp(430px, 42vw, 640px);
  overflow: hidden;
  position: relative;
}

.cup-section__media {
  inset: 0 16% 0 0;
  overflow: hidden;
  position: absolute;
}

.cup-section__media::after {
  background: linear-gradient(
    90deg,
    rgb(30 18 12 / 78%) 0%,
    rgb(30 18 12 / 55%) 34%,
    rgb(30 18 12 / 18%) 62%,
    transparent 82%
  );
  content: "";
  inset: 0;
  pointer-events: none;
  position: absolute;
}

.cup-section__media img {
  display: block;
  height: 100%;
  object-fit: cover;
  object-position: 64% center;
  width: 100%;
}

.cup-section__content {
  align-items: flex-start;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: inherit;
  padding: clamp(48px, 7vw, 104px);
  position: relative;
  width: min(60%, 800px);
  z-index: 1;
}

.cup-section__eyebrow {
  color: #d7a06b;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  margin: 0 0 22px;
}

.cup-section__title {
  color: var(--journey-light, #f8ecd3);
  font-family: "Noto Sans TC", sans-serif;
  font-size: clamp(2.5rem, 4.5vw, 5rem);
  font-weight: 400;
  letter-spacing: 0.015em;
  line-height: 1.18;
  margin: 0;
}

.cup-section__title span {
  white-space: nowrap;
}

.cup-section__description {
  color: var(--journey-light-muted, rgb(248 236 211 / 78%));
  font-family: "Noto Sans TC", sans-serif;
  font-size: 1rem;
  line-height: 1.9;
  margin: 28px 0 0;
  max-width: 32rem;
}

@media (max-width: 980px) {
  .cup-section__media {
    right: 8%;
  }

  .cup-section__content {
    padding: 56px 40px;
    width: 58%;
  }
}

@media (max-width: 680px) {
  .cup-section {
    min-height: 520px;
  }

  .cup-section__media {
    inset: 0;
  }

  .cup-section__media::after {
    background: linear-gradient(
      90deg,
      rgb(30 18 12 / 82%) 0%,
      rgb(30 18 12 / 58%) 48%,
      rgb(30 18 12 / 16%) 82%,
      transparent 100%
    );
  }

  .cup-section__media img {
    object-position: 68% center;
  }

  .cup-section__content {
    padding: 48px 24px;
    width: min(84%, 34rem);
  }

  .cup-section__title {
    font-size: clamp(1.9rem, 9vw, 3.1rem);
  }

  .cup-section__description {
    font-size: 0.94rem;
  }
}
</style>
