<template>
  <v-container class="register-page d-flex align-center justify-center" fluid>
    <v-card class="register-card pa-7" elevation="10" max-width="420" width="100%">
      <div class="text-center mb-5">
        <h1 class="register-title">加入 CAFE</h1>
        <p class="register-subtitle">建立會員帳號</p>
      </div>

      <v-text-field
        v-model="form.account"
        :error-messages="accountError"
        class="register-input"
        hint="4–20 個英文字母或數字"
        label="帳號"
        persistent-hint
        prepend-inner-icon="mdi-account-outline"
        variant="solo"
      />
      <v-text-field
        v-model="form.password"
        :error-messages="passwordError"
        class="register-input"
        hint="4–20 個字元"
        label="密碼"
        persistent-hint
        type="password"
        prepend-inner-icon="mdi-lock-outline"
        variant="solo"
      />
      <v-text-field
        v-model="form.confirmPassword"
        :error-messages="confirmPasswordError"
        class="register-input mb-4"
        hint="請再次輸入相同密碼"
        label="確認密碼"
        persistent-hint
        type="password"
        prepend-inner-icon="mdi-lock-check-outline"
        variant="solo"
        @keyup.enter="handleRegister"
      />

      <v-alert v-if="message" class="mb-4" density="compact" :type="success ? 'success' : 'error'" variant="tonal">
        {{ message }}
      </v-alert>

      <v-btn block class="register-btn mb-3" :loading="loading" size="large" @click="handleRegister">
        註冊
      </v-btn>
      <v-btn block class="back-btn" size="large" to="/login" variant="outlined">返回登入</v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import * as authApi from '@/api/auth'

  const router = useRouter()
  const loading = ref(false)
  const success = ref(false)
  const message = ref('')
  const form = reactive({ account: '', password: '', confirmPassword: '' })

  const accountError = computed(() => {
    if (!form.account) return ''
    if (form.account.length < 4) return '帳號至少需要 4 個字元'
    if (form.account.length > 20) return '帳號不可超過 20 個字元'
    if (!/^[a-zA-Z0-9]+$/.test(form.account)) return '帳號只能使用英文字母與數字'
    return ''
  })

  const passwordError = computed(() => {
    if (!form.password) return ''
    if (form.password.length < 4) return '密碼至少需要 4 個字元'
    if (form.password.length > 20) return '密碼不可超過 20 個字元'
    return ''
  })

  const confirmPasswordError = computed(() => {
    if (!form.confirmPassword) return ''
    return form.password === form.confirmPassword ? '' : '兩次輸入的密碼不一致'
  })

  async function handleRegister () {
    message.value = ''
    if (
      accountError.value ||
      passwordError.value ||
      confirmPasswordError.value ||
      !form.account ||
      !form.password ||
      !form.confirmPassword
    ) {
      message.value = '請依照欄位提示修正註冊資料'
      return
    }

    loading.value = true
    try {
      await authApi.register({ account: form.account, password: form.password })
      success.value = true
      message.value = '註冊成功，請登入'
      await router.push('/login')
    } catch (error) {
      success.value = false
      message.value = '註冊失敗，請確認帳號與密碼格式'
      console.error(error)
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
.register-page {
  box-sizing: border-box;
  min-height: calc(100vh - 72px);
  padding: 24px 16px;
  background:
    linear-gradient(rgb(92 60 42 / 42%), rgb(92 60 42 / 42%)),
    url('@/assets/login-bg.png') center / cover no-repeat;
}

.register-card {
  background: rgb(255, 247, 224);
  border-radius: 10px;
  color: rgb(67, 52, 43);
}

.register-title {
  margin: 0;
  color: rgb(98, 57, 20);
  font-size: 2.5rem;
  font-weight: 900;
}

.register-subtitle {
  color: rgb(125, 105, 90);
}

.register-input :deep(.v-field) {
  background: rgb(255, 252, 246);
  border-radius: 10px;
  color: rgb(67, 52, 43);
}

.register-input :deep(.v-field__input),
.register-input :deep(input) {
  color: rgb(67, 52, 43) !important;
  caret-color: rgb(98, 57, 20);
}

.register-input :deep(input::placeholder) {
  color: rgb(125, 105, 90) !important;
  opacity: 1;
}

.register-input :deep(.v-label),
.register-input :deep(.v-icon) {
  color: rgb(98, 57, 20);
}

.register-btn {
  height: 48px;
  background: rgb(98, 57, 20);
  border-radius: 10px;
  color: white;
  font-weight: 700;
}

.back-btn {
  height: 48px;
  border-color: rgb(166, 135, 108);
  border-radius: 10px;
  color: rgb(98, 57, 20);
}
</style>
