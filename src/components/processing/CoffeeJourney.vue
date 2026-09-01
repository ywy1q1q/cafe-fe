<script setup lang="ts">
  import CupSection from '@/components/processing/CupSection.vue'
  import FermentationHero from '@/components/processing/FermentationHero.vue'
  import OriginSection from '@/components/processing/OriginSection.vue'
  import ProcessingMethods from '@/components/processing/ProcessingMethods.vue'
  import ProcessingTransition from '@/components/processing/ProcessingTransition.vue'
  import RoastingSection from '@/components/processing/RoastingSection.vue'
</script>

<template>
  <section id="coffee-journey" aria-label="咖啡旅程" class="coffee-journey">
    <OriginSection />
    <FermentationHero />
    <ProcessingTransition />
    <ProcessingMethods />
    <RoastingSection />
    <CupSection />
  </section>
</template>

<style scoped>
.coffee-journey {
  --journey-grid: minmax(280px, 0.85fr) repeat(2, minmax(0, 1fr));
  --journey-light: #f8ecd3;
  --journey-light-muted: rgb(248 236 211 / 78%);
  --journey-line: rgb(248 236 211 / 14%);

  background-color: #2d1c12;
  background-image:
    linear-gradient(rgb(45 28 18 / 28%), rgb(45 28 18 / 48%)),
    url('@/assets/processing/coffee-journey-background.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  color: var(--journey-light);
  isolation: isolate;
  overflow: hidden;
}

@media (max-width: 1100px) {
  .coffee-journey {
    --journey-grid: minmax(260px, 0.85fr) repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .coffee-journey {
    --journey-grid: 1fr;
    background-position: 58% center;
  }
}
</style>
