<template>
  <button
    class="order-list-item"
    :class="[`order-list-item--${order.status}`, { 'order-list-item--selected': selected }]"
    type="button"
    @click="emit('select', order)"
  >
    <div class="order-list-item__top">
      <span class="order-number">{{ order.orderNumber }}</span>

      <v-chip
        class="status-chip"
        :color="statusColor"
        label
        size="small"
        variant="tonal"
      >
        {{ statusText }}
      </v-chip>
    </div>

    <div class="order-list-item__bottom">
      <span>{{ formatOrderTime(order.createdAt) }}</span>
      <span>{{ order.orderType === 'takeaway' ? '外帶' : '內用' }}</span>
      <span class="order-price">${{ order.totalPrice }}</span>
    </div>
  </button>
</template>

<script setup lang="ts">
  import type { IOrder } from '@/types/order'
  import { computed } from 'vue'

  const props = defineProps<{
    order: IOrder
    selected: boolean
  }>()

  const emit = defineEmits<{
    select: [order: IOrder]
  }>()

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

  function formatOrderTime (createdAt: string) {
    return new Date(createdAt).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }
</script>

<style scoped>
.order-list-item {
  display: block;
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 8px;
  border: 1px solid #e5e8ec;
  border-radius: 10px;
  background: #fff;
  color: #19202a;
  text-align: left;
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease, transform 160ms ease;
}

.order-list-item:hover { border-color: #c7ced7; background: #fbfcfd; transform: translateY(-1px); }
.order-list-item--selected { border-color: #f08a24; background: #fff9f1; box-shadow: 0 0 0 1px #f08a24; }
.order-list-item__top, .order-list-item__bottom { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.order-list-item__bottom { margin-top: 8px; color: #657180; font-size: .9rem; }
.order-number { font-size: 1.05rem; font-weight: 700; letter-spacing: .01em; }
.order-price { margin-left: auto; color: #384454; font-weight: 600; }
.status-chip { font-weight: 600; }
</style>
