<template>
  <v-app>
    <v-app-bar
      class="site-navbar"
      :class="{
        'site-navbar--home': [
          '/',
          '/menu',
          '/order-status',
          '/login',
        ].includes(route.path),
      }"
      elevation="0"
      height="72"
    >
      <v-btn
        class="navbar-brand"
        to="/"
        variant="text"
      >
        <span class="navbar-brand__mark">
          <img
            alt="Power Cafe 標誌"
            class="navbar-brand__logo"
            :src="`${baseUrl}logounbg.png`"
          >
        </span>

        <span class="navbar-brand__copy">
          <strong>Power Cafe</strong>
          <small>Enjoy your moment</small>
        </span>
      </v-btn>

      <v-spacer />

      <nav aria-label="主要導覽" class="navbar-center-actions">
        <v-btn class="navbar-link navbar-link--home" to="/" variant="text">
          首頁
        </v-btn>

        <v-btn class="navbar-link" variant="text" @click="requestStartOrdering">
          開始點餐
        </v-btn>

        <v-btn
          class="navbar-link navbar-link--processing"
          to="/processing"
          variant="text"
        >
          咖啡旅程
        </v-btn>

        <v-btn class="navbar-link" to="/order-status" variant="text">
          訂單狀態
        </v-btn>
      </nav>

      <v-spacer />

      <div class="navbar-actions">
        <v-btn
          class="navbar-login-btn"
          prepend-icon="mdi-account-outline"
          to="/login"
          variant="text"
        >
          登入
        </v-btn>

        <v-badge
          color="error"
          :content="cartCount"
          :model-value="cartCount > 0"
        >
          <v-btn
            aria-label="開啟購物車"
            class="navbar-cart-btn"
            @click="cartStore.toggleDrawer"
          >
            <v-icon icon="mdi-cart-outline" size="20" />
            <span>購物車</span>
          </v-btn>
        </v-badge>
      </div>
    </v-app-bar>

    <v-navigation-drawer
      v-model="cartDrawer"
      class="cart-drawer"
      location="right"
      temporary
      width="380"
    >
      <div class="cart-drawer-content">
        <div class="cart-drawer-header px-5 py-4">
          <div>
            <div class="cart-kicker">
              YOUR ORDER
            </div>

            <h2 class="text-h6 font-weight-bold mb-0">
              購物車
            </h2>
          </div>

          <v-btn
            aria-label="關閉購物車"
            class="cart-close-btn"
            icon="mdi-close"
            variant="text"
            @click="cartDrawer = false"
          />
        </div>

        <v-divider class="cart-divider" />

        <div
          v-if="cartStore.items.length === 0"
          class="cart-empty px-5 py-12 text-center"
        >
          <v-icon
            class="mb-3"
            icon="mdi-cart-outline"
            size="40"
          />

          <div class="font-weight-bold mb-1">
            購物車目前是空的
          </div>

          <div class="text-body-2">
            選擇喜歡的商品後會顯示在這裡。
          </div>
        </div>

        <div
          v-else
          class="cart-items px-5 py-4"
        >
          <article
            v-for="(item, index) in cartStore.items"
            :key="`${item.productId}-${index}`"
            class="cart-item"
          >
            <v-img
              class="cart-item-image"
              cover
              height="80"
              rounded="lg"
              :src="item.imageUrl"
              width="80"
            />

            <div class="cart-item-body">
              <div class="d-flex align-start justify-space-between ga-2">
                <div class="font-weight-bold cart-item-name">
                  {{ item.name }}
                </div>

                <div class="d-flex">
                  <v-btn
                    v-if="item.modifierGroups.length > 0"
                    :aria-label="`修改${item.name}客製化`"
                    class="cart-edit-btn"
                    icon="mdi-pencil-outline"
                    size="44"
                    variant="text"
                    @click="openEditItem(index)"
                  />

                  <v-btn
                    :aria-label="`移除${item.name}`"
                    class="cart-remove-btn"
                    icon="mdi-delete-outline"
                    size="44"
                    variant="text"
                    @click="cartStore.removeItem(index)"
                  />
                </div>
              </div>

              <div
                v-if="modifierText(item)"
                class="cart-item-modifiers mt-1"
              >
                {{ modifierText(item) }}
              </div>

              <div class="cart-item-footer mt-2">
                <div
                  :aria-label="`${item.name}數量`"
                  class="cart-quantity-control"
                  role="group"
                >
                  <v-btn
                    :aria-label="`減少${item.name}數量`"
                    class="cart-quantity-btn"
                    :disabled="item.quantity <= 1"
                    icon="mdi-minus"
                    size="44"
                    variant="text"
                    @click="cartStore.decreaseItem(index)"
                  />

                  <span
                    aria-live="polite"
                    class="cart-quantity-value"
                  >
                    {{ item.quantity }}
                  </span>

                  <v-btn
                    :aria-label="`增加${item.name}數量`"
                    class="cart-quantity-btn"
                    :disabled="item.quantity >= item.stock"
                    icon="mdi-plus"
                    size="44"
                    variant="text"
                    @click="cartStore.increaseItem(index)"
                  />
                </div>

                <span class="font-weight-bold cart-item-price">
                  ${{ item.price * item.quantity }}
                </span>
              </div>
            </div>
          </article>
        </div>

        <div
          v-if="cartStore.items.length > 0"
          class="cart-summary px-5 py-4"
        >
          <div class="d-flex align-center justify-space-between mb-4">
            <span>小計</span>

            <span class="text-h6 font-weight-bold cart-total">
              ${{ cartTotal }}
            </span>
          </div>

          <div class="d-flex ga-2">
            <v-btn
              block
              class="cart-clear-btn"
              variant="outlined"
              @click="cartStore.clearCart"
            >
              清空
            </v-btn>

            <v-btn
              block
              class="cart-continue-btn"
              variant="flat"
              @click="cartDrawer = false"
            >
              繼續點餐
            </v-btn>
          </div>

          <v-btn
            block
            class="cart-checkout-btn"
            @click="goToCheckout"
          >
            下一步
          </v-btn>
        </div>
      </div>
    </v-navigation-drawer>

    <v-dialog
      v-model="editDialog"
      max-width="600"
    >
      <v-card
        v-if="editingItem"
        class="cart-edit-dialog"
        rounded="xl"
      >
        <v-card-title class="px-6 pt-6 pb-4">
          <div class="cart-kicker">
            修改客製化
          </div>

          <div class="text-h6 font-weight-bold">
            {{ editingItem.name }}
          </div>
        </v-card-title>

        <v-divider class="cart-divider" />

        <v-card-text class="px-6 py-5 cart-edit-content">
          <div
            v-for="group in editingItem.modifierGroups"
            :key="group._id"
            class="cart-edit-group mb-6"
          >
            <div class="d-flex align-center ga-2 mb-3">
              <span class="font-weight-bold">
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
                v-for="option in group.items.filter(option => option.status)"
                :key="option.name"
                :aria-pressed="isEditModifierSelected(group._id, option.name)"
                class="cart-edit-option"
                :class="{
                  'cart-edit-option--selected': isEditModifierSelected(group._id, option.name),
                }"
                :height="option.extraPrice > 0 ? 60 : 44"
                rounded="lg"
                :variant="isEditModifierSelected(group._id, option.name) ? 'flat' : 'outlined'"
                @click="selectEditModifier(group, option.name)"
              >
                <div class="d-flex flex-column align-center">
                  <span>{{ option.name }}</span>

                  <span
                    v-if="option.extraPrice > 0"
                    class="text-caption mt-1"
                  >
                    +${{ option.extraPrice }}
                  </span>
                </div>
              </v-btn>
            </div>
          </div>

          <v-alert
            v-if="editError"
            density="compact"
            type="error"
            variant="tonal"
          >
            {{ editError }}
          </v-alert>
        </v-card-text>

        <v-divider class="cart-divider" />

        <v-card-actions class="cart-edit-actions px-6 py-4">
          <v-spacer />

          <v-btn
            variant="text"
            @click="editDialog = false"
          >
            取消
          </v-btn>

          <v-btn
            class="cart-continue-btn"
            variant="flat"
            @click="saveEditedItem"
          >
            儲存修改
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="checkoutDialog"
      max-width="420"
    >
      <v-card
        class="checkout-dialog"
        rounded="xl"
      >
        <v-card-title class="px-6 pt-6 pb-3 font-weight-bold">
          確認結帳
        </v-card-title>

        <v-card-text class="px-6 py-4">
          <div class="d-flex align-center justify-space-between mb-4">
            <span>訂單總額</span>

            <span class="text-h5 font-weight-bold cart-total">
              ${{ cartTotal }}
            </span>
          </div>

          <v-alert
            density="compact"
            type="info"
            variant="tonal"
          >
            結帳流程尚未串接，購物車內容會保留。
          </v-alert>
        </v-card-text>

        <v-card-actions class="cart-edit-actions px-6 py-4">
          <v-spacer />

          <v-btn
            class="cart-continue-btn"
            variant="flat"
            @click="checkoutDialog = false"
          >
            返回購物車
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-main
      class="site-main"
      :class="{ 'site-main--home': route.path === '/' }"
    >
      <router-view />
    </v-main>

    <AppFooter v-if="showAppFooter" />
  </v-app>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import AppFooter from '@/layouts/AppFooter.vue'
  import {
    type CartItem,
    type CartModifierGroup,
    useCartStore,
  } from '@/stores/cart'

  const cartStore = useCartStore()
  const route = useRoute()
  const router = useRouter()
  const baseUrl = import.meta.env.BASE_URL
  const footerRoutes = new Set(['/', '/menu', '/processing', '/order-status'])
  const showAppFooter = computed(() => footerRoutes.has(route.path))

  function requestStartOrdering () {
    if (route.path === '/menu') return

    if (route.path !== '/') {
      void router.push('/menu')
      return
    }

    void router.push({
      path: '/',
      query: { startOrder: Date.now().toString() },
    })
  }

  const cartCount = computed(() => {
    return cartStore.totalQuantity
  })

  const cartTotal = computed(() => {
    return cartStore.totalPrice
  })

  const cartDrawer = computed({
    get: () => cartStore.drawerOpen,
    set: value => {
      cartStore.drawerOpen = value
    },
  })
  const editDialog = ref(false)
  const checkoutDialog = ref(false)
  const editingItemIndex = ref<number | null>(null)

  function goToCheckout () {
    cartDrawer.value = false
    void router.push('/checkout')
  }

  const editModifiers = ref<Record<string, string[]>>({})
  const editError = ref('')
  const editingItem = computed(() => {
    if (editingItemIndex.value === null) return null

    return cartStore.items[editingItemIndex.value] ?? null
  })

  let previousBodyOverflow = ''
  let previousHtmlOverflow = ''

  watch(cartDrawer, isOpen => {
    if (isOpen) {
      previousBodyOverflow = document.body.style.overflow
      previousHtmlOverflow = document.documentElement.style.overflow
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      return
    }

    restorePageScroll()
  })

  onBeforeUnmount(restorePageScroll)

  function restorePageScroll () {
    document.body.style.overflow = previousBodyOverflow
    document.documentElement.style.overflow = previousHtmlOverflow
  }

  function modifierText (item: CartItem) {
    return Object.values(item.modifiers)
      .flat()
      .join('、')
  }

  function openEditItem (index: number) {
    const item = cartStore.items[index]

    if (!item) return

    editingItemIndex.value = index
    editModifiers.value = cloneModifiers(item.modifiers)
    editError.value = ''
    editDialog.value = true
  }

  function selectEditModifier (
    group: CartModifierGroup,
    optionName: string,
  ) {
    if (group.type === 'single') {
      editModifiers.value[group._id] = [optionName]
      editError.value = ''
      return
    }

    const selected = editModifiers.value[group._id] ?? []

    editModifiers.value[group._id] = selected.includes(optionName)
      ? selected.filter(name => name !== optionName)
      : [...selected, optionName]
    editError.value = ''
  }

  function isEditModifierSelected (groupId: string, optionName: string) {
    return editModifiers.value[groupId]?.includes(optionName) ?? false
  }

  function saveEditedItem () {
    if (!editingItem.value || editingItemIndex.value === null) return

    for (const group of editingItem.value.modifierGroups) {
      const selected = editModifiers.value[group._id] ?? []

      if (group.required && selected.length === 0) {
        editError.value = `請選擇${group.name}`
        return
      }

      if (selected.length < group.minSelect) {
        editError.value = `${group.name}至少選擇 ${group.minSelect} 項`
        return
      }

      if (selected.length > group.maxSelect) {
        editError.value = `${group.name}最多選擇 ${group.maxSelect} 項`
        return
      }
    }

    cartStore.updateItemModifiers(
      editingItemIndex.value,
      editModifiers.value,
    )
    editDialog.value = false
    editingItemIndex.value = null
  }

  function cloneModifiers (modifiers: Record<string, string[]>) {
    return Object.fromEntries(
      Object.entries(modifiers).map(([groupId, values]) => {
        return [groupId, [...values]]
      }),
    )
  }
</script>

<style scoped>

.site-main {
  min-height: calc(100dvh - 72px);
  background: rgb(248, 241, 232);
  color: rgb(67, 52, 43);
}

.site-navbar {
  background: rgb(111, 78, 55);
  border-bottom: 1px solid rgb(91, 62, 44);
  color: white;
  padding-inline: 22px;
  position: fixed !important;
  top: 0;
  z-index: 1010 !important;
}

.site-navbar--home {
  background: rgb(92 60 42 / 76%) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgb(255 245 232 / 24%);
  color: rgb(255 248 238) !important;
  pointer-events: auto;
  z-index: 1100 !important;
}

.site-navbar--home :deep(.v-btn) {
  pointer-events: auto;
}

.site-main--home {
  min-height: 100dvh;
  padding-top: 0 !important;
}

.site-navbar--home .navbar-brand,
.site-navbar--home .navbar-link,
.site-navbar--home .navbar-login-btn,
.site-navbar--home .navbar-cart-btn {
  color: rgb(255 248 238);
}

.site-navbar--home .navbar-brand__copy small {
  color: rgb(255 248 238 / 78%);
}

.site-navbar--home .navbar-link.router-link-active {
  color: rgb(255 248 238);
}

.site-navbar--home .navbar-link.router-link-active::after {
  background: rgb(255 248 238);
}

.site-navbar--home .navbar-cart-btn {
  background: rgb(255 248 238 / 16%);
  border-color: rgb(255 248 238 / 30%);
}

.navbar-brand {
  --v-activated-opacity: 0;
  --v-focus-opacity: 0;
  --v-hover-opacity: 0;
  background: transparent !important;
  color: white;
  height: 52px;
  letter-spacing: normal;
  padding-inline: 6px 12px;
  text-transform: none;
}

.navbar-brand :deep(.v-btn__overlay),
.navbar-brand :deep(.v-btn__underlay) {
  opacity: 0 !important;
}

.navbar-brand:focus-visible .navbar-brand__mark {
  outline: 2px solid white;
  outline-offset: 2px;
}

.navbar-brand__mark {
  align-items: center;
  border-radius: 10px;
  display: inline-flex;
  height: 38px;
  justify-content: center;
  margin-right: 9px;
  width: 38px;
}

.navbar-brand__logo {
  display: block;
  height: 45px;
  object-fit: contain;
  width: 45px;
}

.navbar-brand__copy {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}

.navbar-brand__copy strong {
  font-family: "Times New Roman", serif;
  font-size: 1.04rem;
  font-style: italic;
}

.navbar-brand__copy small {
  color: rgb(255 255 255 / 68%);
  font-family: "Times New Roman", serif;
  font-size: 0.56rem;
  margin-top: 3px;
}

.navbar-center-actions {
  display: flex;
  gap: 4px;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
}

.navbar-link {
  color: rgb(255 255 255 / 78%);
  font-size: 0.82rem;
  min-width: 76px;
  text-transform: none;
}

.navbar-link--processing {
  min-width: 108px;
}

.navbar-link.router-link-active {
  color: white;
  font-weight: 750;
}

.navbar-link.router-link-active::after {
  background: white;
  border-radius: 999px;
  bottom: 5px;
  content: "";
  height: 2px;
  left: 26%;
  position: absolute;
  right: 26%;
}

.navbar-actions {
  align-items: center;
  display: flex;
  gap: 8px;
  margin-right: 16px;
}

.navbar-login-btn {
  color: white;
  font-size: 0.8rem;
  text-transform: none;
}

.navbar-cart-btn {
  background: rgb(255 255 255 / 12%);
  border: 1px solid rgb(255 255 255 / 28%);
  border-radius: 10px;
  color: white;
  gap: 7px;
  min-width: 112px;
  text-transform: none;
}

@media (max-width: 760px) {
  .site-navbar {
    padding-inline: 8px;
  }

  .navbar-brand__copy,
  .navbar-link--home {
    display: none;
  }

  .navbar-brand {
    min-width: 44px;
    padding: 0;
  }

  .navbar-brand__mark {
    margin-right: 0;
  }

  .navbar-center-actions {
    gap: 0;
    left: auto;
    position: static;
    transform: none;
  }

  .navbar-link {
    min-width: 68px;
    padding-inline: 7px;
  }

  .navbar-link--processing {
    font-size: 0.72rem;
    min-width: 88px;
    padding-inline: 5px;
  }

  .navbar-login-btn {
    min-width: 44px;
    padding-inline: 10px;
  }

  .navbar-login-btn :deep(.v-btn__content) {
    display: none;
  }

  .navbar-cart-btn {
    min-width: 44px;
    padding-inline: 10px;
  }

  .navbar-cart-btn span {
    display: none;
  }
}

@media (max-width: 430px) {
  .site-navbar {
    padding-inline: 4px;
  }

  .navbar-brand {
    min-width: 40px;
  }

  .navbar-brand__mark,
  .navbar-brand__logo {
    height: 40px;
    width: 40px;
  }

  .navbar-link {
    font-size: 0.72rem;
    min-width: 58px;
    padding-inline: 3px;
  }

  .navbar-link--processing {
    font-size: 0.65rem;
    min-width: 76px;
  }

  .navbar-actions {
    gap: 2px;
    margin-right: 2px;
  }

  .navbar-login-btn,
  .navbar-cart-btn {
    min-width: 40px;
    padding-inline: 8px;
  }
}

.cart-drawer {
  background: rgb(255, 251, 245);
  color: rgb(67, 52, 43);
  height: calc(100dvh - 72px) !important;
  position: fixed !important;
  top: 72px !important;
}

.cart-drawer :deep(.v-navigation-drawer__content) {
  overflow: hidden !important;
}

.cart-drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.cart-drawer-header {
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  justify-content: space-between;
}

.cart-kicker {
  color: rgb(125, 105, 90);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.cart-close-btn,
.cart-edit-btn,
.cart-remove-btn {
  color: rgb(111, 78, 55);
}

.cart-divider {
  border-color: rgb(222, 210, 198);
  opacity: 1;
}

.cart-empty {
  color: rgb(125, 105, 90);
  flex: 1 1 auto;
  overflow-y: auto;
}

.cart-items {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}

.cart-item {
  border-bottom: 1px solid rgb(222, 210, 198);
  display: flex;
  gap: 12px;
  padding: 0 0 16px;
}

.cart-item + .cart-item {
  padding-top: 16px;
}

.cart-item-image {
  background: rgb(248, 241, 232);
  flex: 0 0 80px;
}

.cart-item-body {
  flex: 1 1 auto;
  min-width: 0;
}

.cart-item-name {
  line-height: 1.4;
}

.cart-item-modifiers {
  color: rgb(125, 105, 90);
  font-size: 0.8rem;
  line-height: 1.5;
}

.cart-item-footer {
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: space-between;
}

.cart-quantity-control {
  align-items: center;
  background: rgb(248, 241, 232);
  border: 1px solid rgb(222, 210, 198);
  border-radius: 0.75rem;
  display: inline-flex;
  overflow: hidden;
}

.cart-quantity-btn {
  color: rgb(111, 78, 55);
}

.cart-quantity-value {
  color: rgb(67, 52, 43);
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  min-width: 28px;
  text-align: center;
}

.cart-item-price,
.cart-total {
  color: rgb(111, 78, 55);
  font-variant-numeric: tabular-nums;
}

.cart-summary {
  background: rgb(248, 241, 232);
  border-top: 1px solid rgb(222, 210, 198);
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  flex: 0 0 auto;
}

.cart-summary > div:first-child,
.cart-summary > .d-flex.ga-2 .cart-clear-btn {
  grid-column: 1 / -1;
}

.cart-summary > .d-flex.ga-2 {
  display: contents !important;
}

.cart-summary > .d-flex.ga-2 .cart-continue-btn {
  grid-column: 1;
}

.cart-summary > .cart-checkout-btn {
  grid-column: 2;
}

.cart-clear-btn {
  border-color: rgb(111, 78, 55);
  color: rgb(111, 78, 55);
  justify-self: start;
  min-height: 46px;
  min-width: 0;
  padding-inline: 12px;
  width: 33.333% !important;
}

.cart-continue-btn {
  background: rgb(111, 78, 55);
  color: white;
}

.cart-checkout-btn {
  background: rgb(42, 126, 125);
  color: white;
  min-height: 48px;
}

.cart-summary .cart-continue-btn {
  min-height: 48px;
}

.cart-continue-btn:hover,
.cart-continue-btn:focus-visible {
  background: rgb(91, 62, 44);
}

.cart-checkout-btn:hover,
.cart-checkout-btn:focus-visible {
  background: rgb(29, 101, 101);
}

.checkout-dialog {
  background: rgb(255, 251, 245);
  color: rgb(67, 52, 43);
}

.cart-edit-dialog {
  background: rgb(255, 251, 245);
  color: rgb(67, 52, 43);
  display: flex;
  flex-direction: column;
  max-height: calc(100dvh - 32px);
}

.cart-edit-content {
  overflow-y: auto;
}

.cart-edit-group:last-child {
  margin-bottom: 0 !important;
}

.cart-edit-option {
  border-color: rgb(222, 210, 198);
  color: rgb(67, 52, 43);
  text-transform: none;
}

.cart-edit-option--selected {
  background: rgb(111, 78, 55);
  color: white;
}

.cart-edit-actions {
  background: rgb(248, 241, 232);
  flex: 0 0 auto;
}

@media (max-width: 599px) {
  .cart-drawer {
    max-width: 100vw;
  }
}
</style>
