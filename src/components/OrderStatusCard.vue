<template>
  <div
    class="order-status-card"
    :class="`order-status-card--${status}`"
  >
    <span class="order-status-card__indicator">
      <v-icon
        :icon="status === 'ready' ? 'mdi-check' : 'mdi-lightning-bolt'"
        size="20"
      />
    </span>

    <span class="order-status-card__number">
      {{ orderNumber }}
    </span>

    <span class="order-status-card__label">
      {{ status === 'ready' ? '請取餐' : '製作中' }}
    </span>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    orderNumber: string
    status: 'preparing' | 'ready'
  }>()
</script>

<style scoped>
.order-status-card {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  min-height: 78px;
  padding: 13px 15px;
  margin-bottom: 10px;
  border: 1px solid #e5d3bf;
  border-radius: 15px;
  background: #fffaf1;
  color: #3a2118;
  box-shadow: 0 6px 14px rgb(84 43 27 / 7%);
}

.order-status-card:last-child {
  margin-bottom: 0;
}

.order-status-card__indicator {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: 14px;
  background: #f5e2bf;
  color: #b17800;
}

.order-status-card__number {
  font-size: clamp(1.45rem, 4vw, 1.85rem);
  font-weight: 800;
  letter-spacing: .02em;
}

.order-status-card__label {
  padding: 5px 9px;
  border-radius: 999px;
  background: #f5e2bf;
  color: #8a5a00;
  font-size: .78rem;
  font-weight: 700;
}

.order-status-card--ready {
  border-color: #cbd8ac;
  background: #fbfdf5;
}

.order-status-card--ready .order-status-card__indicator {
  background: #e7edd9;
  color: #71844e;
}

.order-status-card--ready .order-status-card__label {
  background: #e7edd9;
  color: #536638;
}

@media (max-width: 420px) {
  .order-status-card {
    grid-template-columns: 38px minmax(0, 1fr) auto;
    gap: 10px;
    padding: 10px;
  }

  .order-status-card__indicator {
    width: 38px;
    height: 38px;
  }
}

@media (max-width: 600px) {
  .order-status-card {
    grid-template-columns: 32px minmax(0, 1fr) auto;
    gap: 8px;
    min-height: 54px;
    margin-bottom: 8px;
    padding: 8px 10px;
  }

  .order-status-card__indicator {
    width: 32px;
    height: 32px;
  }

  .order-status-card__number {
    font-size: 1.25rem;
  }

  .order-status-card__label {
    padding: 4px 7px;
    border-radius: 6px;
    font-size: .68rem;
  }
}
</style>
