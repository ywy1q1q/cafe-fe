<template>
  <v-container class="settings-page">
    <header class="settings-header">
      <div>
        <p class="settings-kicker mb-1">STORE HOURS</p>
        <h1>營業設定</h1>
        <p>設定每週營業時間與線上點餐開放狀態。</p>
      </div>
    </header>

    <v-progress-linear
      v-if="loading"
      class="mb-4"
      color="warning"
      indeterminate
    />

    <section class="online-card">
      <div class="online-card__icon">
        <v-icon icon="mdi-store-clock-outline" size="28" />
      </div>

      <div class="online-card__copy">
        <strong>線上點餐</strong>
        <span>關閉後，首頁會顯示目前暫停線上點餐。</span>
      </div>

      <v-switch
        v-model="form.onlineOrderingEnabled"
        color="success"
        hide-details
        :label="form.onlineOrderingEnabled ? '開放中' : '已關閉'"
      />
    </section>

    <section class="schedule-card">
      <div class="schedule-heading">
        <div>
          <h2>每週營業時間</h2>
          <p>公休日關閉當天開關即可，時間會保留供下次使用。</p>
        </div>

        <span class="timezone-chip">
          <v-icon icon="mdi-map-clock-outline" size="17" />
          台北時間
        </span>
      </div>

      <div class="schedule-list">
        <div
          v-for="day in form.weeklyHours"
          :key="day.dayOfWeek"
          class="schedule-row"
          :class="{ 'schedule-row--closed': !day.isOpen }"
        >
          <div class="day-name">
            <strong>{{ getDayLabel(day.dayOfWeek) }}</strong>
            <span>{{ day.isOpen ? '正常營業' : '公休' }}</span>
          </div>

          <v-switch
            v-model="day.isOpen"
            color="warning"
            hide-details
            inset
          />

          <div class="time-fields">
            <v-text-field
              v-model="day.openTime"
              density="compact"
              :disabled="!day.isOpen"
              hide-details
              label="開店時間"
              type="time"
              variant="outlined"
            />

            <span class="time-separator">至</span>

            <v-text-field
              v-model="day.closeTime"
              density="compact"
              :disabled="!day.isOpen"
              hide-details
              label="關店時間"
              type="time"
              variant="outlined"
            />
          </div>
        </div>
      </div>
    </section>

    <div class="settings-actions">
      <v-chip
        v-if="isDirty"
        color="warning"
        variant="tonal"
      >
        有未儲存變更
      </v-chip>

      <v-btn
        class="save-button"
        :loading="saving"
        prepend-icon="mdi-content-save-outline"
        size="large"
        variant="flat"
        @click="saveSettings"
      >
        儲存設定
      </v-btn>
    </div>

    <v-snackbar v-model="snackbar.open" :color="snackbar.color" timeout="2600">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
  import type { IBusinessDay } from '@/types/businessSettings'
  import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
  import { onBeforeRouteLeave } from 'vue-router'
  import {
    getBusinessSettings,
    updateBusinessSettings,
  } from '@/api/businessSettings'

  const dayLabels = [
    { dayOfWeek: 1, label: '星期一' },
    { dayOfWeek: 2, label: '星期二' },
    { dayOfWeek: 3, label: '星期三' },
    { dayOfWeek: 4, label: '星期四' },
    { dayOfWeek: 5, label: '星期五' },
    { dayOfWeek: 6, label: '星期六' },
    { dayOfWeek: 0, label: '星期日' },
  ]

  const loading = ref(true)
  const saving = ref(false)
  const form = reactive({
    onlineOrderingEnabled: true,
    weeklyHours: createDefaultHours(),
  })
  const snackbar = reactive({
    open: false,
    message: '',
    color: 'success',
  })
  const savedSnapshot = ref(JSON.stringify(form))

  const isDirty = computed(() => JSON.stringify(form) !== savedSnapshot.value)

  function updateSavedSnapshot () {
    savedSnapshot.value = JSON.stringify(form)
  }

  function confirmDiscardChanges () {
    return window.confirm('營業設定尚未儲存，確定要離開嗎？')
  }

  function createDefaultHours (): IBusinessDay[] {
    return dayLabels.map(({ dayOfWeek }) => createDefaultDay(dayOfWeek))
  }

  function createDefaultDay (dayOfWeek: number): IBusinessDay {
    return {
      dayOfWeek,
      isOpen: true,
      openTime: '08:00',
      closeTime: '18:00',
    }
  }

  function getDayLabel (dayOfWeek: number) {
    return dayLabels.find(day => day.dayOfWeek === dayOfWeek)?.label ?? ''
  }

  function showMessage (message: string, color: 'success' | 'error') {
    snackbar.message = message
    snackbar.color = color
    snackbar.open = true
  }

  async function loadSettings () {
    loading.value = true

    try {
      const response = await getBusinessSettings()
      form.onlineOrderingEnabled = response.result.onlineOrderingEnabled
      form.weeklyHours = dayLabels.map(({ dayOfWeek }) => {
        const savedDay = response.result.weeklyHours.find(day => day.dayOfWeek === dayOfWeek)
        return savedDay ? { ...savedDay } : createDefaultDay(dayOfWeek)
      })
      updateSavedSnapshot()
    } catch (error) {
      console.error('載入營業設定失敗', error)
      showMessage('無法載入營業設定，請稍後再試', 'error')
    } finally {
      loading.value = false
    }
  }

  async function saveSettings () {
    const invalidDay = form.weeklyHours.find(
      day => day.isOpen && day.closeTime <= day.openTime,
    )

    if (invalidDay) {
      showMessage(`${getDayLabel(invalidDay.dayOfWeek)}的關店時間必須晚於開店時間`, 'error')
      return
    }

    saving.value = true

    try {
      const response = await updateBusinessSettings({
        onlineOrderingEnabled: form.onlineOrderingEnabled,
        weeklyHours: form.weeklyHours.map(day => ({ ...day })),
      })
      updateSavedSnapshot()
      showMessage(response.message || '營業設定已儲存', 'success')
    } catch (error) {
      console.error('儲存營業設定失敗', error)
      showMessage('儲存失敗，請確認時間後再試', 'error')
    } finally {
      saving.value = false
    }
  }

  onBeforeRouteLeave(() => {
    if (isDirty.value && !confirmDiscardChanges()) return false
  })

  function handleBeforeUnload (event: BeforeUnloadEvent) {
    if (!isDirty.value) return

    event.preventDefault()
    event.returnValue = ''
  }

  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
    loadSettings()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })
</script>

<style scoped>
.settings-page {
  color: #3f3027;
  max-width: 1080px;
  padding: 34px 30px 48px;
}

.settings-header {
  margin-bottom: 24px;
}

.settings-header h1 {
  font-size: 1.85rem;
  line-height: 1.2;
  margin: 0;
}

.settings-header p:last-child,
.schedule-heading p {
  color: #806f63;
  font-size: 0.88rem;
  margin: 7px 0 0;
}

.settings-kicker {
  color: #a36d43;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.save-button {
  background: #6f4e37;
  color: white;
  font-weight: 700;
  min-width: 150px;
}

.settings-actions {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 18px;
}

.online-card,
.schedule-card {
  background: #fffaf2;
  border: 1px solid #dfd2c5;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgb(77 53 39 / 7%);
}

.online-card {
  align-items: center;
  display: flex;
  gap: 16px;
  margin-bottom: 18px;
  padding: 18px 22px;
}

.online-card__icon {
  align-items: center;
  background: #f1e1d0;
  border-radius: 10px;
  color: #8d5b35;
  display: flex;
  height: 50px;
  justify-content: center;
  width: 50px;
}

.online-card__copy {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.online-card__copy span {
  color: #806f63;
  font-size: 0.8rem;
  margin-top: 3px;
}

.schedule-card {
  padding: 24px;
}

.schedule-heading {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.schedule-heading h2 {
  font-size: 1.16rem;
  margin: 0;
}

.timezone-chip {
  align-items: center;
  background: #f2e8dc;
  border-radius: 999px;
  color: #715844;
  display: inline-flex;
  font-size: 0.75rem;
  gap: 6px;
  padding: 7px 10px;
}

.schedule-list {
  border: 1px solid #e5d9ce;
  border-radius: 10px;
  overflow: hidden;
}

.schedule-row {
  align-items: center;
  border-bottom: 1px solid #e8ddd2;
  display: grid;
  gap: 18px;
  grid-template-columns: 120px 100px minmax(320px, 1fr);
  min-height: 80px;
  padding: 13px 18px;
  transition: background-color 160ms ease;
}

.schedule-row:last-child {
  border-bottom: 0;
}

.schedule-row--closed {
  background: #f5f1ec;
}

.day-name {
  display: flex;
  flex-direction: column;
}

.day-name span {
  color: #96867a;
  font-size: 0.73rem;
  margin-top: 2px;
}

.time-fields {
  align-items: center;
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(120px, 1fr) auto minmax(120px, 1fr);
}

.time-separator {
  color: #8c7a6d;
  font-size: 0.8rem;
}

@media (max-width: 760px) {
  .settings-page {
    padding: 22px 14px 36px;
  }

  .settings-actions .save-button {
    width: 100%;
  }

  .online-card {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .online-card :deep(.v-switch) {
    margin-left: 64px;
  }

  .schedule-card {
    padding: 18px 12px;
  }

  .schedule-heading {
    gap: 12px;
  }

  .schedule-row {
    gap: 8px 14px;
    grid-template-columns: 1fr auto;
    padding: 15px 14px;
  }

  .time-fields {
    grid-column: 1 / -1;
  }
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>
