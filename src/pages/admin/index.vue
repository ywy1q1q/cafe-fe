<template>
  <v-container class="dashboard-page">
    <header class="dashboard-header">
      <div>
        <p class="dashboard-kicker mb-1">
          TODAY'S CAFE
        </p>

        <h1 class="dashboard-title">
          今日營運總覽
        </h1>

        <p class="dashboard-date mb-0">
          {{ formattedToday }}・資料更新於 {{ formattedUpdatedAt }}
        </p>
      </div>

      <div class="dashboard-actions">
        <v-btn
          class="secondary-action"
          prepend-icon="mdi-receipt-text-outline"
          to="/admin/orders"
          variant="outlined"
        >
          訂單管理
        </v-btn>

        <v-btn
          class="refresh-action"
          :loading="refreshing"
          prepend-icon="mdi-refresh"
          variant="flat"
          @click="loadDashboard"
        >
          重新整理
        </v-btn>
      </div>
    </header>

    <v-progress-linear
      v-if="initialLoading"
      class="dashboard-loading"
      color="warning"
      indeterminate
    />

    <section
      aria-label="今日營運數據"
      class="stat-grid"
    >
      <button
        v-for="stat in statItems"
        :key="stat.key"
        class="stat-card"
        :class="`stat-card--${stat.tone}`"
        type="button"
        @click="goToOrders"
      >
        <span class="stat-icon">
          <v-icon :icon="stat.icon" size="22" />
        </span>

        <span class="stat-content">
          <span class="stat-label">{{ stat.label }}</span>
          <strong class="stat-value">{{ stat.value }}</strong>
          <span class="stat-note">{{ stat.note }}</span>
        </span>
      </button>
    </section>

    <div class="dashboard-grid">
      <section class="dashboard-panel hot-products-panel">
        <div class="panel-header">
          <div>
            <p class="panel-kicker mb-1">POPULAR TODAY</p>
            <h2 class="panel-title">今日熱銷商品</h2>
          </div>

          <v-icon class="panel-header-icon" icon="mdi-chart-bar" size="28" />
        </div>

        <div v-if="hotProducts.length > 0" class="hot-product-list">
          <div
            v-for="(product, index) in hotProducts"
            :key="product.name"
            class="hot-product-row"
          >
            <span class="rank-number">{{ String(index + 1).padStart(2, '0') }}</span>

            <div class="hot-product-info">
              <div class="hot-product-heading">
                <strong>{{ product.name }}</strong>
                <span>{{ product.quantity }} 份</span>
              </div>

              <div aria-hidden="true" class="sales-track">
                <span :style="{ width: `${product.percentage}%` }" />
              </div>
            </div>

            <strong class="hot-product-sales">
              {{ formatCurrency(product.sales) }}
            </strong>
          </div>
        </div>

        <div v-else class="panel-empty">
          <v-icon icon="mdi-coffee-outline" size="38" />
          <span>今日尚無商品銷售資料</span>
        </div>
      </section>

      <section class="dashboard-panel inventory-panel">
        <div class="panel-header">
          <div>
            <p class="panel-kicker mb-1">STOCK NOTICE</p>
            <h2 class="panel-title">庫存提醒</h2>
          </div>

          <v-btn
            aria-label="前往商品管理"
            class="panel-link-btn"
            icon="mdi-arrow-right"
            size="small"
            to="/admin/products"
            variant="text"
          />
        </div>

        <div v-if="lowStockProducts.length > 0" class="inventory-list">
          <div
            v-for="product in lowStockProducts"
            :key="product._id"
            class="inventory-row"
          >
            <span
              class="stock-dot"
              :class="{ 'stock-dot--empty': product.stock === 0 }"
            />

            <div class="inventory-info">
              <strong>{{ product.name }}</strong>
              <span>{{ product.stock === 0 ? '目前無庫存' : '請留意剩餘數量' }}</span>
            </div>

            <span
              class="stock-count"
              :class="{ 'stock-count--empty': product.stock === 0 }"
            >
              {{ product.stock === 0 ? '已售完' : `剩 ${product.stock}` }}
            </span>
          </div>
        </div>

        <div v-else class="panel-empty panel-empty--success">
          <v-icon icon="mdi-check-circle-outline" size="38" />
          <span>目前沒有低庫存商品</span>
        </div>
      </section>
    </div>

    <section class="dashboard-panel recent-orders-panel">
      <div class="panel-header recent-orders-header">
        <div>
          <p class="panel-kicker mb-1">RECENT ORDERS</p>
          <h2 class="panel-title">今日最近訂單</h2>
        </div>

        <v-btn
          append-icon="mdi-arrow-right"
          class="panel-text-link"
          to="/admin/orders"
          variant="text"
        >
          查看全部
        </v-btn>
      </div>

      <div v-if="recentOrders.length > 0" class="recent-order-list">
        <button
          v-for="order in recentOrders"
          :key="order._id"
          class="recent-order-row"
          type="button"
          @click="selectedOrder = order"
        >
          <span class="order-number">{{ order.orderNumber }}</span>

          <span class="order-type">
            <v-icon
              :icon="order.orderType === 'dine-in' ? 'mdi-silverware-fork-knife' : 'mdi-shopping-outline'"
              size="18"
            />
            {{ order.orderType === 'dine-in' ? '內用' : '外帶' }}
          </span>

          <span class="order-time">{{ formatTime(order.createdAt) }}</span>

          <span class="order-items">{{ getOrderQuantity(order) }} 項商品</span>

          <span class="status-chip" :class="`status-chip--${order.status}`">
            {{ getStatusLabel(order.status) }}
          </span>

          <strong class="order-total">{{ formatCurrency(order.totalPrice) }}</strong>

          <v-icon class="order-arrow" icon="mdi-chevron-right" size="20" />
        </button>
      </div>

      <div v-else class="panel-empty recent-orders-empty">
        <v-icon icon="mdi-receipt-text-outline" size="38" />
        <span>今日尚無訂單</span>
      </div>
    </section>

    <v-dialog
      max-width="640"
      :model-value="Boolean(selectedOrder)"
      @update:model-value="closeOrderDialog"
    >
      <v-card v-if="selectedOrder" class="order-dialog" elevation="0">
        <div class="order-dialog-header">
          <div>
            <p class="panel-kicker mb-1">ORDER DETAIL</p>
            <h2 class="order-dialog-title">訂單 {{ selectedOrder.orderNumber }}</h2>
          </div>

          <v-btn
            aria-label="關閉訂單明細"
            icon="mdi-close"
            variant="text"
            @click="selectedOrder = null"
          />
        </div>

        <div class="order-dialog-meta">
          <span>{{ selectedOrder.orderType === 'dine-in' ? '內用' : '外帶' }}</span>

          <span>{{ formatDateTime(selectedOrder.createdAt) }}</span>

          <span class="status-chip" :class="`status-chip--${selectedOrder.status}`">
            {{ getStatusLabel(selectedOrder.status) }}
          </span>
        </div>

        <v-divider />

        <div class="order-dialog-items">
          <div
            v-for="item in selectedOrder.items"
            :key="`${item.productId}-${item.productName}`"
            class="order-dialog-item"
          >
            <div>
              <strong>{{ item.productName }}</strong>

              <p v-if="item.modifiers.length > 0" class="modifier-text mb-0">
                {{ item.modifiers.map(modifier => modifier.itemName).join('、') }}
              </p>
            </div>

            <span>× {{ item.quantity }}</span>
            <strong>{{ formatCurrency(item.subtotal) }}</strong>
          </div>
        </div>

        <div class="order-dialog-total">
          <span>總計</span>
          <strong>{{ formatCurrency(selectedOrder.totalPrice) }}</strong>
        </div>

        <v-card-actions class="order-dialog-actions">
          <v-btn variant="text" @click="selectedOrder = null">關閉</v-btn>

          <v-btn class="refresh-action" to="/admin/orders" variant="flat">
            前往訂單管理
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="showError" color="error" timeout="3000">
      儀表板資料載入失敗，請稍後再試。
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
  import type { IOrder, OrderStatus } from '@/types/order'
  import type { IProduct } from '@/types/product'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import * as orderApi from '@/api/order'
  import * as productApi from '@/api/product'

  interface HotProduct {
    name: string
    quantity: number
    sales: number
    percentage: number
  }

  const router = useRouter()
  const orders = ref<IOrder[]>([])
  const products = ref<IProduct[]>([])
  const selectedOrder = ref<IOrder | null>(null)
  const initialLoading = ref(true)
  const refreshing = ref(false)
  const showError = ref(false)
  const lastUpdatedAt = ref<Date | null>(null)

  const todayKey = getDateKey(new Date())

  const todayOrders = computed(() => orders.value.filter(
    order => getDateKey(new Date(order.createdAt)) === todayKey,
  ))

  const validTodayOrders = computed(() => todayOrders.value.filter(
    order => order.status !== 'cancelled',
  ))

  const todayRevenue = computed(() => validTodayOrders.value.reduce(
    (sum, order) => sum + order.totalPrice,
    0,
  ))

  const statusCounts = computed(() => ({
    pending: todayOrders.value.filter(order => order.status === 'pending').length,
    preparing: todayOrders.value.filter(order => order.status === 'preparing').length,
    ready: todayOrders.value.filter(order => order.status === 'ready').length,
  }))

  const statItems = computed(() => [
    {
      key: 'orders',
      label: '今日訂單',
      value: `${todayOrders.value.length}`,
      note: '查看今日所有訂單',
      icon: 'mdi-receipt-text-outline',
      tone: 'brown',
    },
    {
      key: 'revenue',
      label: '今日營業額',
      value: formatCurrency(todayRevenue.value),
      note: '不包含取消訂單',
      icon: 'mdi-cash-multiple',
      tone: 'coffee',
    },
    {
      key: 'pending',
      label: '未接單',
      value: `${statusCounts.value.pending}`,
      note: statusCounts.value.pending ? '等待店員處理' : '目前無待處理訂單',
      icon: 'mdi-bell-outline',
      tone: 'red',
    },
    {
      key: 'preparing',
      label: '製作中',
      value: `${statusCounts.value.preparing}`,
      note: '正在準備餐點',
      icon: 'mdi-coffee-maker-outline',
      tone: 'orange',
    },
    {
      key: 'ready',
      label: '可取餐',
      value: `${statusCounts.value.ready}`,
      note: '等待顧客取餐',
      icon: 'mdi-check-circle-outline',
      tone: 'teal',
    },
  ])

  const hotProducts = computed<HotProduct[]>(() => {
    const salesMap = new Map<string, { quantity: number, sales: number }>()

    for (const order of validTodayOrders.value) {
      for (const item of order.items) {
        const current = salesMap.get(item.productName) ?? { quantity: 0, sales: 0 }
        current.quantity += item.quantity
        current.sales += item.subtotal
        salesMap.set(item.productName, current)
      }
    }

    const ranked = sortItems(
      [...salesMap.entries()].map(([name, data]) => ({ name, ...data })),
      (a, b) => b.quantity - a.quantity || b.sales - a.sales,
    )
      .slice(0, 5)
    const highestQuantity = ranked[0]?.quantity ?? 1

    return ranked.map(product => ({
      ...product,
      percentage: Math.max(12, (product.quantity / highestQuantity) * 100),
    }))
  })

  const lowStockProducts = computed(() => sortItems(
    products.value.filter(product => product.stock <= 5),
    (a, b) => a.stock - b.stock || a.name.localeCompare(b.name, 'zh-Hant'),
  )
    .slice(0, 6))

  const recentOrders = computed(() => sortItems(
    todayOrders.value,
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
    .slice(0, 6))

  const formattedToday = new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date())

  const formattedUpdatedAt = computed(() => lastUpdatedAt.value
    ? new Intl.DateTimeFormat('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(lastUpdatedAt.value)
    : '--:--:--')

  async function loadDashboard () {
    if (refreshing.value) return

    refreshing.value = true

    try {
      const [orderResponse, productResponse] = await Promise.all([
        orderApi.getOrders(),
        productApi.getAllProducts(),
      ])

      orders.value = orderResponse.result
      products.value = productResponse.result
      lastUpdatedAt.value = new Date()
    } catch (error) {
      console.error('載入儀表板資料失敗', error)
      showError.value = true
    } finally {
      refreshing.value = false
      initialLoading.value = false
    }
  }

  function getDateKey (date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  function sortItems<T> (items: readonly T[], compare: (a: T, b: T) => number) {
    return items.reduce<T[]>((sortedItems, item) => {
      const insertAt = sortedItems.findIndex(sortedItem => compare(item, sortedItem) < 0)

      if (insertAt === -1) return [...sortedItems, item]

      return [
        ...sortedItems.slice(0, insertAt),
        item,
        ...sortedItems.slice(insertAt),
      ]
    }, [])
  }

  function formatCurrency (value: number) {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  function formatTime (value: string) {
    return new Intl.DateTimeFormat('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(value))
  }

  function formatDateTime (value: string) {
    return new Intl.DateTimeFormat('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(value))
  }

  function getStatusLabel (status: OrderStatus) {
    const labels: Record<OrderStatus, string> = {
      pending: '未接單',
      preparing: '製作中',
      ready: '可取餐',
      completed: '已完成',
      cancelled: '已取消',
    }

    return labels[status]
  }

  function getOrderQuantity (order: IOrder) {
    return order.items.reduce((sum, item) => sum + item.quantity, 0)
  }

  function closeOrderDialog (value: boolean) {
    if (!value) selectedOrder.value = null
  }

  function goToOrders () {
    void router.push('/admin/orders')
  }

  let timer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    void loadDashboard()
    timer = setInterval(loadDashboard, 10_000)
  })

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  definePage({
    meta: {
      layout: 'admin',
    },
  })
</script>

<style scoped>
:global(.admin-main) {
  background: #fff8e8 !important;
}

.dashboard-page {
  color: #2f251f;
  max-width: 1500px;
  min-height: 100%;
  padding: 28px 32px 40px;
}

.dashboard-header {
  align-items: flex-end;
  display: flex;
  gap: 24px;
  justify-content: space-between;
  margin-bottom: 24px;
}

.dashboard-kicker,
.panel-kicker {
  color: #96775f;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.dashboard-title {
  color: #2f251f;
  font-size: clamp(1.85rem, 3vw, 2.4rem);
  letter-spacing: -0.04em;
  line-height: 1.2;
  margin: 0;
}

.dashboard-date {
  color: #806c5d;
  font-size: 0.88rem;
  margin-top: 8px;
}

.dashboard-actions {
  display: flex;
  gap: 10px;
}

.secondary-action {
  border-color: #cdbba9;
  color: #4f3a2d;
}

.refresh-action {
  background: #6f4e37;
  color: #fffdf9;
}

.dashboard-loading {
  margin: -8px 0 16px;
}

.stat-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin-bottom: 18px;
}

.stat-card {
  align-items: flex-start;
  background: #fffdf9;
  border: 1px solid #e3d7ca;
  border-radius: 10px;
  color: #2f251f;
  cursor: pointer;
  display: flex;
  gap: 14px;
  min-height: 142px;
  padding: 20px;
  text-align: left;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}

.stat-card--coffee {
  background: #6f4e37;
  border-color: #6f4e37;
  color: #fffdf9;
}

.stat-icon {
  align-items: center;
  background: #f4eadf;
  border-radius: 10px;
  color: #6f4e37;
  display: inline-flex;
  flex: 0 0 42px;
  height: 42px;
  justify-content: center;
}

.stat-card--coffee .stat-icon {
  background: rgb(255 255 255 / 14%);
  color: #fffdf9;
}

.stat-card--red .stat-icon {
  background: #fff0ed;
  color: #b94b3f;
}

.stat-card--orange .stat-icon {
  background: #fff3df;
  color: #b86b18;
}

.stat-card--teal .stat-icon {
  background: #e7f4ef;
  color: #2a7e7d;
}

.stat-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.stat-label {
  color: #806c5d;
  font-size: 0.82rem;
  font-weight: 650;
}

.stat-card--coffee .stat-label,
.stat-card--coffee .stat-note {
  color: rgb(255 253 249 / 72%);
}

.stat-value {
  font-size: clamp(1.65rem, 2.2vw, 2.1rem);
  letter-spacing: -0.04em;
  line-height: 1.2;
  margin: 5px 0;
}

.stat-note {
  color: #9a8778;
  font-size: 0.73rem;
  line-height: 1.4;
}

.dashboard-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(0, 1.65fr) minmax(300px, 0.85fr);
  margin-bottom: 18px;
}

.dashboard-panel {
  background: #fffdf9;
  border: 1px solid #e3d7ca;
  border-radius: 10px;
  box-shadow: 0 5px 18px rgb(73 49 33 / 5%);
}

.hot-products-panel,
.inventory-panel {
  min-height: 356px;
  padding: 22px 24px;
}

.panel-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
}

.panel-title {
  color: #2f251f;
  font-size: 1.2rem;
  line-height: 1.25;
  margin: 0;
}

.panel-header-icon,
.panel-link-btn,
.panel-text-link {
  color: #6f4e37;
}

.hot-product-list,
.inventory-list {
  display: flex;
  flex-direction: column;
}

.hot-product-row {
  align-items: center;
  border-top: 1px solid #eee5dc;
  display: grid;
  gap: 16px;
  grid-template-columns: 32px minmax(0, 1fr) auto;
  min-height: 54px;
  padding: 12px 0;
}

.hot-product-row:first-child,
.inventory-row:first-child {
  border-top: 0;
}

.rank-number {
  color: #b69b83;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.hot-product-heading {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-bottom: 8px;
}

.hot-product-heading strong,
.inventory-info strong {
  font-size: 0.9rem;
}

.hot-product-heading span,
.inventory-info span {
  color: #8e7969;
  font-size: 0.74rem;
}

.sales-track {
  background: #efe5db;
  border-radius: 999px;
  height: 5px;
  overflow: hidden;
}

.sales-track span {
  background: #a87955;
  border-radius: inherit;
  display: block;
  height: 100%;
}

.hot-product-sales {
  font-size: 0.86rem;
}

.inventory-row {
  align-items: center;
  border-top: 1px solid #eee5dc;
  display: grid;
  gap: 12px;
  grid-template-columns: 10px minmax(0, 1fr) auto;
  min-height: 51px;
  padding: 11px 0;
}

.stock-dot {
  background: #c7832e;
  border-radius: 50%;
  height: 8px;
  width: 8px;
}

.stock-dot--empty {
  background: #c45449;
}

.inventory-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.inventory-info strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stock-count {
  background: #fff2dc;
  border-radius: 999px;
  color: #9b5d18;
  font-size: 0.72rem;
  font-weight: 750;
  padding: 5px 9px;
}

.stock-count--empty {
  background: #fff0ed;
  color: #ad473d;
}

.panel-empty {
  align-items: center;
  color: #9a8778;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  min-height: 230px;
}

.panel-empty--success {
  color: #4f8175;
}

.recent-orders-panel {
  overflow: hidden;
}

.recent-orders-header {
  margin: 0;
  padding: 20px 24px 16px;
}

.recent-order-list {
  border-top: 1px solid #e9ded3;
}

.recent-order-row {
  align-items: center;
  background: transparent;
  border: 0;
  border-bottom: 1px solid #eee5dc;
  color: #2f251f;
  cursor: pointer;
  display: grid;
  gap: 14px;
  grid-template-columns: 90px 95px 76px minmax(100px, 1fr) 84px 96px 20px;
  min-height: 64px;
  padding: 10px 24px;
  text-align: left;
  width: 100%;
}

.recent-order-row:last-child {
  border-bottom: 0;
}

.order-number {
  font-size: 1rem;
  font-weight: 800;
}

.order-type {
  align-items: center;
  color: #6e5d50;
  display: flex;
  gap: 7px;
}

.order-time,
.order-items {
  color: #8e7969;
  font-size: 0.82rem;
}

.status-chip {
  border-radius: 999px;
  display: inline-flex;
  font-size: 0.72rem;
  font-weight: 750;
  justify-content: center;
  padding: 5px 9px;
  white-space: nowrap;
}

.status-chip--pending {
  background: #fff0ed;
  color: #b94b3f;
}

.status-chip--preparing {
  background: #fff2dc;
  color: #aa6519;
}

.status-chip--ready {
  background: #e7f4ef;
  color: #2a7473;
}

.status-chip--completed {
  background: #efede9;
  color: #665d55;
}

.status-chip--cancelled {
  background: #f1f1f1;
  color: #8b8b8b;
}

.order-total {
  text-align: right;
}

.order-arrow {
  color: #b5a494;
}

.recent-orders-empty {
  min-height: 170px;
}

.order-dialog {
  background: #fffdf9;
  border: 1px solid #e3d7ca;
  border-radius: 10px !important;
  color: #2f251f;
  max-height: calc(100dvh - 32px);
  overflow: hidden;
}

.order-dialog-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 22px 24px 14px;
}

.order-dialog-title {
  font-size: 1.35rem;
  margin: 0;
}

.order-dialog-meta {
  align-items: center;
  color: #786557;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0 24px 18px;
}

.order-dialog-items {
  max-height: 360px;
  overflow-y: auto;
  padding: 4px 24px;
}

.order-dialog-item {
  align-items: center;
  border-bottom: 1px solid #eee5dc;
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(0, 1fr) 50px 90px;
  padding: 15px 0;
}

.order-dialog-item > strong {
  text-align: right;
}

.modifier-text {
  color: #8e7969;
  font-size: 0.78rem;
  margin-top: 4px;
}

.order-dialog-total {
  align-items: center;
  background: #f8f1e8;
  display: flex;
  font-size: 1.05rem;
  justify-content: space-between;
  padding: 16px 24px;
}

.order-dialog-total strong {
  font-size: 1.35rem;
}

.order-dialog-actions {
  gap: 8px;
  justify-content: flex-end;
  padding: 14px 24px 18px;
}

.stat-card:focus-visible,
.recent-order-row:focus-visible {
  outline: 3px solid rgb(111 78 55 / 28%);
  outline-offset: 2px;
}

@media (hover: hover) and (pointer: fine) {
  .stat-card:hover {
    border-color: #b89b82;
    box-shadow: 0 10px 24px rgb(73 49 33 / 10%);
    transform: translateY(-2px);
  }

  .stat-card--coffee:hover {
    border-color: #6f4e37;
  }

  .recent-order-row:hover {
    background: #fff8ee;
  }
}

@media (max-width: 1250px) {
  .stat-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .recent-order-row {
    grid-template-columns: 80px 80px 65px minmax(90px, 1fr) 78px 88px 18px;
  }
}

@media (max-width: 960px) {
  .dashboard-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .recent-order-row {
    grid-template-columns: 80px 1fr 76px 90px 18px;
  }

  .order-items,
  .order-type {
    display: none;
  }
}

@media (max-width: 700px) {
  .dashboard-page {
    padding: 20px 14px 32px;
  }

  .dashboard-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 18px;
  }

  .dashboard-actions {
    width: 100%;
  }

  .dashboard-actions .v-btn {
    flex: 1;
  }

  .stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stat-card {
    min-height: 128px;
    padding: 16px;
  }

  .stat-card:nth-child(2) {
    grid-column: span 2;
  }

  .hot-products-panel,
  .inventory-panel {
    min-height: 0;
    padding: 20px 16px;
  }

  .recent-orders-header {
    padding-inline: 16px;
  }

  .recent-order-row {
    gap: 10px;
    grid-template-columns: 66px 1fr 74px;
    padding-inline: 16px;
  }

  .order-time,
  .order-arrow {
    display: none;
  }

  .order-total {
    display: none;
  }

  .order-number {
    font-size: 0.92rem;
  }

  .hot-product-row {
    gap: 10px;
  }

  .hot-product-sales {
    display: none;
  }

  .order-dialog-header,
  .order-dialog-meta,
  .order-dialog-items,
  .order-dialog-actions {
    padding-left: 18px;
    padding-right: 18px;
  }
}

@media (max-width: 420px) {
  .stat-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .stat-card:nth-child(2) {
    grid-column: auto;
  }

  .stat-card {
    min-height: 112px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .stat-card {
    transition: none;
  }

  .stat-card:hover {
    transform: none;
  }
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>
