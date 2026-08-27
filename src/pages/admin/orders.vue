<template>
  <v-container class="orders-page">
    <div class="orders-header">
      <div class="d-flex align-center ga-3">
        <v-icon
          class="orders-header__icon"
          icon="mdi-clipboard-text-outline"
          size="34"
        />

        <h1 class="orders-title">
          訂單管理
        </h1>
      </div>

      <div class="orders-header__actions">
        <v-btn
          class="new-order-btn"
          variant="outlined"
          @click="newOrderDialog = true"
        >
          <v-badge
            v-if="newOrderNumber"
            color="error"
            dot
            floating
          >
            <v-icon icon="mdi-bell-outline" />
          </v-badge>

          <v-icon
            v-else
            icon="mdi-bell-outline"
          />
          新訂單
        </v-btn>

        <v-btn
          :loading="loading"
          prepend-icon="mdi-refresh"
          variant="outlined"
          @click="loadOrders"
        >
          重新整理
        </v-btn>
      </div>
    </div>

    <v-progress-linear
      v-if="loading"
      class="orders-loading"
      color="warning"
      indeterminate
    />

    <v-tabs
      v-model="selectedStatus"
      class="order-tabs mb-5"
      color="warning"
      density="comfortable"
    >
      <v-tab value="all">
        全部

        <v-chip
          class="ml-2"
          size="x-small"
          variant="tonal"
        >
          {{ getStatusCount('all') }}
        </v-chip>
      </v-tab>

      <v-tab
        v-for="tab in statusTabs"
        :key="tab.value"
        :value="tab.value"
      >
        {{ tab.label }}
        <v-chip
          class="ml-2"
          size="x-small"
          variant="tonal"
        >
          {{ getStatusCount(tab.value) }}
        </v-chip>
      </v-tab>
    </v-tabs>

    <v-row class="order-layout">
      <v-col
        class="order-list-column"
        cols="12"
        md="4"
      >
        <v-card
          class="order-panel order-list-panel"
          rounded="xl"
        >
          <div class="order-search-row">
            <v-text-field
              v-model="searchText"
              class="order-search"
              clearable
              density="comfortable"
              hide-details
              placeholder="搜尋訂單編號"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
            />

            <v-text-field
              ref="dateField"
              v-model="selectedDate"
              append-inner-icon="mdi-calendar-month-outline"
              class="order-date-field"
              density="comfortable"
              hide-details
              label="查看日期"
              type="date"
              variant="outlined"
              @click="openDatePicker"
              @click:append-inner.stop="openDatePicker"
            />
          </div>

          <div class="order-filter-actions">
            <span class="selected-date-label">{{ formatSelectedDate }}</span>

            <v-btn
              v-if="searchText"
              class="filter-btn"
              prepend-icon="mdi-close"
              size="small"
              variant="text"
              @click="searchText = ''"
            >
              清除搜尋
            </v-btn>
          </div>

          <div class="order-list-scroll">
            <OrderListItem
              v-for="order in filteredOrders"
              :key="order._id"
              :order="order"
              :selected="selectedOrder?._id === order._id"
              @select="selectedOrder = $event"
            />

            <div
              v-if="filteredOrders.length === 0"
              class="empty-orders"
            >
              找不到符合條件的訂單
            </div>
          </div>

          <div class="order-list-footer">
            共 {{ filteredOrders.length }} 筆訂單
          </div>
        </v-card>
      </v-col>

      <v-col
        class="order-detail-column"
        cols="12"
        md="8"
      >
        <v-card
          class="order-panel order-detail-panel"
          rounded="xl"
        >
          <OrderDetail
            v-if="selectedOrder"
            :order="selectedOrder"
            :products="products"
            @complete-order="openCompleteDialog"
            @update-status="updateStatus"
          />

          <div
            v-else
            class="empty-detail"
          >
            <v-icon
              icon="mdi-clipboard-text-outline"
              size="48"
            />

            <span>請選擇一筆訂單查看明細</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="newOrderDialog"
      max-width="420"
    >
      <v-card class="dialog-card" rounded="xl">
        <v-card-title class="font-weight-bold">
          有新訂單
        </v-card-title>

        <v-card-text>
          {{ newOrderNumber ? `訂單 ${newOrderNumber} 已送出。` : '目前沒有新的訂單。' }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="newOrderDialog = false">關閉</v-btn>
          <v-btn color="warning" variant="flat" @click="viewNewOrder">查看訂單</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="completeDialog"
      max-width="420"
    >
      <v-card class="dialog-card" rounded="xl">
        <v-card-title class="font-weight-bold">完成訂單</v-card-title>

        <v-card-text>
          確定要將訂單 <strong>{{ completingOrder?.orderNumber }}</strong> 設為已完成嗎？
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="completeDialog = false">返回</v-btn>
          <v-btn color="warning" variant="flat" @click="confirmComplete">確認完成</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
  import type { IOrder, OrderStatus } from '@/types/order'
  import type { IProduct } from '@/types/product'
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import * as orderApi from '@/api/order'
  import * as productApi from '@/api/product'
  import OrderDetail from '@/components/admin/OrderDetail.vue'
  import OrderListItem from '@/components/admin/OrderListItem.vue'

  type OrderFilter = 'all' | OrderStatus

  const orders = ref<IOrder[]>([])
  const selectedOrder = ref<IOrder | null>(null)
  const loading = ref(false)
  const products = ref<IProduct[]>([])
  const searchText = ref('')
  const selectedStatus = ref<OrderFilter>('all')
  const selectedDate = ref(getDateKey(new Date()))
  const dateField = ref<{ $el: HTMLElement } | null>(null)
  const newOrderDialog = ref(false)
  const newOrderNumber = ref('')
  const knownOrderIds = ref<string[]>([])
  const completeDialog = ref(false)
  const completingOrder = ref<IOrder | null>(null)

  const statusTabs: Array<{ value: OrderFilter, label: string }> = [
    { value: 'pending', label: '未接單' },
    { value: 'preparing', label: '製作中' },
    { value: 'ready', label: '可取餐' },
    { value: 'completed', label: '已完成' },
  ]

  async function loadOrders () {
    loading.value = true

    try {
      const response = await orderApi.getOrders()
      const latestOrders = response.result

      if (knownOrderIds.value.length > 0) {
        const newOrder = latestOrders.find(order => !knownOrderIds.value.includes(order._id))

        if (newOrder) {
          newOrderNumber.value = newOrder.orderNumber
          newOrderDialog.value = true
        }
      }

      const selectedId = selectedOrder.value?._id
      orders.value = latestOrders

      if (selectedId) {
        selectedOrder.value = latestOrders.find(order => order._id === selectedId) ?? null
      } else if (latestOrders.length > 0) {
        selectedOrder.value = getOrdersNewestFirst(latestOrders)[0] ?? null
      }

      knownOrderIds.value = latestOrders.map(order => order._id)
    } catch (error) {
      console.error('載入訂單失敗', error)
    } finally {
      loading.value = false
    }
  }

  async function loadProducts () {
    try {
      const response = await productApi.getAllProducts()
      products.value = response.result
    } catch (error) {
      console.error('載入商品失敗', error)
    }
  }

  function getStatusCount (status: OrderFilter) {
    const dateOrders = orders.value.filter(
      order => getDateKey(new Date(order.createdAt)) === selectedDate.value,
    )

    if (status === 'all') return dateOrders.length
    return dateOrders.filter(order => order.status === status).length
  }

  function getOrdersNewestFirst (orderList: IOrder[]) {
    return orderList.reduce<IOrder[]>((sortedOrders, order) => {
      const orderTime = new Date(order.createdAt).getTime()
      const insertIndex = sortedOrders.findIndex(
        sortedOrder => orderTime > new Date(sortedOrder.createdAt).getTime(),
      )

      if (insertIndex === -1) return [...sortedOrders, order]

      return [
        ...sortedOrders.slice(0, insertIndex),
        order,
        ...sortedOrders.slice(insertIndex),
      ]
    }, [])
  }

  const filteredOrders = computed(() => {
    const keyword = searchText.value.trim().toLowerCase()

    const matchingOrders = orders.value.filter(order => {
      const matchesDate = getDateKey(new Date(order.createdAt)) === selectedDate.value
      const matchesStatus = selectedStatus.value === 'all' || order.status === selectedStatus.value
      const matchesSearch = !keyword || order.orderNumber.toLowerCase().includes(keyword)
      return matchesDate && matchesStatus && matchesSearch
    })

    return getOrdersNewestFirst(matchingOrders)
  })

  const formatSelectedDate = computed(() => {
    if (!selectedDate.value) return '請選擇日期'

    const [year, month, day] = selectedDate.value.split('-')
    return `${year} 年 ${month} 月 ${day} 日`
  })

  function getDateKey (date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  function openDatePicker () {
    const input = dateField.value?.$el.querySelector<HTMLInputElement>('input[type="date"]')

    if (!input) return

    input.focus()
    input.showPicker?.()
  }

  function viewNewOrder () {
    const newOrder = orders.value.find(order => order.orderNumber === newOrderNumber.value)

    newOrderDialog.value = false

    if (!newOrder) return

    searchText.value = ''
    selectedStatus.value = 'all'
    selectedDate.value = getDateKey(new Date(newOrder.createdAt))
    selectedOrder.value = newOrder
    newOrderNumber.value = ''
  }

  watch(filteredOrders, visibleOrders => {
    if (!visibleOrders.some(order => order._id === selectedOrder.value?._id)) {
      selectedOrder.value = visibleOrders[0] ?? null
    }
  }, { immediate: true })

  async function updateStatus (id: string, status: IOrder['status']) {
    const currentOrder = orders.value.find(order => order._id === id)
    const shouldSelectNextPending = currentOrder?.status === 'pending' && status === 'preparing'

    try {
      await orderApi.updateOrderStatus(id, status)
      await loadOrders()

      if (shouldSelectNextPending) {
        selectedOrder.value = filteredOrders.value.find(
          order => order.status === 'pending',
        ) ?? selectedOrder.value
      }
    } catch (error) {
      console.error('更新訂單狀態失敗', error)
    }
  }

  function openCompleteDialog (order: IOrder) {
    completingOrder.value = order
    completeDialog.value = true
  }

  async function confirmComplete () {
    if (!completingOrder.value) return

    await updateStatus(completingOrder.value._id, 'completed')
    completeDialog.value = false
    completingOrder.value = null
  }

  let timer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    loadOrders()
    loadProducts()
    timer = setInterval(loadOrders, 10_000)
  })

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })
</script>

<style scoped>
.orders-page {
  max-width: 1500px;
  min-height: 100%;
  padding-top: 28px;
  color: #19202a;
}

:global(.admin-main) { background: #fff8e8 !important; }

.orders-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.orders-header__icon { color: #4e5968; }
.orders-title { margin: 0; font-size: clamp(1.8rem, 3vw, 2.3rem); letter-spacing: -0.04em; }
.orders-header__actions { display: flex; gap: 12px; }
.new-order-btn { background: #f7f9fc; }
.orders-loading { margin: -12px 0 14px; }

.order-tabs { color: #384454; }
.order-tabs :deep(.v-tab) { color: #384454; }
.order-tabs :deep(.v-tab--selected) { color: #a85b17; font-weight: 700; }

.order-layout { align-items: stretch; }
.order-list-column, .order-detail-column { padding-top: 0; padding-bottom: 0; }
.order-panel { height: calc(100vh - 245px); min-height: 560px; border: 1px solid #e1e5ea; background: #fff; box-shadow: 0 4px 18px rgb(26 38 55 / 4%); }
.order-list-panel { display: flex; flex-direction: column; padding: 18px 12px 0; }
.order-detail-panel { overflow: hidden; padding: 24px 24px 18px; }
.order-search-row { display: flex; gap: 10px; padding: 0 6px 4px; }
.order-search { flex: 1; }
.order-date-field { flex: 0 0 190px; }
.order-date-field :deep(.v-field),
.order-date-field :deep(input),
.order-date-field :deep(.v-field__append-inner) { cursor: pointer; }
.order-date-field :deep(.v-field__append-inner) { color: #8f4d18; }
.order-filter-actions { display: flex; align-items: center; justify-content: space-between; min-height: 38px; padding: 2px 8px 14px; }
.selected-date-label { color: #384454; font-size: .86rem; font-weight: 600; }
.filter-btn { border-color: #dfe3e8; color: #384454; }
.order-list-scroll { flex: 1; overflow-y: auto; padding: 4px 1px 0; }
.order-list-footer { padding: 15px; border-top: 1px solid #edf0f3; color: #657180; text-align: center; }
.empty-orders, .empty-detail { display: flex; align-items: center; justify-content: center; color: #7b8794; }
.empty-orders { min-height: 180px; }
.empty-detail { flex-direction: column; gap: 12px; height: 100%; }
.dialog-card { border: 1px solid #e1e5ea; border-radius: 10px !important; }
.orders-page :deep(.v-field__input), .orders-page :deep(.v-field__input input) { color: #19202a !important; }
.orders-page :deep(.v-label), .orders-page :deep(.v-field__outline) { color: #4e5968; }

@media (max-width: 960px) {
  .order-panel { height: auto; min-height: 0; }
  .order-list-panel { max-height: 500px; }
  .order-detail-panel { min-height: 520px; }
}

@media (max-width: 600px) {
  .orders-page { padding: 18px 12px; }
  .orders-header { align-items: flex-start; flex-direction: column; gap: 18px; }
  .orders-header__actions { width: 100%; }
  .orders-header__actions .v-btn { flex: 1; }
  .order-search-row { flex-direction: column; }
  .order-date-field { flex-basis: auto; }
  .order-detail-panel { padding: 22px 16px; }
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>
