<template>
  <v-container
    class="login-page d-flex align-center justify-center"
    fluid
  >
    <v-card
      class="login-card pa-7"
      elevation="10"
      max-width="420"
      width="100%"
    >
      <div class="text-center mb-5">
        <h1 class="login-title">
          Login
        </h1>

        <p class="login-subtitle">
          CAFE 登入/註冊
          ，<br>可先點擊建立會員帳號。
        </p>
      </div>

      <v-text-field
        v-model="form.account"
        class="login-input mb-3"
        flat
        hide-details="auto"
        label="帳號"
        prepend-inner-icon="mdi-account-outline"
        variant="solo"
      />

      <v-text-field
        v-model="form.password"
        :append-inner-icon="
          showPassword
            ? 'mdi-eye-off-outline'
            : 'mdi-eye-outline'
        "
        class="login-input mb-3"
        flat
        hide-details="auto"
        label="密碼"
        prepend-inner-icon="mdi-lock-outline"
        :type="showPassword ? 'text' : 'password'"
        variant="solo"
        @click:append-inner="
          showPassword = !showPassword
        "
        @keyup.enter="handleLogin"
      />

      <v-alert
        v-if="errorMessage"
        class="mb-4"
        density="compact"
        type="error"
        variant="tonal"
      >
        {{ errorMessage }}
      </v-alert>

      <v-btn
        block
        class="login-btn mb-3"
        :loading="authStore.loading"
        size="large"
        @click="handleLogin"
      >
        登入
      </v-btn>

      <v-btn
        block
        class="register-btn"
        size="large"
        to="/register"
        variant="text"
      >
        建立會員帳號
      </v-btn>

      <v-btn
        block
        class="back-btn"
        size="large"
        to="/"
        variant="outlined"
      >
        返回首頁
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const authStore = useAuthStore()

  const showPassword = ref(false)
  const errorMessage = ref('')

  const form = reactive({
    account: '',
    password: '',
  })

  async function handleLogin () {
    errorMessage.value = ''

    try {
      await authStore.login({
        account: form.account,
        password: form.password,
      })

      if (authStore.isAdmin) {
        await router.push('/admin')
      } else {
        errorMessage.value = '此帳號沒有管理員權限'
      }
    } catch (error) {
      console.error(error)
      errorMessage.value = '帳號或密碼錯誤'
    }
  }
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 72px);
  padding: 24px 16px;
  background:
    linear-gradient(rgb(92 60 42 / 42%), rgb(92 60 42 / 42%)),
    url('@/assets/login-bg.png') center / cover no-repeat;
}

.login-card {
  background: rgb(255, 247, 224);
  border-radius: 10px;
  color: rgb(67, 52, 43);
  box-shadow:
    0 18px 45px
    rgba(79, 50, 27, 0.22);
}

.login-title {
  margin: 0;
  color: rgb(98, 57, 20);
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: 1px;
}

.login-subtitle {
  margin-top: 6px;
  color: rgb(125, 105, 90);
  font-size: 0.95rem;
}

.login-input :deep(.v-field) {
  background: rgb(255, 252, 246);
  border-radius: 10px;
}

.login-input :deep(.v-field__input) {
  min-height: 52px;
}

.login-btn {
  height: 48px;
  background: rgb(98, 57, 20);
  color: white;
  border-radius: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  box-shadow:
    0 10px 20px
    rgba(98, 57, 20, 0.2);
}

.login-btn:hover {
  background: rgb(79, 45, 16);
}

.back-btn {
  height: 48px;
  color: rgb(98, 57, 20);
  border-color: rgb(166, 135, 108);
  border-radius: 10px;
  font-weight: 700;
}

.login-input :deep(.v-field) {
  background: rgb(255, 252, 246);
  border-radius: 10px;
  color: rgb(67, 52, 43);
}

.login-input :deep(.v-field__input) {
  min-height: 52px;
  color: rgb(67, 52, 43);
}

.login-input :deep(input) {
  color: rgb(67, 52, 43) !important;
  caret-color: rgb(98, 57, 20);
}

.login-input :deep(input::placeholder) {
  color: rgb(125, 105, 90) !important;
  opacity: 1;
}

.login-input :deep(.v-icon) {
  color: rgb(98, 57, 20);
}

.login-input :deep(.v-label) {
  color: rgb(125, 105, 90);
}

.login-input :deep(.v-field--focused .v-label) {
  color: rgb(98, 57, 20);
}

@media (max-width: 600px) {
  .login-card {
    padding: 24px !important;
  }

  .login-title {
    font-size: 2.4rem;
  }
}
</style>
