<template>
  <v-main class="order-success-page">
    <v-container class="order-success-container pb-10 pb-md-12">
      <section class="text-center success-heading">
        <div class="success-icon mx-auto mb-4">
          <v-icon
            icon="mdi-check"
            size="34"
          />
        </div>

        <h1 class="text-h4 text-md-h3 font-weight-bold mb-3">
          訂單已成立
        </h1>

        <div class="featured-order-number">
          <span>您的訂單編號</span>
          <strong>#{{ orderNumber || '---' }}</strong>
        </div>

        <p class="success-description mb-1">
          感謝您的訂購，我們即將為您準備餐點。
        </p>

        <p class="success-description">
          您隨時可以在「我的訂單」中追蹤狀態。
        </p>

      </section>

      <div class="checkout-notice d-flex align-start ga-3 mx-auto mt-5">
        <v-icon
          icon="mdi-information-outline"
          size="20"
        />

        <div>
          <strong>請至櫃台完成結帳後，餐點才會開始製作。</strong>
        </div>
      </div>

      <v-card
        id="order-details"
        class="order-card mx-auto mt-7"
        elevation="0"
        rounded="lg"
      >
        <v-card-text class="pa-5 pa-md-6">
          <div class="d-flex justify-space-between order-row pb-4">
            <span>付款方式</span>
            <strong>櫃台支付</strong>
          </div>

          <v-divider class="mb-4" />

          <div
            v-if="order"
            class="order-items"
          >
            <div
              v-for="item in order.items"
              :key="`${item.productId}-${item.productName}`"
              class="d-flex justify-space-between order-row"
            >
              <span>{{ item.productName }} ×{{ item.quantity }}</span>
              <span>${{ item.subtotal }}</span>
            </div>
          </div>

          <div
            v-else-if="isLoading"
            class="text-center py-4 text-medium-emphasis"
          >
            正在載入訂單資訊...
          </div>

          <div
            v-else
            class="text-center py-4 text-medium-emphasis"
          >
            暫時無法載入訂單明細
          </div>

          <div class="d-flex justify-space-between align-end total-row mt-5 pt-4">
            <div>
              <div>應付金額</div>
              <small>Total Amount</small>
            </div>

            <strong>${{ order?.totalPrice ?? '---' }}</strong>
          </div>

          <div class="pickup-notice d-flex align-center ga-3 mt-5">
            <v-icon
              icon="mdi-timer-outline"
              size="22"
            />

            <div>
              <strong>預計取餐時間：15–20 分鐘</strong>
              <div>餐點製作完成後，我們將通知您前來取餐</div>
            </div>
          </div>

        </v-card-text>
      </v-card>

      <div class="d-flex flex-column flex-sm-row justify-center ga-3 mt-7">
        <v-btn
          class="action-button primary-action"
          href="#order-details"
          prepend-icon="mdi-receipt-text-outline"
          size="large"
          to="/order-status"
        >
          查看訂單詳情
        </v-btn>

        <v-btn
          class="action-button secondary-action"
          prepend-icon="mdi-silverware-fork-knife"
          size="large"
          to="/"
          variant="outlined"
        >
          返回菜單
        </v-btn>
      </div>

      <div class="bottom-decoration d-flex justify-center ga-8 mt-12">
        <v-icon icon="mdi-coffee-outline" />
        <v-icon icon="mdi-food-croissant" />
        <v-icon icon="mdi-coffee-outline" />
      </div>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
  import axios from 'axios'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  interface OrderItem {
    productId: string
    productName: string
    quantity: number
    subtotal: number
  }

  interface Order {
    orderNumber: string
    items: OrderItem[]
    totalPrice: number
  }

  const route = useRoute()
  const orderNumber = String(route.query.orderNumber ?? '')
  const storedLookup = sessionStorage.getItem('orderLookupToken')
  let lookupToken = ''

  try {
    const parsedLookup = storedLookup
      ? JSON.parse(storedLookup) as {
        orderNumber?: string
        lookupToken?: string
      }
      : null

    if (parsedLookup?.orderNumber === orderNumber && typeof parsedLookup.lookupToken === 'string') {
      lookupToken = parsedLookup.lookupToken
    }
  } catch {
    lookupToken = ''
  }
  const isLoading = ref(true)
  const order = ref<Order | null>(null)

  onMounted(async () => {
    if (!orderNumber || !lookupToken) {
      isLoading.value = false
      return
    }

    try {
      const { data } = await axios.get(`http://localhost:4000/api/orders/${lookupToken}`)
      order.value = data.result
    } catch (error) {
      console.error('取得訂單詳情失敗', error)
    } finally {
      isLoading.value = false
    }
  })
</script>

<style scoped>
.order-success-page {
  min-height: calc(100vh - 48px);
  background: #fdf0d1;
  color: #5b4537;
}

.order-success-container {
  max-width: 820px;
  padding-top: 0px !important;
}

.success-icon {
  display: grid;
  width: 62px;
  height: 62px;
  place-items: center;
  color: #fffdf0;
  background: #645d36;
  border-radius: 50%;
  box-shadow: 0 5px 12px rgb(91 69 55 / 18%);
}

.success-heading h1 {
  color: #5b382d;
}

.success-description {
  color: #806f5e;
  font-size: 0.82rem;
}

.success-heading {
  margin-top: -12px;
  position: relative;
}

.featured-order-number {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-bottom: 18px;
  color: #806f5e;
}

.featured-order-number span {
  font-size: 0.75rem;
}

.featured-order-number strong {
  color: #5b382d;
  font-size: 2.65rem;
  letter-spacing: 0.06em;
}

.order-card {
  position: relative;
  overflow: hidden;
  max-width: 625px;
  background: #f7f6e9;
  box-shadow: 0 8px 18px rgb(91 69 55 / 14%) !important;
}

.order-row {
  color: #806f5e;
  font-size: 0.78rem;
}

.order-row strong {
  color: #5b382d;
}

.total-row {
  color: #806f5e;
  font-size: 0.78rem;
}

.total-row small {
  display: block;
  font-size: 0.58rem;
}

.total-row strong {
  color: #645d36;
  font-size: 2rem;
  line-height: 1;
}

.pickup-notice {
  padding: 10px 12px;
  color: #806f5e;
  background: #fff5b9;
  border-radius: 5px;
  font-size: 0.62rem;
}

.pickup-notice strong {
  display: block;
  color: #645d36;
  margin-bottom: 2px;
}

.checkout-notice {
  align-items: center;
  box-sizing: border-box;
  max-width: 625px;
  min-height: 52px;
  padding: 8px 14px;
  color: #5b382d;
  background: #fff1b8;
  border-radius: 5px;
  font-size: 0.82rem;
}

.checkout-notice strong {
  display: block;
  color: #5b382d;
  margin-bottom: 2px;
}

.action-button {
  min-width: 185px;
  border-radius: 7px;
  font-size: 0.78rem;
}

.primary-action {
  color: #fffdf0 !important;
  background: #76584d !important;
}

.secondary-action {
  color: #76584d !important;
  border-color: #76584d !important;
}

.bottom-decoration {
  color: #dfd8a9;
  opacity: 0.75;
}
</style>
