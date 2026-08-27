<template>
  <div class="order-detail">
    <div class="order-detail__scroll">
      <div class="order-detail__header">
        <div>
          <div class="order-number-heading">
            <span>{{ order.orderNumber }}</span>

            <v-btn
              aria-label="複製訂單單號"
              icon="mdi-content-copy"
              size="small"
              variant="text"
              @click="copyOrderNumber"
            />
          </div>

          <div class="order-meta">
            <span><v-icon icon="mdi-shopping-outline" size="18" />{{ order.orderType === 'takeaway' ? '外帶' : '內用' }}</span>
            <span><v-icon icon="mdi-clock-outline" size="18" />{{ formatOrderTime(order.createdAt) }}</span>
          </div>
        </div>

        <v-chip
          class="current-status"
          :color="statusColor"
          label
          variant="tonal"
        >
          <span class="status-dot" />
          目前狀態：{{ statusText }}
        </v-chip>
      </div>

      <v-divider class="my-4" />

      <div class="section-title">餐點明細</div>

      <div class="order-detail-table">
        <div class="order-detail-head">
          <span>品項</span>
          <span>數量</span>
          <span>小計</span>
        </div>

        <div
          v-for="item in order.items"
          :key="item.productId"
          class="order-detail-row"
        >
          <div class="order-item-info">
            <v-img
              class="order-item-image"
              cover
              height="56"
              rounded="lg"
              :src="getProductImage(item.productId)"
              width="56"
            />

            <div class="order-item-copy">
              <div class="font-weight-bold">{{ item.productName }}</div>

              <div
                v-for="modifier in item.modifiers"
                :key="`${modifier.groupName}-${modifier.itemName}`"
                class="order-item-modifier"
              >
                {{ modifier.itemName }}
                <span v-if="modifier.extraPrice > 0">+${{ modifier.extraPrice }}</span>
              </div>
            </div>
          </div>

          <div class="order-item-quantity">{{ item.quantity }}</div>
          <div class="order-item-subtotal">${{ item.subtotal }}</div>
        </div>

        <div class="order-total-row">
          <span>總計</span>
          <strong>${{ order.totalPrice }}</strong>
        </div>
      </div>

    </div>

    <div class="order-actions">
      <v-btn
        v-if="order.status === 'preparing' || order.status === 'ready'"
        class="order-secondary-btn"
        variant="outlined"
        @click="emit('update-status', order._id, 'pending')"
      >
        <v-icon icon="mdi-arrow-left" />
        收回未接單
      </v-btn>

      <v-spacer />

      <v-btn
        v-if="order.status === 'pending'"
        class="order-primary-btn"
        variant="flat"
        @click="emit('update-status', order._id, 'preparing')"
      >
        開始製作
      </v-btn>

      <v-btn
        v-else-if="order.status === 'preparing'"
        class="order-primary-btn"
        variant="flat"
        @click="emit('update-status', order._id, 'ready')"
      >
        設為可取餐
      </v-btn>

      <v-btn
        v-else-if="order.status === 'ready'"
        class="order-primary-btn"
        variant="flat"
        @click="emit('complete-order', order)"
      >
        完成訂單
      </v-btn>

      <v-btn
        v-else-if="order.status === 'completed'"
        class="order-secondary-btn"
        variant="outlined"
        @click="emit('update-status', order._id, 'ready')"
      >
        恢復為可取餐
      </v-btn>
    </div>

    <v-snackbar v-model="copied" location="bottom" :timeout="1800">
      已複製訂單單號
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
  import type { IOrder, OrderStatus } from '@/types/order'
  import type { IProduct } from '@/types/product'
  import { computed, ref } from 'vue'

  const props = defineProps<{
    order: IOrder
    products: IProduct[]
  }>()

  const emit = defineEmits<{
    'update-status': [id: string, status: OrderStatus]
    'complete-order': [order: IOrder]
  }>()

  const copied = ref(false)

  const statusText = computed(() => ({
    pending: '未接單',
    preparing: '製作中',
    ready: '可取餐',
    completed: '已完成',
    cancelled: '已取消',
  })[props.order.status])

  const statusColor = computed(() => ({
    pending: 'error',
    preparing: 'warning',
    ready: 'success',
    completed: 'grey',
    cancelled: 'error',
  })[props.order.status])

  function getProductImage (productId: string) {
    return props.products.find(product => product._id === productId)?.imageUrl ?? ''
  }

  function formatOrderTime (createdAt: string) {
    return new Date(createdAt).toLocaleString('zh-TW', {
      month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
    })
  }

  async function copyOrderNumber () {
    await navigator.clipboard.writeText(props.order.orderNumber)
    copied.value = true
  }
</script>

<style scoped>
.order-detail { display: flex; flex-direction: column; height: 100%; min-height: 0; color: #19202a; }
.order-detail__scroll { flex: 1; min-height: 0; padding: 0 8px 8px 0; overflow-y: auto; scrollbar-gutter: stable; }
.order-detail__scroll::-webkit-scrollbar { width: 8px; }
.order-detail__scroll::-webkit-scrollbar-track { background: #f7f1e8; border-radius: 999px; }
.order-detail__scroll::-webkit-scrollbar-thumb { background: #c9ae91; border-radius: 999px; }
.order-detail__scroll::-webkit-scrollbar-thumb:hover { background: #9f7653; }
.order-detail__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.order-number-heading { display: flex; align-items: center; font-size: 1.85rem; font-weight: 750; letter-spacing: -.035em; }
.order-meta { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 6px; color: #4e5968; }
.order-meta span { display: inline-flex; align-items: center; gap: 7px; }
.current-status { border: 1px solid #f2c18b; color: #bf6500 !important; font-weight: 600; }
.status-dot { width: 10px; height: 10px; margin-right: 8px; border-radius: 50%; background: currentcolor; }
.section-title { margin-bottom: 10px; font-size: 1.1rem; font-weight: 750; }
.order-detail-table { overflow: hidden; border: 1px solid #dfe3e8; border-radius: 11px; }
.order-detail-head, .order-detail-row { display: grid; grid-template-columns: minmax(0, 1fr) 80px 100px; align-items: center; }
.order-detail-head { padding: 9px 14px; background: #fafbfc; color: #4e5968; font-weight: 600; }
.order-detail-head span:nth-child(2), .order-item-quantity { text-align: center; }
.order-detail-head span:last-child, .order-item-subtotal { text-align: right; }
.order-detail-row { min-height: 76px; padding: 8px 14px; border-top: 1px solid #e9ecf0; }
.order-item-info { display: flex; align-items: center; gap: 12px; min-width: 0; }
.order-item-image { flex: 0 0 56px; background: #f0f2f4; }
.order-item-copy { min-width: 0; }
.order-item-modifier { margin-top: 4px; color: #4e5968; font-size: .88rem; }
.order-item-modifier span { margin-left: 8px; color: #a06a31; }
.order-item-quantity { color: #4e5968; }
.order-item-subtotal { font-weight: 600; }
.order-total-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-top: 1px solid #dfe3e8; background: #fafbfc; font-size: 1rem; }
.order-total-row strong { font-size: 1.25rem; }
.order-actions { display: flex; flex: 0 0 auto; align-items: center; gap: 10px; margin-top: 10px; padding-top: 12px; border-top: 1px solid #e9ecf0; background: #fff; }
.order-primary-btn { background: #c96d1d; color: white; }
.order-secondary-btn { border-color: #c7ced7; color: #384454; }

@media (max-width: 600px) {
  .order-detail__header { flex-direction: column; }
  .order-number-heading { font-size: 1.65rem; }
  .order-detail-head, .order-detail-row { grid-template-columns: minmax(0, 1fr) 48px 74px; }
  .order-detail-row { padding: 10px; }
  .order-item-info { gap: 9px; }
  .order-item-image { flex-basis: 50px; }
  .order-actions { flex-wrap: wrap; }
}
</style>
