<template>
  <v-card
    class="pa-4 mb-4"
    elevation="0"
    rounded="xl"
  >
    <div class="font-weight-bold text-h6">
      {{ order.orderNumber }}
    </div>

    <div class="mt-2">
      {{ order.orderType === 'takeaway' ? '外帶' : '內用' }}
    </div>

    <div>
      ${{ order.totalPrice }}
    </div>

    <div class="mt-2">
      {{ statusText }}
    </div>

    <div class="mt-4">
      <v-btn
        v-if="order.status === 'pending'"
        @click="emit('update-status', order._id, 'preparing')"
      >
        開始製作
      </v-btn>

      <v-btn
        v-else-if="order.status === 'preparing'"
        @click="emit('update-status', order._id, 'ready')"
      >
        可取餐
      </v-btn>

      <v-btn
        v-else-if="order.status === 'ready'"
        @click="emit('update-status', order._id, 'completed')"
      >
        完成訂單
      </v-btn>

      <v-chip
        v-else-if="order.status === 'completed'"
        color="success"
        variant="tonal"
      >
        已完成
      </v-chip>

      <v-chip
        v-else-if="order.status === 'cancelled'"
        color="error"
        variant="tonal"
      >
        已取消
      </v-chip>
    </div>
  </v-card>
</template>

<script setup lang="ts">
  import type { IOrder, OrderStatus } from '@/types/order'
  import { computed } from 'vue'

  const props = defineProps<{
    order: IOrder
  }>()

  const emit = defineEmits<{
    'update-status': [id: string, status: OrderStatus]
  }>()

  const statusText = computed(() => {
    const statusMap: Record<OrderStatus, string> = {
      pending: '等待處理',
      preparing: '製作中',
      ready: '可取餐',
      completed: '已完成',
      cancelled: '已取消',
    }

    return statusMap[props.order.status]
  })
</script>
