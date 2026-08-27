<template>
  <!-- 上方 Navbar -->
  <v-app-bar
    class="admin-navbar"
    elevation="0"
  >
    <v-app-bar-nav-icon
      color="white"
      @click="drawer = !drawer"
    />

    <v-toolbar-title class="font-weight-bold">
      CAFE 後台管理
    </v-toolbar-title>

    <v-spacer />

    <div class="d-flex align-center ga-2 mr-4">
      <v-icon icon="mdi-account-circle" />

      <span>
        {{ authStore.user?.account }}
      </span>
    </div>

    <v-btn
      prepend-icon="mdi-logout"
      variant="text"
      @click="handleLogout"
    >
      登出
    </v-btn>
  </v-app-bar>

  <!-- 左側 Sidebar -->
  <v-navigation-drawer
    v-model="drawer"
    class="admin-sidebar"
  >
    <div class="pa-5">
      <div class="text-subtitle-2 sidebar-label">
        管理選單
      </div>
    </div>

    <v-list
      class="px-3"
      nav
    >
      <v-list-item
        prepend-icon="mdi-view-dashboard-outline"
        rounded="lg"
        title="儀表板"
        to="/admin"
      />

      <v-list-item
        prepend-icon="mdi-receipt-text-outline"
        rounded="lg"
        title="訂單管理"
        to="/admin/orders"
      />

      <v-list-item
        prepend-icon="mdi-coffee-outline"
        rounded="lg"
        title="商品管理"
        to="/admin/products"
      />

      <v-list-item
        prepend-icon="mdi-shape-outline"
        rounded="lg"
        title="商品分類"
        to="/admin/categories"
      />

      <v-list-item
        prepend-icon="mdi-tune"
        rounded="lg"
        title="客製化群組"
        to="/admin/modifier-groups"
      />

      <v-list-item
        prepend-icon="mdi-store-clock-outline"
        rounded="lg"
        title="營業設定"
        to="/admin/business-settings"
      />
    </v-list>

    <v-spacer />

    <div class="sidebar-footer">
      <v-divider class="sidebar-divider mb-3" />

      <v-list nav>
        <v-list-item
          class="sidebar-home-link"
          prepend-icon="mdi-home-outline"
          rounded="lg"
          title="回首頁"
          to="/"
        />
      </v-list>
    </div>
  </v-navigation-drawer>

  <!-- 頁面內容 -->
  <v-main class="admin-main">
    <router-view />
  </v-main>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const drawer = ref(true)
  const authStore = useAuthStore()
  const router = useRouter()

  async function handleLogout () {
    await authStore.logout()
    await router.replace('/login')
  }
</script>

<style scoped>
.admin-navbar {
  background: rgb(111, 78, 55);
  color: white;
}

.admin-sidebar {
  background: rgb(255, 251, 245);
  color: rgb(67, 52, 43);
}

.admin-sidebar :deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
}

.sidebar-label {
  color: rgb(125, 105, 90);
}

.sidebar-footer {
  padding: 12px 12px 18px;
}

.sidebar-divider {
  border-color: rgb(222, 210, 198);
  opacity: 1;
}

.sidebar-home-link {
  background: rgb(248, 241, 232);
  border: 1px solid rgb(222, 210, 198);
  color: rgb(111, 78, 55);
}

.admin-main {
  min-height: 100vh;
  background: rgb(242, 235, 225);
}

</style>
