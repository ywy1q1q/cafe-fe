<template>
  <section aria-labelledby="processing-transition-title" class="processing-transition">
    <div class="processing-transition__inner">
      <p class="processing-transition__eyebrow">
        FROM FERMENTATION TO PROCESSING
      </p>

      <h2 id="processing-transition-title" class="processing-transition__title">
        發酵塑造風味，<br>處理法決定它如何被留下。
      </h2>

      <div aria-hidden="true" class="processing-transition__arrow">
        <span class="processing-transition__line" />
        <span class="processing-transition__chevron" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.processing-transition {
  background: rgb(45 28 18 / 22%);
  border-top: 1px solid var(--journey-line, rgb(248 236 211 / 10%));
  border-bottom: 1px solid var(--journey-line, rgb(248 236 211 / 10%));
}

.processing-transition__inner {
  min-height: 280px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 44px 24px 36px;

  text-align: center;
}

.processing-transition__eyebrow {
  margin: 0 0 28px;

  font-size: 12px;
  font-weight: 600;

  letter-spacing: 0.18em;

  color: #d7a06b;
}

.processing-transition__title {
  margin: 0;

  max-width: 900px;

  font-size: clamp(28px, 2.6vw, 44px);
  font-weight: 400;
  line-height: 1.45;

  color: var(--journey-light, #f8ecd3);
}

.processing-transition__arrow {
  margin-top: 28px;

  display: flex;
  flex-direction: column;
  align-items: center;

  color: #d7a06b;
}

.processing-transition__line {
  width: 1px;
  height: 48px;

  background: currentColor;
  opacity: 0.7;
}

.processing-transition__chevron {
  border-bottom: 1px solid currentColor;
  border-right: 1px solid currentColor;
  height: 8px;
  margin-top: -5px;
  transform: rotate(45deg);
  width: 8px;
}

@media (max-width: 768px) {
  .processing-transition__inner {
    min-height: 240px;
    padding: 36px 20px 28px;
  }

  .processing-transition__title {
    max-width: 520px;

    font-size: clamp(24px, 7vw, 34px);
  }

  .processing-transition__eyebrow {
    margin-bottom: 20px;
    font-size: 10px;
  }

  .processing-transition__line {
    height: 36px;
  }
}
</style>
