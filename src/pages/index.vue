<template>
  <main class="home-page">
    <v-container class="home-container">
      <section class="hero-layout home-first-screen">
        <div
          class="hero-visual"
          @mouseenter="pauseHeroCarousel"
          @mouseleave="startHeroCarousel"
        >
          <img
            :key="currentHeroSlide.image"
            alt="溫暖的咖啡館吧台"
            class="hero-image"
            :src="currentHeroSlide.image"
          >

          <div class="hero-overlay" />

          <div class="hero-carousel-controls">
            <v-btn
              aria-label="上一張輪播圖片"
              class="hero-arrow-btn"
              icon="mdi-chevron-left"
              size="small"
              variant="text"
              @click="showPreviousHeroSlide"
            />

            <div aria-label="輪播圖片選擇" class="hero-dots" role="group">
              <button
                v-for="(slide, index) in heroSlides"
                :key="slide.image"
                :aria-label="`顯示第 ${index + 1} 張輪播圖片`"
                :aria-pressed="activeHeroSlide === index"
                class="hero-dot"
                :class="{ 'hero-dot--active': activeHeroSlide === index }"
                type="button"
                @click="selectHeroSlide(index)"
              />
            </div>

            <v-btn
              aria-label="下一張輪播圖片"
              class="hero-arrow-btn"
              icon="mdi-chevron-right"
              size="small"
              variant="text"
              @click="showNextHeroSlide"
            />
          </div>

          <div class="hero-content">
            <span class="hero-kicker">每日現磨・現點現做</span>

            <h1>
              <span>Fresh coffee,</span>
              <span class="hero-title-line-2">calm mood.</span>
            </h1>

            <p>慢一點，咖啡剛剛好。</p>

            <div class="hero-actions">
              <v-btn
                class="hero-primary-btn"
                height="46"
                rounded="lg"
                variant="flat"
                @click="handleStartOrdering"
              >
                開始點餐
                <v-icon class="ml-1" icon="mdi-arrow-right" size="18" />
              </v-btn>

              <v-btn
                class="hero-secondary-btn"
                height="46"
                prepend-icon="mdi-receipt-text-outline"
                rounded="lg"
                to="/order-status"
                variant="outlined"
              >
                查看訂單
              </v-btn>
            </div>
          </div>

        </div>
      </section>

      <CoffeeOrigin />

      <CoffeeProcess />

      <section class="recommendation-section">
        <div class="section-heading">
          <div>
            <p class="section-kicker mb-1">Our favorites</p>
            <h2>推薦品項</h2>
            <p>精選幾款適合今天的咖啡。</p>
          </div>

          <v-btn
            class="view-menu-btn"
            to="/menu"
            variant="text"
          >
            查看完整菜單
            <v-icon class="ml-1" icon="mdi-arrow-right" size="18" />
          </v-btn>
        </div>

        <div v-if="loading" class="recommendation-grid">
          <div
            v-for="index in 3"
            :key="index"
            class="product-item product-item--loading"
          >
            <div class="loading-image" />
            <div class="loading-line loading-line--wide" />
            <div class="loading-line" />
          </div>
        </div>

        <div v-else-if="recommendedProducts.length > 0" class="recommendation-grid">
          <article
            v-for="product in recommendedProducts"
            :key="product._id"
            class="product-item"
          >
            <div class="product-image-wrap">
              <img
                :alt="product.name"
                class="product-image"
                loading="lazy"
                :src="product.imageUrl"
              >

            </div>

            <div class="product-item-body">
              <h3 class="product-name-en">{{ product.name }}</h3>
              <p class="product-name-zh">{{ product.description || '適合今天的溫柔一杯。' }}</p>

              <div class="product-footer">
                <strong class="product-price">{{ formatCurrency(product.price) }}</strong>

                <v-btn
                  :aria-label="`前往菜單選擇${product.name}`"
                  class="product-add"
                  icon="mdi-plus"
                  size="42"
                  to="/menu"
                  variant="text"
                />
              </div>
            </div>
          </article>
        </div>

        <div v-else class="recommendation-empty">
          <v-icon icon="mdi-coffee-off-outline" size="40" />
          <strong>推薦餐點準備中</strong>
          <span>稍後再回來看看，或前往菜單瀏覽其他餐點。</span>
        </div>
      </section>

      <section class="order-banner">
        <div class="order-banner-icon">
          <v-icon icon="mdi-coffee-outline" size="30" />
        </div>

        <div class="order-banner-copy">
          <span>簡單三步驟</span>
          <strong>選擇餐點・確認訂單・現場取餐</strong>
        </div>

        <v-spacer />

        <v-btn
          class="order-banner-btn"
          rounded="lg"
          variant="flat"
          @click="handleStartOrdering"
        >
          開始點餐
        </v-btn>
      </section>

      <v-dialog v-model="orderingNoticeOpen" max-width="420">
        <v-card class="ordering-notice-card" rounded="lg">
          <div class="ordering-notice-icon">
            <v-icon icon="mdi-store-clock-outline" size="30" />
          </div>

          <v-card-title>{{ orderingNoticeTitle }}</v-card-title>

          <v-card-text>
            <p>{{ orderingNoticeMessage }}</p>

            <div class="ordering-notice-hours">
              <v-icon icon="mdi-clock-outline" size="18" />
              {{ todayBusinessHoursText }}
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <v-btn
              class="ordering-notice-dismiss"
              variant="text"
              @click="orderingNoticeOpen = false"
            >
              我知道了
            </v-btn>

            <v-btn
              class="ordering-notice-button"
              prepend-icon="mdi-silverware-fork-knife"
              variant="flat"
              @click="viewMenu"
            >
              查看菜單
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </main>
</template>

<script setup lang="ts">
  import type { IBusinessSettings } from '@/types/businessSettings'
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getBusinessSettings } from '@/api/businessSettings'
  import CoffeeOrigin from '@/components/home/CoffeeOrigin.vue'
  import CoffeeProcess from '@/components/home/CoffeeProcess.vue'
  import api from '@/plugins/axios'

  interface Category {
    _id: string
    name: string
  }

  interface Product {
    _id: string
    name: string
    price: number
    description: string
    imageUrl: string
    isPopular: boolean
    categoryId: string | Category
  }

  interface PublicOrderStatus {
    _id: string
    orderNumber: string
    status: 'pending' | 'preparing' | 'ready' | 'completed'
  }

  const products = ref<Product[]>([])
  const orderStatuses = ref<PublicOrderStatus[]>([])
  const route = useRoute()
  const router = useRouter()
  const businessSettings = ref<IBusinessSettings | null>(null)
  const currentDateTime = ref(new Date())
  const loading = ref(true)
  const orderingNoticeOpen = ref(false)
  const handledStartOrderRequest = ref('')
  const activeHeroSlide = ref(0)
  let heroCarouselTimer: ReturnType<typeof setInterval> | undefined
  let businessClockTimer: ReturnType<typeof setInterval> | undefined

  const baseUrl = import.meta.env.BASE_URL

  const heroSlides = [
    { image: `${baseUrl}home-banner-pour-over.png` },
    { image: `${baseUrl}home-banner-desserts.png` },
    { image: `${baseUrl}home-banner-seasonal-drink.png` },
  ]

  const currentHeroSlide = computed(() => heroSlides[activeHeroSlide.value])

  const recommendedProducts = computed(() => {
    return products.value.filter(product => product.isPopular).slice(0, 3)
  })

  const readyCount = computed(() => orderStatuses.value.filter(
    order => order.status === 'ready',
  ).length)

  const todayBusinessHours = computed(() => {
    return businessSettings.value?.weeklyHours.find(
      day => day.dayOfWeek === currentDateTime.value.getDay(),
    ) ?? null
  })

  const todayBusinessHoursText = computed(() => {
    const todayHours = todayBusinessHours.value

    if (!todayHours) return '營業時間載入中'
    if (!todayHours.isOpen) return '今日公休'

    return `今日營業 ${todayHours.openTime}～${todayHours.closeTime}`
  })

  const storeStatusText = computed(() => {
    const settings = businessSettings.value
    const todayHours = todayBusinessHours.value

    if (!settings || !todayHours) return '確認營業狀態中'
    if (!settings.onlineOrderingEnabled) return '暫停線上點餐'
    if (!todayHours.isOpen) return '今日公休'

    const currentMinutes = currentDateTime.value.getHours() * 60
      + currentDateTime.value.getMinutes()
    const openMinutes = getTimeInMinutes(todayHours.openTime)
    const closeMinutes = getTimeInMinutes(todayHours.closeTime)

    if (currentMinutes < openMinutes) return '尚未營業'
    if (currentMinutes >= closeMinutes) return '今日已打烊'
    return '營業中・線上點餐開放'
  })

  const isStoreOpen = computed(() => {
    return storeStatusText.value === '營業中・線上點餐開放'
  })

  const orderingNoticeTitle = computed(() => {
    return storeStatusText.value === '確認營業狀態中'
      ? '請稍候'
      : storeStatusText.value
  })

  const orderingNoticeMessage = computed(() => {
    const settings = businessSettings.value
    const todayHours = todayBusinessHours.value

    if (!settings || !todayHours) return '營業資訊正在載入，請稍後再試。'
    if (!settings.onlineOrderingEnabled) return '店家目前暫停接收線上訂單，請稍後再來。'
    if (!todayHours.isOpen) return '今天是公休日，暫停接受線上訂單，請在其他營業日再來。'

    const currentMinutes = currentDateTime.value.getHours() * 60
      + currentDateTime.value.getMinutes()
    const openMinutes = getTimeInMinutes(todayHours.openTime)

    if (currentMinutes < openMinutes) {
      return `今天 ${todayHours.openTime} 開始營業，營業後即可線上點餐。`
    }

    return '今天的線上點餐時間已結束，歡迎下個營業日再來。'
  })

  async function loadHomeData () {
    loading.value = true

    const [productResult, statusResult, settingsResult] = await Promise.allSettled([
      api.get('/api/products'),
      api.get('/api/orders/status'),
      getBusinessSettings(),
    ])

    if (productResult.status === 'fulfilled') {
      products.value = productResult.value.data.result
    } else {
      console.error('載入首頁推薦餐點失敗', productResult.reason)
    }

    if (statusResult.status === 'fulfilled') {
      orderStatuses.value = statusResult.value.data.result
    } else {
      console.error('載入首頁訂單狀態失敗', statusResult.reason)
    }

    if (settingsResult.status === 'fulfilled') {
      businessSettings.value = settingsResult.value.result
    } else {
      console.error('載入營業設定失敗', settingsResult.reason)
    }

    loading.value = false
  }

  function formatCurrency (price: number) {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  function getTimeInMinutes (time: string) {
    const [hours = 0, minutes = 0] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  function handleStartOrdering () {
    if (isStoreOpen.value) {
      void router.push('/menu')
      return
    }

    orderingNoticeOpen.value = true
  }

  function viewMenu () {
    orderingNoticeOpen.value = false
    void router.push('/menu')
  }

  watch(
    [() => route.query.startOrder, businessSettings],
    ([startOrderRequest, settings]) => {
      const requestId = Array.isArray(startOrderRequest)
        ? startOrderRequest[0]
        : startOrderRequest

      if (!requestId || !settings || handledStartOrderRequest.value === requestId) return

      handledStartOrderRequest.value = requestId
      handleStartOrdering()
    },
    { immediate: true },
  )

  function showNextHeroSlide () {
    activeHeroSlide.value = (activeHeroSlide.value + 1) % heroSlides.length
  }

  function showPreviousHeroSlide () {
    activeHeroSlide.value = (
      activeHeroSlide.value - 1 + heroSlides.length
    ) % heroSlides.length
  }

  function selectHeroSlide (index: number) {
    activeHeroSlide.value = index
    startHeroCarousel()
  }

  function pauseHeroCarousel () {
    if (heroCarouselTimer) {
      clearInterval(heroCarouselTimer)
      heroCarouselTimer = undefined
    }
  }

  function startHeroCarousel () {
    pauseHeroCarousel()
    heroCarouselTimer = setInterval(showNextHeroSlide, 6500)
  }

  onMounted(() => {
    void loadHomeData()
    startHeroCarousel()
    businessClockTimer = setInterval(() => {
      currentDateTime.value = new Date()
    }, 60_000)
  })

  onBeforeUnmount(() => {
    pauseHeroCarousel()
    if (businessClockTimer) clearInterval(businessClockTimer)
  })
</script>

<style scoped>
.home-page {
  --home-bg: #fdf0d1;
  --home-surface: #f9f0e0;
  --home-primary: #6f4e37;
  --home-primary-dark: #4d3527;
  --home-text: #3f3027;
  --home-muted: #8a7464;
  --home-border: #e3d7ca;
  --story-bg: #faecd3;
  --story-ink: #3f3027;
  --story-primary: #6f4e37;
  --story-accent: #9b643c;
  --story-muted: #806b5c;
  --story-line: rgb(111 78 55 / 16%);
  background:
    radial-gradient(circle at 92% 8%, rgb(169 124 83 / 13%), transparent 28%),
    var(--home-bg);
  color: var(--home-text);
  min-height: calc(100vh - 72px);
}

.home-container {
  max-width: 1460px;
  padding: 28px 32px 46px;
}

.hero-layout {
  display: grid;
  gap: 14px;
  grid-template-columns: minmax(0, 2.05fr) minmax(300px, 0.75fr);
}

.hero-visual,
.store-panel,
.category-rail,
.product-card,
.order-banner {
  border: 1px solid rgb(205 181 157 / 48%);
  border-radius: 10px;
  box-shadow: 0 14px 38px rgb(79 54 37 / 9%);
}

.hero-visual {
  min-height: 430px;
  overflow: hidden;
  position: relative;
}

.hero-image {
  animation: hero-image-in 700ms ease;
  height: 100%;
  inset: 0;
  object-fit: cover;
  object-position: center 53%;
  position: absolute;
  width: 100%;
}

.hero-carousel-controls {
  align-items: center;
  bottom: 18px;
  display: flex;
  gap: 10px;
  position: absolute;
  right: 20px;
  z-index: 3;
}

.hero-arrow-btn {
  background: rgb(34 24 17 / 52%);
  border: 1px solid rgb(255 255 255 / 28%);
  color: white;
}

.hero-dots {
  align-items: center;
  background: rgb(34 24 17 / 48%);
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 999px;
  display: flex;
  gap: 7px;
  padding: 8px 10px;
}

.hero-dot {
  background: rgb(255 255 255 / 55%);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  height: 7px;
  padding: 0;
  transition: background-color 180ms ease, width 180ms ease;
  width: 7px;
}

.hero-dot--active {
  background: white;
  width: 22px;
}

.hero-overlay {
  background: linear-gradient(90deg, rgb(50 23 14 / 48%) 0%, rgb(50 23 14 / 20%) 38%, rgb(50 23 14 / 2%) 68%, transparent 100%);
  inset: 0;
  position: absolute;
}

.hero-content {
  bottom: 18%;
  color: #f7f3ec;
  display: flex;
  flex-direction: column;
  left: 7%;
  max-width: 620px;
  padding: 0;
  position: absolute;
}

.hero-kicker {
  align-self: flex-start;
  background: rgb(50 23 14 / 24%);
  border: 1px solid rgb(247 243 236 / 34%);
  border-radius: 999px;
  color: #f7f3ec;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 18px;
  padding: 7px 12px;
}

.hero-content h1 {
  color: #f7f3ec;
  font-family: "Akaya Kanadaka", sans-serif;
  font-size: clamp(56px, 6vw, 92px);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 0.95;
  margin: 0;
}

.hero-content h1 span {
  display: block;
}

.hero-title-line-2 {
  margin-left: 0.35em;
}

.hero-content p {
  color: rgb(247 243 236 / 88%);
  font-family: "Noto Sans TC", sans-serif;
  font-size: clamp(15px, 1.4vw, 18px);
  font-weight: 400;
  line-height: 1.8;
  margin: 18px 0 24px;
  max-width: 480px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hero-primary-btn {
  background: var(--home-surface);
  color: var(--home-primary-dark);
  font-weight: 750;
}

.hero-secondary-btn {
  background: rgb(50 23 14 / 24%);
  border-color: rgb(247 243 236 / 55%);
  color: #f7f3ec;
}

.store-panel {
  background:
    linear-gradient(160deg, rgb(249 240 224 / 92%), rgb(232 210 188 / 72%)),
    var(--home-surface);
  display: flex;
  flex-direction: column;
  min-height: 430px;
  padding: 24px;
}

.store-panel-header,
.section-heading,
.product-card-footer,
.order-banner {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.section-kicker {
  color: #9b7960;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.store-panel h2,
.section-heading h2 {
  color: var(--home-text);
  font-size: 1.25rem;
  line-height: 1.3;
  margin: 0;
}

.open-chip {
  align-items: center;
  background: #e4efe7;
  border-radius: 999px;
  color: #47745c;
  display: inline-flex;
  font-size: 0.7rem;
  font-weight: 750;
  gap: 6px;
  padding: 6px 9px;
}

.open-dot {
  background: #4f8a68;
  border-radius: 50%;
  height: 7px;
  width: 7px;
}

.open-chip--closed {
  background: #eee3d8;
  color: #895e45;
}

.open-chip--closed .open-dot {
  background: #a06d4d;
}

.business-hours {
  align-items: center;
  color: #766355;
  display: flex;
  font-size: 0.76rem;
  gap: 7px;
  margin-top: 14px;
}

.status-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 14px 0 12px;
}

.status-item {
  align-items: center;
  background: rgb(249 240 224 / 84%);
  border: 1px solid var(--home-border);
  border-radius: 10px;
  display: flex;
  gap: 11px;
  min-height: 98px;
  padding: 14px;
}

.status-item--wait {
  grid-column: 1 / -1;
  min-height: 74px;
}

.status-icon {
  align-items: center;
  border-radius: 10px;
  display: inline-flex;
  flex: 0 0 38px;
  height: 38px;
  justify-content: center;
}

.status-icon--preparing {
  background: #fff0dc;
  color: #a96720;
}

.status-icon--ready {
  background: #e3f0ec;
  color: #2a7e7d;
}

.status-icon--wait {
  background: #eee1d2;
  color: var(--home-primary);
}

.wait-time {
  font-size: 1.35rem !important;
}

.status-copy {
  align-items: baseline;
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}

.status-copy small {
  color: var(--home-muted);
  flex-basis: 100%;
  font-size: 0.68rem;
}

.status-copy strong {
  color: var(--home-text);
  font-size: 1.75rem;
  line-height: 1.1;
}

.status-copy span {
  color: var(--home-muted);
  font-size: 0.7rem;
}

.spotlight-card {
  align-items: center;
  background: rgb(111 78 55 / 92%);
  border-radius: 10px;
  color: white;
  display: flex;
  gap: 12px;
  margin-top: auto;
  min-height: 96px;
  padding: 12px;
}

.spotlight-image {
  border-radius: 8px;
  flex: 0 0 72px;
  height: 72px;
  object-fit: cover;
  width: 72px;
}

.spotlight-copy {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
}

.spotlight-copy span {
  color: rgb(255 255 255 / 66%);
  font-size: 0.67rem;
}

.spotlight-copy strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.spotlight-copy small {
  color: #f2c994;
  font-weight: 750;
  margin-top: 5px;
}

.spotlight-btn,
.product-order-btn {
  background: var(--home-surface);
  color: var(--home-primary);
}

.store-note {
  align-items: center;
  color: var(--home-muted);
  display: flex;
  font-size: 0.72rem;
  gap: 7px;
  margin-top: 14px;
}

.category-rail {
  align-items: center;
  background: var(--home-surface);
  display: flex;
  gap: 4px;
  margin: 16px 0;
  min-height: 66px;
  overflow-x: auto;
  padding: 9px 14px;
  scrollbar-width: none;
}

.category-rail::-webkit-scrollbar {
  display: none;
}

.category-link {
  color: #725a49;
  flex: 0 0 auto;
  font-size: 0.78rem;
  text-transform: none;
}

.category-link--active {
  background: #f1e5d7;
  color: var(--home-primary-dark);
}

.recommendation-section {
  background: rgb(249 240 224 / 74%);
  border: 1px solid rgb(205 181 157 / 48%);
  border-radius: 10px;
  padding: 26px;
}

.section-heading {
  margin-bottom: 20px;
}

.section-heading > div > p:last-child {
  color: var(--home-muted);
  font-size: 0.82rem;
  margin: 6px 0 0;
}

.view-menu-btn {
  color: var(--home-primary);
  font-weight: 700;
}

.recommendation-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.product-card {
  background: var(--home-surface);
  min-width: 0;
  overflow: hidden;
  transition: box-shadow 160ms ease, transform 160ms ease;
}

.product-image-wrap {
  height: 158px;
  overflow: hidden;
  position: relative;
}

.product-image {
  height: 100%;
  object-fit: cover;
  transition: transform 220ms ease;
  width: 100%;
}

.popular-chip {
  background: rgb(70 47 32 / 82%);
  border-radius: 999px;
  color: white;
  font-size: 0.66rem;
  font-weight: 700;
  left: 10px;
  padding: 5px 8px;
  position: absolute;
  top: 10px;
}

.product-card-body {
  display: flex;
  flex-direction: column;
  min-height: 180px;
  padding: 14px;
}

.product-category {
  color: #a17a5d;
  font-size: 0.64rem;
  font-weight: 700;
}

.product-card h3 {
  color: var(--home-text);
  font-size: 0.96rem;
  margin: 4px 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-card p {
  color: var(--home-muted);
  display: -webkit-box;
  font-size: 0.72rem;
  line-height: 1.5;
  margin: 0 0 12px;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-card-footer {
  margin-top: auto;
}

.product-card-footer strong {
  color: #9a5b2c;
  font-size: 0.92rem;
}

.product-order-btn {
  border: 1px solid var(--home-border);
}

.recommendation-empty {
  align-items: center;
  color: var(--home-muted);
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  min-height: 240px;
}

.product-card--loading {
  min-height: 338px;
  padding: 12px;
}

.loading-image,
.loading-line {
  animation: shimmer 1.4s ease-in-out infinite;
  background: #eee2d6;
  border-radius: 8px;
}

.loading-image {
  height: 158px;
  margin-bottom: 20px;
}

.loading-line {
  height: 12px;
  margin-bottom: 12px;
  width: 60%;
}

.loading-line--wide {
  width: 88%;
}

.order-banner {
  background:
    linear-gradient(90deg, rgb(111 78 55 / 95%), rgb(74 49 34 / 92%)),
    var(--home-primary);
  color: white;
  gap: 16px;
  margin-top: 16px;
  min-height: 94px;
  padding: 18px 24px;
}

.order-banner-icon {
  align-items: center;
  background: rgb(255 255 255 / 12%);
  border-radius: 10px;
  display: flex;
  height: 52px;
  justify-content: center;
  width: 52px;
}

.order-banner-copy {
  display: flex;
  flex-direction: column;
}

.order-banner-copy span {
  color: rgb(255 255 255 / 64%);
  font-size: 0.7rem;
}

.order-banner-copy strong {
  font-size: 1.05rem;
}

.order-banner-btn {
  background: var(--home-surface);
  color: var(--home-primary-dark);
  font-weight: 750;
}

.ordering-notice-card {
  background: #fffaf2;
  color: #3f3027;
  padding: 24px;
  text-align: center;
}

.ordering-notice-icon {
  align-items: center;
  background: #f1e1d0;
  border-radius: 10px;
  color: #8d5b35;
  display: flex;
  height: 58px;
  justify-content: center;
  margin: 0 auto 10px;
  width: 58px;
}

.ordering-notice-card :deep(.v-card-title) {
  font-size: 1.25rem;
  font-weight: 750;
}

.ordering-notice-card :deep(.v-card-text) {
  color: #8a7464;
  line-height: 1.7;
  padding-bottom: 16px;
}

.ordering-notice-card p {
  margin: 0;
}

.ordering-notice-hours {
  align-items: center;
  background: #f5ebde;
  border-radius: 10px;
  color: #765743;
  display: flex;
  gap: 7px;
  justify-content: center;
  margin-top: 16px;
  padding: 10px 12px;
}

.ordering-notice-button {
  background: #6f4e37;
  color: white;
  font-weight: 700;
  min-width: 110px;
}

.ordering-notice-dismiss {
  color: #765743;
  font-weight: 650;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
}

@keyframes hero-image-in {
  from { opacity: 0.45; transform: scale(1.015); }
  to { opacity: 1; transform: scale(1); }
}

@media (hover: hover) and (pointer: fine) {
  .product-card:hover {
    box-shadow: 0 16px 32px rgb(79 54 37 / 14%);
    transform: translateY(-3px);
  }

  .product-card:hover .product-image {
    transform: scale(1.035);
  }
}

@media (max-width: 1240px) {
  .recommendation-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 960px) {
  .hero-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .store-panel {
    min-height: 0;
  }

  .spotlight-card {
    margin-top: 8px;
  }
}

@media (max-width: 700px) {
  .home-container {
    padding: 16px 14px 34px;
  }

  .hero-visual {
    min-height: 500px;
  }

  .hero-overlay {
    background: linear-gradient(0deg, rgb(50 23 14 / 48%) 0%, rgb(50 23 14 / 20%) 64%, transparent 100%);
  }

  .hero-content {
    bottom: 16%;
    left: 24px;
    right: 24px;
  }

  .hero-content h1 {
    font-size: clamp(42px, 13vw, 62px);
    line-height: 0.98;
  }

  .hero-content p {
    font-size: 14px;
  }

  .hero-carousel-controls {
    display: none;
  }

  .hero-actions .v-btn {
    flex: 1;
  }

  .recommendation-section {
    padding: 20px 14px;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }

  .view-menu-btn {
    align-self: flex-end;
  }

  .recommendation-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .product-image-wrap {
    height: 140px;
  }

  .order-banner {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .order-banner .v-spacer {
    display: none;
  }

  .order-banner-btn {
    margin-left: auto;
  }
}

@media (max-width: 440px) {
  .status-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .recommendation-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .product-card {
    display: grid;
    grid-template-columns: 124px minmax(0, 1fr);
  }

  .product-image-wrap {
    height: 100%;
    min-height: 184px;
  }

  .product-card-body {
    min-height: 184px;
  }

  .product-card--loading {
    display: block;
    min-height: 240px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .product-card,
  .product-image {
    transition: none;
  }

  .product-card:hover {
    transform: none;
  }

  .loading-image,
  .loading-line,
  .hero-image {
    animation: none;
  }
}

/* First-screen layout: the navbar sits over the hero only. */
.home-first-screen {
  display: block;
  margin-left: calc(50% - 50vw);
  width: 100vw;
}

.home-first-screen .hero-visual {
  border: 0;
  border-radius: 0;
  box-shadow: none;
  min-height: 100dvh;
  overflow: visible;
}

@media (max-width: 700px) {
  .home-first-screen .hero-visual {
    min-height: 100svh;
  }

}

/* Editorial featured products: image-led, cardless presentation. */
.recommendation-section {
  background: transparent;
  border: 0;
  border-radius: 0;
  padding: 96px 6vw 110px;
}

.recommendation-grid {
  gap: 32px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.product-item {
  min-width: 0;
}

.product-image-wrap {
  aspect-ratio: 8 / 5;
  height: auto;
  overflow: hidden;
}

.product-image {
  border-radius: 10px;
  display: block;
  height: 100%;
  transition: transform 350ms ease;
  width: 100%;
}

.product-item-body {
  padding-top: 16px;
}

.product-name-en {
  color: #32170e;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 1.45rem;
  font-weight: 600;
  line-height: 1.1;
  margin: 0;
}

.product-name-zh {
  color: #75513c;
  font-family: "Noto Sans TC", sans-serif;
  font-size: 0.82rem;
  line-height: 1.6;
  margin: 6px 0 14px;
}

.product-footer {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.product-price {
  color: #32170e;
  font-size: 1.05rem;
  font-weight: 600;
}

.product-add {
  background: #ede3d6;
  border-radius: 50%;
  color: #32170e;
  min-width: 42px;
  width: 42px;
}

.product-item--loading {
  background: transparent;
  min-height: 0;
  padding: 0;
}

.product-item--loading .loading-image {
  aspect-ratio: 8 / 5;
  height: auto;
  margin-bottom: 16px;
}

@media (hover: hover) and (pointer: fine) {
  .product-item:hover .product-image {
    transform: scale(1.015);
  }
}

@media (max-width: 960px) {
  .recommendation-section {
    padding: 72px 5vw 84px;
  }

  .recommendation-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .recommendation-section {
    padding: 56px 24px 72px;
  }

  .recommendation-grid {
    gap: 42px;
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
