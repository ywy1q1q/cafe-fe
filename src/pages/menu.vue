<template>
  <div class="menu-page">
    <v-container class="menu-container py-8 py-md-12">
      <section class="menu-hero">
        <div class="menu-hero-content">
          <span class="menu-eyebrow">Menu</span>
          <h1 class="menu-title">開始點餐</h1>

          <p class="menu-description">
            挑一杯今天想喝的，<br>
            享受屬於你的咖啡時光。
          </p>

          <span class="menu-accent-line" />

          <div aria-live="polite" class="menu-wait-time">
            <v-icon icon="mdi-clock-outline" size="18" />
            <span>目前預估等待時間</span>
            <strong>{{ displayWaitTime }}</strong>
          </div>
        </div>

        <div class="menu-hero-media">
          <img
            alt="咖啡館自然光與咖啡情境"
            class="menu-hero-image"
            :src="`${baseUrl}menu-banner.png`"
          >
        </div>
      </section>

      <!-- 分類 -->
      <div
        aria-label="商品分類"
        class="category-list mb-7"
        role="group"
      >
        <v-btn
          :aria-pressed="selectedCategory === 'all'"
          class="category-tab"
          :class="{
            'category-tab--selected': selectedCategory === 'all',
          }"
          variant="text"
          @click="selectedCategory = 'all'"
        >
          全部
        </v-btn>

        <v-btn
          v-for="category in categories"
          :key="category._id"
          :aria-pressed="selectedCategory === category._id"
          class="category-tab"
          :class="{
            'category-tab--selected': selectedCategory === category._id,
          }"
          variant="text"
          @click="selectedCategory = category._id"
        >
          {{ category.name }}
        </v-btn>
      </div>

      <!-- 商品 -->
      <div
        v-if="productError"
        class="api-error-message"
      >
        <v-icon icon="mdi-alert-circle-outline" size="22" />
        <span>{{ productError }}</span>

        <v-btn
          size="small"
          variant="outlined"
          @click="getProducts"
        >
          重新載入
        </v-btn>
      </div>

      <div
        v-else
        class="product-grid"
      >
        <div
          v-if="filteredProducts.length === 0"
          class="product-empty-state"
        >
          此分類目前沒有商品
        </div>

        <article
          v-for="product in filteredProducts"
          :key="product._id"
          class="product-card"
          :class="{ 'product-card--sold-out': product.stock <= 0 }"
        >
          <img
            :alt="product.name"
            class="product-image"
            :src="product.imageUrl"
          >

          <div class="product-content">
            <h2 class="product-name mb-2">
              {{ product.name }}
            </h2>

            <p class="product-description">
              {{ product.description }}
            </p>

            <div class="product-footer">
              <strong class="product-price">${{ product.price }}</strong>

              <v-btn
                v-if="product.stock > 0"
                aria-label="開啟商品客製化"
                class="product-add-btn"
                icon="mdi-plus"
                size="42"
                variant="text"
                @click="openProduct(product)"
              />

              <v-btn
                v-else
                class="product-sold-out-btn"
                disabled
                icon="mdi-minus"
                size="42"
                variant="text"
              >
                ×
              </v-btn>
            </div>
          </div>

          <div
            v-if="product.stock <= 0"
            aria-label="商品已售完"
            class="product-sold-out-overlay"
          >
            <span>已售完</span>
          </div>
        </article>
      </div>

      <v-dialog
        v-model="productDialog"
        max-width="600"
      >
        <v-card
          v-if="selectedProduct"
          class="menu-dialog"
          elevation="0"
          rounded="xl"
        >
          <v-card-title class="dialog-heading px-6 pt-6 pb-4">
            <div class="section-kicker">
              客製化選項
            </div>

            <div class="text-h5 font-weight-bold dialog-title">
              {{ selectedProduct.name }}
            </div>

            <p
              v-if="selectedProduct.description"
              class="dialog-description text-body-2 mb-0 mt-2"
            >
              {{ selectedProduct.description }}
            </p>

            <p
              v-if="selectedProduct.stock > 0 && selectedProduct.stock <= 5"
              class="dialog-stock-label mb-0 mt-2"
            >
              剩餘 {{ selectedProduct.stock }} 杯
            </p>
          </v-card-title>

          <v-divider class="dialog-divider" />

          <v-card-text class="dialog-content px-6 py-5">
            <!-- 客製化群組 -->
            <div
              v-for="group in selectedProduct.modifierGroupIds"
              :key="group._id"
              class="modifier-group mb-6"
            >
              <div class="d-flex align-center ga-2 mb-3">
                <span class="font-weight-bold modifier-group-title">
                  {{ group.name }}
                </span>

                <span
                  v-if="group.required"
                  class="text-error text-caption font-weight-bold"
                >
                  必選
                </span>
              </div>

              <div class="d-flex flex-wrap ga-2">
                <v-btn
                  v-for="item in group.items.filter(item => item.status)"
                  :key="item.name"
                  :aria-pressed="isModifierSelected(group._id, item.name)"
                  class="modifier-option"
                  :class="{
                    'modifier-option--selected': isModifierSelected(group._id, item.name),
                  }"
                  :height="item.extraPrice > 0 ? 60 : undefined"
                  rounded="lg"
                  :variant="
                    isModifierSelected(group._id, item.name)
                      ? 'flat'
                      : 'outlined'
                  "
                  @click="selectModifier(group, item)"
                >
                  <div class="d-flex flex-column align-center">
                    <span>
                      {{ item.name }}
                    </span>

                    <span
                      v-if="item.extraPrice > 0"
                      class="text-caption mt-1"
                    >
                      +${{ item.extraPrice }}
                    </span>
                  </div>
                </v-btn>
              </div>
            </div>
          </v-card-text>

          <v-divider class="dialog-divider" />

          <v-card-actions class="dialog-actions px-6 py-4">
            <div class="quantity-field">
              <span class="quantity-label">數量</span>

              <div class="quantity-control">
                <v-btn
                  aria-label="減少數量"
                  class="quantity-button"
                  :disabled="quantity <= 1"
                  icon="mdi-minus"
                  size="44"
                  variant="text"
                  @click="decreaseQuantity"
                />

                <span
                  aria-live="polite"
                  class="quantity-value"
                >
                  {{ quantity }}
                </span>

                <v-btn
                  aria-label="增加數量"
                  class="quantity-button"
                  :disabled="quantity >= selectedProduct.stock"
                  icon="mdi-plus"
                  size="44"
                  variant="text"
                  @click="increaseQuantity"
                />
              </div>
            </div>

            <v-spacer />

            <v-btn
              class="dialog-cancel-btn"
              variant="text"
              @click="productDialog = false"
            >
              取消
            </v-btn>

            <v-btn
              class="dialog-primary-btn"
              :disabled="selectedProduct.stock <= 0"
              variant="flat"
              @click="addToCart"
            >
              加入購物車
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar
        v-model="errorSnackbar"
        color="error"
        timeout="2500"
      >
        {{ errorMessage }}
      </v-snackbar>
    </v-container>

    <FloatingCart />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'

  import FloatingCart from '@/components/FloatingCart.vue'
  import api from '@/plugins/axios'
  import { useCartStore } from '@/stores/cart'

  interface Category {
    _id: string
    name: string
  }

  interface PublicOrderStatus {
    _id: string
    status: 'pending' | 'preparing' | 'ready' | 'completed'
  }

  interface Product {
    _id: string
    name: string
    price: number
    stock: number
    description: string
    imageUrl: string

    categoryId: {
      _id: string
      name: string
    }
  }

  interface ModifierItem {
    _id?: string
    name: string
    extraPrice: number
    isDefault: boolean
    sort: number
    status: boolean
  }

  interface ModifierGroup {
    _id: string
    name: string
    type: 'single' | 'multiple'
    required: boolean
    minSelect: number
    maxSelect: number
    status: boolean
    items: ModifierItem[]
  }

  interface Product {
    _id: string
    name: string
    price: number
    stock: number
    description: string
    imageUrl: string

    categoryId: {
      _id: string
      name: string
    }

    modifierGroupIds: ModifierGroup[]
  }

  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])

  const productDialog = ref(false)
  const selectedProduct = ref<Product | null>(null)
  const quantity = ref(1)

  const errorSnackbar = ref(false)
  const errorMessage = ref('')

  const loading = ref(false)
  const productError = ref('')
  const orderStatusLoading = ref(true)
  const orderStatusError = ref(false)
  const orderStatuses = ref<PublicOrderStatus[]>([])

  const selectedCategory = ref('all')

  const cartStore = useCartStore()
  const baseUrl = import.meta.env.BASE_URL

  const activeOrderCount = computed(() => orderStatuses.value.filter(
    order => order.status === 'preparing',
  ).length)

  function formatWaitTime (minutes: number) {
    if (minutes <= 0) return '目前免等候'
    if (minutes <= 5) return '約 5 min'
    if (minutes <= 10) return '5–10 min'
    if (minutes <= 15) return '10–15 min'
    if (minutes <= 20) return '15–20 min'
    if (minutes <= 30) return '20–30 min'
    return '30+ min'
  }

  const estimatedWaitTime = computed(() => {
    return formatWaitTime(activeOrderCount.value * 4)
  })

  const displayWaitTime = computed(() => {
    if (orderStatusLoading.value) return '計算中...'
    if (orderStatusError.value) return '暫無資料'
    return estimatedWaitTime.value
  })

  // 根據目前選擇的分類過濾商品
  const filteredProducts = computed(() => {
    if (selectedCategory.value === 'all') {
      return products.value
    }

    return products.value.filter(
      product => product.categoryId._id === selectedCategory.value,
    )
  })

  const selectedModifiers = ref<Record<string, string[]>>({})

  // 取得前台商品
  async function getProducts () {
    try {
      loading.value = true
      productError.value = ''

      const { data } = await api.get('/api/products')

      products.value = data.result
    } catch (error) {
      console.error('取得商品失敗', error)
      productError.value = '目前無法載入商品，請稍後再試'
    } finally {
      loading.value = false
    }
  }

  // 點商品
  function openProduct (product: Product) {
    selectedProduct.value = product
    selectedModifiers.value = {}
    quantity.value = 1

    for (const group of product.modifierGroupIds) {
      const defaultItems = group.items
        .filter(item => item.status && item.isDefault)
        .map(item => item.name)

      selectedModifiers.value[group._id] = defaultItems
    }

    productDialog.value = true
  }

  async function getCategories () {
    try {
      const { data } = await api.get('/api/categories')

      categories.value = data.result
    } catch (error) {
      console.error('取得分類失敗', error)
    }
  }

  async function getOrderStatuses () {
    try {
      const { data } = await api.get('/api/orders/status')

      orderStatuses.value = data.result
    } catch (error) {
      orderStatusError.value = true
      console.error('取得訂單狀態失敗', error)
    } finally {
      orderStatusLoading.value = false
    }
  }

  function selectModifier (
    group: ModifierGroup,
    item: ModifierItem,
  ) {
    const groupId = group._id

    if (group.type === 'single') {
      // 單選：直接取代
      selectedModifiers.value[groupId] = [item.name]
      return
    }

    // 多選
    const selected = selectedModifiers.value[groupId] ?? []

    selectedModifiers.value[groupId] = selected.includes(item.name)
      ? selected.filter(
        name => name !== item.name,
      )
      : [
        ...selected,
        item.name,
      ]
  }

  function isModifierSelected (
    groupId: string,
    itemName: string,
  ) {
    return selectedModifiers.value[groupId]?.includes(itemName) ?? false
  }

  function validateModifiers () {
    if (!selectedProduct.value) return false

    for (const group of selectedProduct.value.modifierGroupIds) {
      const selected = selectedModifiers.value[group._id] ?? []

      if (group.required && selected.length === 0) {
        showError(`請選擇${group.name}`)
        return false
      }

      if (selected.length < group.minSelect) {
        showError(
          `${group.name}至少選擇 ${group.minSelect} 項`,
        )
        return false
      }

      if (selected.length > group.maxSelect) {
        showError(
          `${group.name}最多選擇 ${group.maxSelect} 項`,
        )
        return false
      }
    }

    return true
  }

  function showError (message: string) {
    errorMessage.value = message
    errorSnackbar.value = true
  }

  function decreaseQuantity () {
    quantity.value = Math.max(1, quantity.value - 1)
  }

  function increaseQuantity () {
    if (!selectedProduct.value) return

    quantity.value = Math.min(
      selectedProduct.value.stock,
      quantity.value + 1,
    )
  }

  function addToCart () {
    if (!validateModifiers()) return
    if (!selectedProduct.value) return

    const existingQuantity = cartStore.getItemQuantity(
      selectedProduct.value._id,
      selectedModifiers.value,
    )
    const remainingQuantity = selectedProduct.value.stock - existingQuantity

    if (quantity.value > remainingQuantity) {
      showError(
        remainingQuantity > 0
          ? `此商品最多還能加入 ${remainingQuantity} 杯`
          : '此商品已達可購買數量上限',
      )
      return
    }

    cartStore.addItem({
      productId: selectedProduct.value._id,
      name: selectedProduct.value.name,
      price: selectedProduct.value.price,
      quantity: quantity.value,
      stock: selectedProduct.value.stock,
      imageUrl: selectedProduct.value.imageUrl,
      modifiers: { ...selectedModifiers.value },
      modifierGroups: selectedProduct.value.modifierGroupIds.map(group => ({
        _id: group._id,
        name: group.name,
        type: group.type,
        required: group.required,
        minSelect: group.minSelect,
        maxSelect: group.maxSelect,
        items: group.items.map(item => ({
          name: item.name,
          extraPrice: item.extraPrice,
          status: item.status,
        })),
      })),
    })

    productDialog.value = false
  }

  onMounted(() => {
    getProducts()
    getCategories()
    getOrderStatuses()
  })
</script>

<style scoped>
:global(:root) {
  --cafe-bg: #fdf0d1;
  --cafe-surface: rgb(255, 251, 245);
  --cafe-primary: rgb(111, 78, 55);
  --cafe-secondary: rgb(166, 135, 108);
  --cafe-border: rgb(222, 210, 198);
  --cafe-text: rgb(67, 52, 43);
  --cafe-muted: rgb(125, 105, 90);
  --cafe-soft: rgb(248, 241, 232);
}

.menu-page {
  background: var(--cafe-bg);
  color: var(--cafe-text);
  min-height: calc(100vh - 64px);
}

.menu-container {
  max-width: none;
  padding-left: 200px;
  padding-right: 200px;
  padding-top: 0 !important;
}

.section-kicker {
  color: var(--cafe-muted);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  margin-bottom: 0.35rem;
}

.menu-title,
.dialog-title,
.modifier-group-title,
.product-name {
  color: var(--cafe-text);
}

.menu-title {
  letter-spacing: 0.02em;
}

.menu-banner {
  border-radius: 56px;
  height: 220px;
  margin-bottom: 40px;
  overflow: hidden;
  width: 100%;
}

.menu-banner-image {
  display: block;
  height: 100%;
  object-fit: cover;
  object-position: center 58%;
  width: 100%;
}

.category-list {
  align-items: center;
  background: rgba(253, 240, 209, 0.96);
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
  margin-inline: -12px;
  padding: 12px;
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(8px);
}

.category-button {
  background: var(--cafe-bg);
  border: 1px solid var(--cafe-primary);
  color: var(--cafe-primary);
  flex: 0 0 auto;
  font-size: 1rem;
  font-weight: 600;
  min-width: 0;
  padding-inline: 16px;
  text-transform: none;
  white-space: nowrap;
}

.category-button--selected {
  background: var(--cafe-primary);
  color: var(--cafe-surface);
}

.category-button:focus-visible {
  outline: 2px solid var(--cafe-primary);
  outline-offset: 2px;
}

.product-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  justify-content: center;
}

.product-card {
  background: var(--cafe-surface);
  border: 1px solid var(--cafe-border);
  color: var(--cafe-text);
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
  overflow: hidden;
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  width: 100%;
  height: 330px;
  border-radius: 10px;
}

.product-sold-out-overlay {
  position: absolute;
  z-index: 2;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgb(75 75 75 / 42%);
  border-radius: inherit;
  color: white;
  pointer-events: none;
}

.product-sold-out-overlay span {
  padding: 8px 18px;
  border: 1px solid rgb(255 255 255 / 70%);
  border-radius: 999px;
  background: rgb(70 70 70 / 66%);
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.product-image {
  background: var(--cafe-soft);
  flex: 0 0 auto;
}

.product-content {
  box-sizing: border-box;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  padding: 10px 15px 14px !important;
  text-align: left;
}

.product-name {
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.4;
  white-space: normal;
  text-align: center;
}

.product-description {
  color: var(--cafe-muted);
  display: -webkit-box;
  line-height: 1.5;
  min-height: 0;
  overflow: hidden;
  margin-left: 10px;
  margin-bottom: 8px !important;
  margin-right: 10px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.dialog-stock-label {
  color: #b4661c;
  font-size: 0.75rem;
  font-weight: 700;
  margin: 0 10px;
}

.dialog-stock-label {
  margin-left: 0;
  margin-right: 0;
}

.product-add-btn,
.dialog-primary-btn {
  background: var(--cafe-primary);
  color: white;
}

.product-add-btn {
  height: 40px !important;
  margin-top: 8px;
  text-transform: none;
  margin-bottom: 0;
}

.product-sold-out-btn {
  background: var(--cafe-border);
  color: var(--cafe-muted);
  height: 40px !important;
  margin-top: 8px;
  margin-bottom: 0;
}

.product-add-btn:focus-visible,
.dialog-primary-btn:focus-visible,
.modifier-option:focus-visible {
  outline: 2px solid var(--cafe-primary);
  outline-offset: 2px;
}

.menu-dialog {
  background: var(--cafe-surface);
  border: 1px solid var(--cafe-border);
  border-radius: 10px !important;
  color: var(--cafe-text);
  display: flex;
  flex-direction: column;
  height: 360px;
  max-height: calc(100dvh - 32px);
  overflow: hidden;
}

.dialog-heading {
  flex: 0 0 auto;
  white-space: normal;
}

.dialog-description {
  color: var(--cafe-muted);
  font-size: 12px;
  line-height: 1.5;
  white-space: normal;
}

.dialog-content {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}

.dialog-divider {
  border-color: var(--cafe-border);
  opacity: 1;
}

.modifier-group:last-child {
  margin-bottom: 0 !important;
}

.modifier-option {
  border-color: var(--cafe-border);
  color: var(--cafe-text);
  min-height: 44px;
  text-transform: none;
}

.modifier-option--selected {
  background: var(--cafe-primary);
  color: white;
}

.dialog-actions {
  align-items: center;
  background: var(--cafe-soft);
  flex: 0 0 auto;
  gap: 8px;
}

.dialog-cancel-btn {
  color: var(--cafe-text);
}

.quantity-field,
.quantity-control {
  align-items: center;
  display: flex;
}

.quantity-field {
  gap: 10px;
}

.quantity-label {
  color: var(--cafe-muted);
  font-size: 0.875rem;
  font-weight: 600;
}

.quantity-control {
  background: var(--cafe-surface);
  border: 1px solid var(--cafe-border);
  border-radius: 0.75rem;
  overflow: hidden;
}

.quantity-button {
  color: var(--cafe-primary);
}

.quantity-value {
  color: var(--cafe-text);
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  min-width: 32px;
  text-align: center;
}

@media (hover: hover) and (pointer: fine) {
  .product-card:hover {
    border-color: var(--cafe-secondary);
    box-shadow: 0 10px 28px rgba(67, 52, 43, 0.12);
    transform: translateY(-2px);
  }
}

@media (max-width: 1199px) {
  .product-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 899px) {
  .product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 699px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 599px) {
  .menu-container {
    padding-left: 16px;
    padding-right: 16px;
  }

  .menu-heading {
    margin-bottom: 20px !important;
  }

  .menu-banner {
    border-radius: 32px;
    height: 180px;
    margin-bottom: 28px;
  }

  .category-list {
    flex-wrap: nowrap;
    margin-bottom: 20px !important;
    margin-inline: -16px;
    overflow-x: auto;
    padding-inline: 16px;
    top: 72px;
    border-bottom: 1px solid rgb(205 181 157 / 65%);
    box-shadow: 0 6px 14px rgb(79 54 37 / 12%);
    scrollbar-width: none;
  }

  .category-list::-webkit-scrollbar {
    display: none;
  }

  .product-grid {
    gap: 20px;
    grid-template-columns: minmax(0, 1fr);
  }

  .product-card {
    flex-direction: row;
    height: auto;
    width: 100%;
  }

  .product-image {
    align-self: stretch;
    flex: 0 0 128px;
    height: auto !important;
    min-height: 180px;
    width: 128px;
  }

  .product-content {
    min-width: 0;
    padding: 16px !important;
    text-align: left !important;
  }

  .product-name {
    font-size: 1rem;
  }

  .product-description {
    margin-bottom: 16px !important;
    min-height: 0;
  }

  .dialog-heading,
  .dialog-content,
  .dialog-actions {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .product-card {
    transition: none;
  }

  .product-card:hover {
    transform: none;
  }
}

/* Warm Daylight Café editorial menu layout. */
.menu-hero {
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  position: relative;
  width: 100vw;
  min-height: 520px;
  display: block;
  overflow: hidden;
  border-radius: 0;
  background: #f7f3ec;
}

.menu-hero-media {
  inset: 0;
  min-height: 520px;
  position: absolute;
  z-index: 0;
}

.menu-hero-media::after {
  background: linear-gradient(90deg, rgb(50 23 14 / 62%) 0%, rgb(50 23 14 / 28%) 42%, transparent 74%);
  content: "";
  inset: 0;
  position: absolute;
}

.menu-hero-content {
  background: transparent;
  border: 0;
  left: 0;
  margin: 0;
  max-width: 52%;
  min-height: 520px;
  padding: 56px 64px;
  position: relative;
  z-index: 1;
}

.menu-hero-image {
  height: 100%;
  min-height: 520px;
  object-fit: cover;
  position: absolute;
  width: 100%;
}

@media (max-width: 599px) {
  .menu-hero {
    min-height: 620px;
  }

  .menu-hero-content {
    left: 16px;
    margin: 16px 0;
    max-width: none;
    min-height: 360px;
    padding: 36px 24px;
    right: 16px;
  }

  .menu-hero-image {
    min-height: 620px;
    position: absolute;
  }
}

/* Previous split layout is intentionally replaced by the full-bleed Hero above. */
.menu-hero--legacy {
  display: grid;
  grid-template-columns: 0.4fr 0.6fr;
  min-height: 400px;
  overflow: hidden;
  border-radius: 10px;
  background: #f7f3ec;
}

.menu-hero-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 56px 64px;
}

.menu-eyebrow {
  color: #ede3d6;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 42px;
  font-style: italic;
  line-height: 1;
}

.menu-title {
  color: #f7f3ec;
  font-family: "Noto Sans TC", sans-serif;
  font-size: clamp(38px, 4vw, 58px);
  font-weight: 700;
  line-height: 1.2;
  margin: 6px 0 0;
}

.menu-description {
  color: rgb(247 243 236 / 86%);
  font-family: "Noto Sans TC", sans-serif;
  font-size: 17px;
  line-height: 1.9;
  margin: 24px 0 0;
}

.menu-accent-line {
  background: #ffd21c;
  border-radius: 999px;
  display: block;
  height: 3px;
  margin-top: 12px;
  width: 68px;
}

.menu-wait-time {
  align-items: center;
  align-self: flex-start;
  background: #ede3d6;
  border-radius: 999px;
  color: #32170e;
  display: flex;
  font-size: 0.78rem;
  gap: 8px;
  margin-top: 24px;
  padding: 10px 14px;
}

.menu-wait-time strong {
  font-size: 0.92rem;
  font-weight: 700;
}

.menu-hero-media {
  min-height: 400px;
}

.menu-hero-image {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.category-list {
  align-items: center;
  background: transparent;
  border: 0;
  gap: 42px;
  margin: 44px 0 48px;
  padding: 0;
  position: sticky;
  top: 12px;
}

.category-tab {
  background: transparent !important;
  border: 0;
  border-radius: 10px;
  color: #75513c;
  font-size: 16px;
  font-weight: 500;
  min-width: 0;
  overflow: visible;
  padding: 10px 16px;
  position: relative;
  text-transform: none;
}

.category-tab--selected {
  background: #6f4e37 !important;
  color: #f7f3ec !important;
  font-weight: 600;
}

.category-tab--selected::after {
  display: none;
}

.category-tab:not(.category-tab--selected):hover {
  background: #efe1cf !important;
}

.product-grid {
  gap: 48px 28px;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin-inline: 0;
  min-height: 320px;
}

.product-empty-state {
  align-items: center;
  color: #75513c;
  display: flex;
  grid-column: 1 / -1;
  justify-content: center;
  min-height: 320px;
  text-align: center;
}

.product-card {
  align-self: stretch;
  background: #efe1cf;
  border: 0;
  border-radius: 10px;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  transition: none;
  width: 100%;
}

.product-image {
  aspect-ratio: 4 / 3;
  border-radius: 10px 10px 0 0;
  display: block;
  height: auto !important;
  object-fit: cover;
  transition: transform 350ms ease;
  width: 100%;
}

.product-content {
  box-sizing: border-box;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  overflow: visible;
  min-height: 130px;
  padding: 20px 22px 22px !important;
  width: 100%;
}

.product-name {
  color: #32170e;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 18px;
  overflow: visible;
  padding-inline: 0;
  text-align: left;
  white-space: normal;
  word-break: break-word;
}

.product-description {
  display: -webkit-box;
  color: #75513c;
  font-size: 14px;
  line-height: 1.6;
  margin: 4px 0 0;
  min-height: 44.8px;
  overflow: hidden;
  padding-inline: 0;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-footer {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}

.product-content .product-add-btn,
.product-content .product-sold-out-btn {
  background: #e3d2bc;
  border: 0;
  border-radius: 50%;
  color: #32170e;
  height: 42px !important;
  margin: 0;
  min-width: 42px;
  padding: 0;
  width: 42px;
}

.product-content .product-sold-out-btn {
  color: #75513c;
}

.product-sold-out-overlay {
  aspect-ratio: 4 / 3;
  background: rgb(50 23 14 / 38%);
  border-radius: 10px 10px 0 0;
  bottom: auto;
  color: #f7f3ec;
  height: auto;
  inset-inline: 0;
  top: 0;
}

.product-sold-out-overlay span {
  background: rgb(50 23 14 / 28%);
  border: 1px solid rgb(247 243 236 / 75%);
  color: #f7f3ec;
  padding: 10px 18px;
  backdrop-filter: blur(6px);
}

.product-price {
  color: #32170e;
  font-size: 18px;
  font-weight: 600;
}

@media (hover: hover) and (pointer: fine) {
  .product-card:hover {
    box-shadow: none;
    transform: none;
  }

.product-card:hover .product-image {
    transform: scale(1.015);
  }
}

.api-error-message {
  align-items: center;
  background: #fff1b8;
  border: 2px solid #6f4e37;
  border-radius: 10px;
  color: #6f4e37;
  display: flex;
  gap: 12px;
  justify-content: center;
  min-height: 96px;
  padding: 20px;
}

.api-error-message .v-btn {
  border-color: #6f4e37;
  color: #6f4e37;
}

@media (max-width: 899px) {
  .menu-hero-content {
    padding: 42px 36px;
  }

  .product-grid {
    margin-inline: 0;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .product-card::after {
    display: none;
  }
}

@media (max-width: 599px) {
  .menu-hero {
    grid-template-columns: 1fr;
  }

  .menu-hero-content {
    min-height: 300px;
    padding: 36px 24px;
  }

  .menu-eyebrow {
    font-size: 34px;
  }

  .menu-description {
    font-size: 15px;
  }

  .menu-hero-media {
    min-height: 240px;
  }

  .category-list {
    gap: 26px;
    margin: 32px -16px 36px;
    overflow-x: auto;
    padding: 0 16px 10px;
    top: 72px;
  }

  .product-grid {
    gap: 42px 24px;
    grid-template-columns: 1fr;
    min-height: 240px;
  }

  .product-empty-state {
    min-height: 240px;
  }

  .product-sold-out-overlay {
    bottom: auto;
    height: 96px;
    inset-inline: 0 auto;
    right: auto;
    width: 128px;
  }

  .product-image {
    aspect-ratio: 4 / 3;
    border-radius: 10px 0 0 10px;
    height: auto !important;
    min-height: 0;
  }

  .product-sold-out-overlay {
    border-radius: 10px 0 0 10px;
  }

  .product-card {
    height: auto;
  }

  .product-content {
    display: block;
  }

  .product-footer {
    margin-top: 14px;
  }
}
</style>
