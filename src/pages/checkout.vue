<template>
  <main class="checkout-page">
    <v-container class="checkout-container py-8 py-md-12">
      <header class="checkout-heading">
        <div class="checkout-kicker">YOUR ORDER</div>
        <h1 class="checkout-title">確認訂單</h1>

        <p class="checkout-lead">
          請確認您的餐點與用餐方式，我們將為您準備餐點。
        </p>
      </header>

      <div class="checkout-layout">
        <section class="checkout-options">
          <v-card class="checkout-section" elevation="0">
            <div class="section-heading">
              <v-icon icon="mdi-silverware-fork-knife" size="18" />
              <h2>用餐方式</h2>
            </div>

            <v-btn-toggle
              v-model="orderType"
              class="order-type-toggle"
              divided
              mandatory
            >
              <v-btn value="dine-in">
                <v-icon icon="mdi-table-furniture" />
                <span>內用</span>
              </v-btn>

              <v-btn value="takeaway">
                <v-icon icon="mdi-shopping" />

                <span>外帶</span>
              </v-btn>
            </v-btn-toggle>
          </v-card>

          <v-card class="checkout-section payment-section" elevation="0">
            <div class="section-heading">
              <v-icon icon="mdi-cash-register" size="18" />
              <h2>付款方式</h2>
            </div>

            <div class="payment-notice">
              <v-icon icon="mdi-storefront-outline" size="22" />

              <div>
                <strong>櫃台結帳</strong>
                <p>送出訂單後將取得點餐編號，請至櫃台結帳。</p>
              </div>

              <v-icon class="payment-check" icon="mdi-check-circle" size="20" />
            </div>
          </v-card>

          <div class="checkout-note">
            <v-icon icon="mdi-information-outline" size="18" />
            <span>訂單送出後，請依照點餐編號至櫃台完成付款。</span>
          </div>
        </section>

        <v-card class="order-summary" elevation="0">
          <div class="section-heading order-summary-heading">
            <h2>訂單摘要</h2>
            <span>共 {{ cartStore.totalQuantity }} 件商品</span>

          </div>

          <div class="order-items">
            <article
              v-for="(item, index) in cartStore.items"
              :key="index"
              class="order-item"
            >
              <v-img
                class="order-item-image"
                cover
                height="72"
                rounded="lg"
                :src="item.imageUrl"
                width="72"
              />

              <div class="order-item-content">
                <div class="order-item-topline">
                  <h3>{{ item.name }} ×{{ item.quantity }}</h3>
                  <strong>${{ getItemUnitPrice(item) * item.quantity }}</strong>
                </div>

                <div
                  v-if="getSelectedModifiers(item).length > 0"
                  class="checkout-modifiers"
                >
                  <div
                    v-for="modifier in getSelectedModifiers(item)"
                    :key="`${modifier.groupName}-${modifier.itemName}`"
                  >
                    {{ modifier.groupName }}：{{ modifier.itemName }}
                    <span v-if="modifier.extraPrice > 0">
                      (+${{ modifier.extraPrice }})
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div class="order-totals">
            <div><span>小計</span><span>${{ totalPrice }}</span></div>
            <div><span>服務費</span><span>$0</span></div>
            <div class="order-total"><strong>總計</strong><strong>${{ totalPrice }}</strong></div>

          </div>

          <div class="checkout-action-bar">
            <v-alert
              v-if="submitError"
              class="submit-error"
              density="compact"
              type="warning"
              variant="tonal"
            >
              {{ submitError }}
            </v-alert>

            <v-btn
              block
              class="back-to-menu-btn"
              to="/menu"
              variant="outlined"
            >
              回到繼續點餐
            </v-btn>

            <v-btn
              block
              class="submit-order-btn"
              :disabled="submitting || cartStore.items.length === 0"
              :loading="submitting"
              size="large"
              variant="flat"
              @click="submitOrder"
            >
              <v-icon icon="mdi-check-circle-outline" start />
              確認送出
            </v-btn>
          </div>

          <div class="summary-footer">THANK YOU FOR DINING WITH US</div>
        </v-card>
      </div>
    </v-container>
  </main>
</template>

<script setup lang="ts">
  import type { CartItem, CartModifierGroup } from '@/stores/cart'
  import type { OrderErrorResponse } from '@/types/order'
  import { isAxiosError } from 'axios'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { createOrder } from '@/api/order'
  import { useCartStore } from '@/stores/cart'

  const router = useRouter()
  interface SelectedModifier {
    groupId: string
    groupName: string
    itemName: string
    extraPrice: number
  }

  const cartStore = useCartStore()

  const orderType = ref<'dine-in' | 'takeaway'>('takeaway')
  const submitting = ref(false)
  const submitError = ref('')

  const totalPrice = computed(() => {
    return cartStore.items.reduce(
      (total, item: CartItem) => total + getItemUnitPrice(item) * item.quantity,
      0,
    )
  })

  function getSelectedModifiers (item: CartItem): SelectedModifier[] {
    return Object.entries(item.modifiers).flatMap(([groupId, itemNames]) => {
      const group = item.modifierGroups.find(
        (modifierGroup: CartModifierGroup) => modifierGroup._id === groupId,
      )

      if (!group) return []

      return itemNames.flatMap(itemName => {
        const modifierItem = group.items.find(
          option => option.name === itemName,
        )

        return modifierItem
          ? [{
            groupId: group._id,
            groupName: group.name,
            itemName: modifierItem.name,
            extraPrice: modifierItem.extraPrice,
          }]
          : []
      })
    })
  }

  function getItemUnitPrice (item: CartItem) {
    return item.price + getSelectedModifiers(item).reduce(
      (total, modifier) => total + modifier.extraPrice,
      0,
    )
  }

  async function submitOrder () {
    if (submitting.value || cartStore.items.length === 0) return

    submitError.value = ''
    submitting.value = true

    try {
      const orderData = {
        orderType: orderType.value,
        items: cartStore.items.map((item: CartItem) => ({
          productId: item.productId,
          quantity: item.quantity,
          modifiers: getSelectedModifiers(item).map(modifier => ({
            groupId: modifier.groupId,
            itemName: modifier.itemName,
          })),
        })),
      }

      const data = await createOrder(orderData)

      console.log('訂單建立成功', data.result)

      const orderNumber = data.result.orderNumber
      const lookupToken = data.result.lookupToken

      sessionStorage.setItem(
        'orderLookupToken',
        JSON.stringify({ orderNumber, lookupToken }),
      )

      cartStore.clearCart()

      await router.push({
        path: '/order-success',
        query: {
          orderNumber,
        },
      })
    } catch (error) {
      console.error('訂單建立失敗', error)
      submitError.value = isAxiosError<OrderErrorResponse>(error)
        ? error.response?.data.message ?? '訂單送出失敗，請稍後再試'
        : '訂單送出失敗，請稍後再試'
    } finally {
      submitting.value = false
    }
  }
</script>

<style scoped>
.checkout-page {
  background: #fdf0d1;
  color: #49372d;
  min-height: calc(100vh - 64px);
}

.checkout-container {
  max-width: 1120px;
}

.checkout-heading {
  margin-bottom: 28px;
}

.checkout-kicker {
  color: #94847a;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  margin-bottom: 6px;
}

.checkout-title {
  color: #56382d;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.1;
  margin: 0;
}

.checkout-lead {
  color: #94847a;
  font-size: 0.85rem;
  margin: 8px 0 0;
}

.checkout-layout {
  align-items: start;
  display: grid;
  gap: 28px;
  grid-template-columns: minmax(0, 1fr) 380px;
}

.checkout-options {
  display: grid;
  gap: 20px;
}

.checkout-section,
.order-summary {
  background: #fdf0d1;
  border: 2px solid #6f4e37;
  border-radius: 10px;
  color: #49372d;
  padding: 24px;
}

.section-heading {
  align-items: center;
  color: #56382d;
  display: flex;
  gap: 9px;
  margin-bottom: 18px;
}

.section-heading h2 {
  font-size: 1rem;
  margin: 0;
}

.order-type-toggle {
  align-items: start;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, 300px);
  height: 150px !important;
}

.order-type-toggle :deep(.v-btn) {
  background: transparent !important;
  border: 1px solid #d8c7b8 !important;
  border-radius: 10px !important;
  color: #56382d;
  display: flex;
  flex: 0 0 300px !important;
  flex-direction: column;
  gap: 5px;
  height: 150px !important;
  min-height: 150px !important;
  min-width: 300px !important;
  text-transform: none;
  width: 300px !important;
  font-size: 1.1rem;
}

.order-type-toggle :deep(.v-btn--selected),
.order-type-toggle :deep(.v-btn--active),
.order-type-toggle :deep(.v-btn[aria-pressed='true']) {
  background: #fef2a0 !important;
  border-color: #806c35 !important;
  color: #49372d !important;
}

.order-type-toggle :deep(.v-btn--selected::before),
.order-type-toggle :deep(.v-btn--active::before),
.order-type-toggle :deep(.v-btn[aria-pressed='true']::before) {
  background: transparent !important;
}

.order-type-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.payment-section {
  padding-bottom: 18px;
}

.payment-notice {
  align-items: center;
  background: #f7f2ea;
  border: 1px solid #e7dbcf;
  border-radius: 10px;
  display: flex;
  gap: 12px;
  padding: 13px 14px;
}

.payment-notice strong {
  color: #56382d;
  font-size: 0.9rem;
}

.payment-notice p {
  color: #94847a;
  font-size: 0.75rem;
  margin: 3px 0 0;
}

.payment-check {
  color: #6f7a42;
  margin-left: auto;
}

.checkout-note {
  align-items: flex-start;
  background: #fff9d9;
  border: 1px solid #eee2ac;
  border-radius: 10px;
  color: #806c35;
  display: flex;
  font-size: 0.75rem;
  gap: 9px;
  line-height: 1.5;
  padding: 14px;
}

.order-summary {
  position: sticky;
  top: 88px;
}

.order-summary-heading {
  justify-content: space-between;
}

.order-summary-heading span {
  color: #94847a;
  font-size: 0.7rem;
}

.order-items {
  max-height: 420px;
  overflow-y: auto;
}

.order-item {
  display: flex;
  gap: 12px;
  padding: 0 0 15px;
}

.order-item + .order-item {
  padding-top: 15px;
}

.order-item-image {
  background: #eee5d9;
  flex: 0 0 72px;
}

.order-item-content {
  min-width: 0;
  width: 100%;
}

.order-item-topline {
  align-items: start;
  display: flex;
  gap: 8px;
  justify-content: space-between;
}

.order-item-topline h3 {
  color: #56382d;
  font-size: 0.9rem;
  line-height: 1.35;
  margin: 0;
}

.order-item-topline strong {
  color: #56382d;
  font-size: 0.8rem;
  white-space: nowrap;
}

.order-item-meta,
.checkout-modifiers {
  color: #94847a;
  font-size: 0.72rem;
  line-height: 1.55;
}

.checkout-modifiers {
  margin-top: 5px;
}

.order-totals {
  border-top: 1px solid #e7dbcf;
  color: #94847a;
  display: grid;
  font-size: 0.8rem;
  gap: 9px;
  margin-top: 20px;
  padding-top: 18px;
}

.order-totals > div {
  display: flex;
  justify-content: space-between;
}

.order-total {
  color: #56382d;
  font-size: 1rem;
  margin-top: 7px;
}

.submit-order-btn {
  background: #6f6b38;
  border-radius: 10px;
  color: #fffaf4;
  margin-top: 20px;
  text-transform: none;
}

.back-to-menu-btn {
  border-color: #806c35;
  border-radius: 10px;
  color: #56382d;
  margin-top: 20px;
  text-transform: none;
}

.checkout-action-bar {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
}

.submit-error {
  border-radius: 10px;
  color: #6b431f;
  font-size: 0.8rem;
  grid-column: 1 / -1;
}

.back-to-menu-btn:hover,
.back-to-menu-btn:focus-visible {
  background: #fef2a0;
}

.submit-order-btn:hover,
.submit-order-btn:focus-visible {
  background: #56382d;
}

.summary-footer {
  color: #94847a;
  font-size: 0.52rem;
  letter-spacing: 0.14em;
  margin-top: 10px;
  text-align: center;
}

@media (max-width: 800px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }
}

@media (max-width: 599px) {
  .checkout-container {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }

  .checkout-section,
  .order-summary {
    border-radius: 10px;
    padding: 18px;
  }

  .order-type-toggle {
    gap: 8px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
  }

  .order-type-toggle :deep(.v-btn) {
    flex: 1 1 0 !important;
    height: 150px !important;
    min-width: 0 !important;
    width: auto !important;
  }

  .checkout-page {
    padding-bottom: calc(108px + env(safe-area-inset-bottom));
  }

  .checkout-action-bar {
    background: #fdf0d1;
    bottom: 0;
    box-shadow: 0 -8px 20px rgba(73, 55, 45, 0.08);
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
    left: 0;
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
    position: fixed;
    right: 0;
    z-index: 10;
  }

  .checkout-action-bar .back-to-menu-btn,
  .checkout-action-bar .submit-order-btn {
    margin-top: 0;
    min-height: 48px;
  }

  .checkout-action-bar .back-to-menu-btn {
    font-size: 0.8rem;
  }

  .checkout-action-bar .submit-order-btn {
    font-size: 0.95rem;
  }
}

</style>
