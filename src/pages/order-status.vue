<template>
  <main class="order-status-page">
    <v-container class="order-status-container">
      <header class="order-status-heading">
        <div>
          <span class="order-status-eyebrow">CAFE TIME · ORDER TRACKER</span>
          <h1 class="order-status-title">訂單狀態</h1>
          <p class="order-status-subtitle">輸入訂單編號即可查看目前進度</p>
        </div>
      </header>

      <v-text-field
        v-model="searchText"
        class="status-search"
        clearable
        hide-details
        label="搜尋訂單編號"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
      />

      <v-progress-linear v-if="loading" class="status-loading" color="#6f4e37" indeterminate rounded />

      <v-alert v-if="errorMessage" class="mb-5" type="error" variant="tonal">
        {{ errorMessage }}
      </v-alert>

      <v-row>
        <v-col cols="12" md="6">
          <v-card class="status-panel" elevation="0">
            <div class="status-panel__heading">
              <h2>製作中</h2>
              <span>{{ preparingOrders.length }}</span>
            </div>
            <div class="status-panel__body">
              <OrderStatusCard
                v-for="order in preparingOrders"
                :key="order._id"
                :order-number="order.orderNumber"
                status="preparing"
              />
              <div v-if="!loading && preparingOrders.length === 0" class="status-empty">
                {{ searchText ? '找不到符合的製作中訂單' : '目前沒有製作中的訂單' }}
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="status-panel status-panel--ready" elevation="0">
            <div class="status-panel__heading">
              <h2>可以取餐</h2>
              <span>{{ readyOrders.length }}</span>
            </div>
            <div class="status-panel__body">
              <OrderStatusCard
                v-for="order in readyOrders"
                :key="order._id"
                :order-number="order.orderNumber"
                status="ready"
              />
              <div v-if="!loading && readyOrders.length === 0" class="status-empty">
                {{ searchText ? '找不到符合的待取餐訂單' : '目前沒有待取餐訂單' }}
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  import OrderStatusCard from '@/components/OrderStatusCard.vue'
  import api from '@/plugins/axios'

  interface Order {
    _id: string
    orderNumber: string
    status: 'preparing' | 'ready'
  }

  const orders = ref<Order[]>([])
  const loading = ref(false)
  const errorMessage = ref('')
  const searchText = ref('')
  let refreshTimer: ReturnType<typeof setInterval> | undefined
  let isRefreshing = false

  const searchedOrders = computed(() => {
    const keyword = searchText.value.trim().toLowerCase()
    return keyword
      ? orders.value.filter(order => order.orderNumber.toLowerCase().includes(keyword))
      : orders.value
  })

  const preparingOrders = computed(() => searchedOrders.value.filter(order => order.status === 'preparing'))
  const readyOrders = computed(() => searchedOrders.value.filter(order => order.status === 'ready'))

  async function getOrderStatus (showLoading = true) {
    if (isRefreshing) return
    isRefreshing = true
    if (showLoading) loading.value = true
    errorMessage.value = ''

    try {
      const { data } = await api.get<{ result: Order[] }>('/api/orders/status')
      orders.value = Array.isArray(data.result) ? data.result : []
    } catch (error) {
      console.error('Failed to load order status', error)
      errorMessage.value = '目前無法取得訂單狀態，請稍後再試。'
    } finally {
      loading.value = false
      isRefreshing = false
    }
  }

  onMounted(() => {
    void getOrderStatus()
    refreshTimer = setInterval(() => void getOrderStatus(false), 5000)
  })

  onBeforeUnmount(() => {
    if (refreshTimer) clearInterval(refreshTimer)
  })
</script>

<style scoped>
.order-status-page { min-height: calc(100vh - 72px); background: #f8eedb; color: #3a2118; }
.order-status-container { max-width: 1080px; padding: 48px 20px; }
.order-status-heading { margin-bottom: 24px; }
.order-status-eyebrow { color: #8b6f5b; font-size: .72rem; letter-spacing: .14em; }
.order-status-title { margin: 8px 0; color: #542b1b; font-size: clamp(2rem, 5vw, 3.4rem); }
.order-status-subtitle { margin: 0; color: #8b6f5b; }
.status-search { margin-bottom: 24px; }
.status-loading { margin-bottom: 24px; }
.status-panel { min-height: 240px; padding: 24px; background: #fffaf1; border: 1px solid #e5d3bf; border-radius: 20px; color: #3a2118; }
.status-panel__heading { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; color: #542b1b; }
.status-panel__heading h2 { margin: 0; font-size: 1.2rem; }
.status-panel__heading span { font-weight: 700; }
.status-panel__body { display: grid; gap: 12px; }
.status-empty { padding: 36px 8px; color: #8b6f5b; text-align: center; }
</style>
