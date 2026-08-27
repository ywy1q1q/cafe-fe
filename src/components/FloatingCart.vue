<template>
  <button
    v-if="!cartStore.drawerOpen"
    :aria-label="cartAriaLabel"
    class="floating-cart"
    type="button"
    @click="cartStore.openDrawer"
  >
    <span class="floating-cart__icon">
      <v-icon icon="mdi-cart-outline" size="25" />

      <span
        v-if="cartStore.totalQuantity > 0"
        class="floating-cart__badge"
      >
        {{ cartStore.totalQuantity > 99 ? '99+' : cartStore.totalQuantity }}
      </span>
    </span>

    <span class="floating-cart__content">
      <strong>購物車</strong>

      <span>
        {{ cartStore.totalQuantity > 0 ? `${cartStore.totalQuantity} 件商品` : '目前沒有商品' }}
      </span>
    </span>

    <span class="floating-cart__total">
      ${{ cartStore.totalPrice }}
    </span>

    <v-icon
      class="floating-cart__arrow"
      icon="mdi-chevron-right"
      size="20"
    />
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useCartStore } from '@/stores/cart'

  const cartStore = useCartStore()

  const cartAriaLabel = computed(() => {
    if (cartStore.totalQuantity === 0) return '開啟購物車，目前沒有商品'

    return `開啟購物車，共 ${cartStore.totalQuantity} 件商品，總金額 ${cartStore.totalPrice} 元`
  })
</script>

<style scoped>
.floating-cart {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1005;
  display: grid;
  grid-template-columns: 42px minmax(70px, 1fr) auto 16px;
  align-items: center;
  gap: 8px;
  min-width: 240px;
  min-height: 64px;
  padding: 8px 10px;
  border: 1px solid rgb(91, 62, 44);
  border-radius: 10px;
  background: rgb(111, 78, 55);
  box-shadow: 0 12px 28px rgb(67 52 43 / 24%);
  color: white;
  text-align: left;
  cursor: pointer;
  transition: background 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}

.floating-cart:hover {
  background: rgb(91, 62, 44);
  box-shadow: 0 15px 32px rgb(67 52 43 / 30%);
  transform: translateY(-2px);
}

.floating-cart:focus-visible {
  outline: 3px solid rgb(42, 126, 125);
  outline-offset: 3px;
}

.floating-cart__icon {
  position: relative;
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 10px;
  background: rgb(255 251 245 / 14%);
}

.floating-cart__badge {
  position: absolute;
  top: -7px;
  right: -7px;
  display: grid;
  min-width: 23px;
  height: 23px;
  padding: 0 5px;
  place-items: center;
  border: 2px solid rgb(111, 78, 55);
  border-radius: 12px;
  background: rgb(42, 126, 125);
  color: white;
  font-size: .68rem;
  font-weight: 800;
  line-height: 1;
}

.floating-cart__content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.floating-cart__content strong {
  font-size: 1rem;
  line-height: 1.25;
}

.floating-cart__content span {
  margin-top: 3px;
  color: rgb(255 251 245 / 78%);
  font-size: .78rem;
}

.floating-cart__total {
  font-size: 1.05rem;
  font-weight: 800;
  white-space: nowrap;
}

.floating-cart__arrow {
  color: rgb(255 251 245 / 75%);
}

@media (max-width: 599px) {
  .floating-cart {
    right: auto;
    bottom: calc(16px + env(safe-area-inset-bottom));
    left: 16px;
    width: min(240px, calc(100vw - 84px));
    min-width: 0;
    min-height: 64px;
    padding: 9px 12px;
    grid-template-columns: 44px minmax(0, 1fr) auto 18px;
    border-radius: 10px;
  }

  .floating-cart__icon {
    width: 44px;
    height: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .floating-cart {
    transition: none;
  }
}
</style>
