<script setup lang="ts">
  import CoffeeJourney from '@/components/processing/CoffeeJourney.vue'
  import ProcessingFooter from '@/components/processing/ProcessingFooter.vue'
</script>

<template>
  <main class="processing-page">
    <CoffeeJourney />
    <ProcessingFooter />
  </main>
</template>

<style scoped>
.processing-page {
  --processing-bg: #fdf0d1;
  --processing-surface: #faecd3;
  --processing-primary: #6f4e37;
  --processing-ink: #3f3027;
  --processing-muted: #806b5c;
  --processing-accent: #9b643c;
  --processing-border: #d8c7b7;
  --processing-line: rgb(111 78 55 / 15%);

  background: var(--processing-bg);
  color: var(--processing-ink);
  min-height: 100dvh;
}
</style>
