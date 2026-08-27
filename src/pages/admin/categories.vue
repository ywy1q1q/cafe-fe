<template>
  <v-container class="category-page">
    <!-- 1. 標題 + 新增按鈕 -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold category-title">
          商品分類
        </h1>

        <p class="text-body-2 category-subtitle">
          管理商品分類與顯示順序
        </p>
      </div>

      <v-btn
        class="create-btn"
        prepend-icon="mdi-plus"
        @click="openCreateDialog"
      >
        新增分類
      </v-btn>
    </div>

    <!-- 2. 分類列表 -->
    <v-card
      class="category-card"
      elevation="0"
      rounded="xl"
    >
      <v-data-table
        :headers="headers"
        :items="categories"
        :loading="loading"
      >
        <!-- 狀態欄 -->
        <template #item.status="{ item }">
          <v-chip
            :color="item.status ? 'success' : 'grey'"
            size="small"
            variant="tonal"
          >
            {{ item.status ? '啟用' : '停用' }}
          </v-chip>
        </template>

        <!-- 操作欄 -->
        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click="openEditDialog(item)"
          />

          <v-btn
            color="error"
            icon="mdi-delete"
            size="small"
            variant="text"
            @click="openDeleteDialog(item)"
          />
        </template>
      </v-data-table>
    </v-card>

    <!-- 3. 新增 / 修改 Dialog -->
    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card
        class="dialog-card pa-4"
        rounded="xl"
      >
        <v-card-title class="font-weight-bold">
          {{ editingId ? '修改分類' : '新增分類' }}
        </v-card-title>

        <v-card-text>
          <v-form ref="formRef">
            <v-text-field
              v-model="form.name"
              label="分類名稱"
              :rules="nameRules"
            />

            <v-text-field
              v-model.number="form.sort"
              label="排序"
              :rules="sortRules"
              type="number"
            />

            <v-switch
              v-model="form.status"
              color="primary"
              label="啟用"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            variant="text"
            @click="dialog = false"
          >
            取消
          </v-btn>

          <v-btn
            class="create-btn"
            :loading="saving"
            @click="editingId ? handleUpdate() : handleCreate()"
          >
            {{ editingId ? '儲存修改' : '新增' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 4. 刪除確認 Dialog -->
    <v-dialog
      v-model="deleteDialog"
      max-width="420"
    >
      <v-card
        class="dialog-card pa-4"
        rounded="xl"
      >
        <v-card-title class="font-weight-bold">
          確認刪除
        </v-card-title>

        <v-card-text>
          確定要刪除
          「{{ deletingCategory?.name }}」
          嗎？
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            variant="text"
            @click="deleteDialog = false"
          >
            取消
          </v-btn>

          <v-btn
            color="error"
            @click="confirmDelete"
          >
            確定刪除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 5. 成功 / 失敗提示 -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="2500"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
  import type { ICategory } from '@/types/category'
  import { onMounted, reactive, ref } from 'vue'
  import * as categoryApi from '@/api/category'

  // 1. 列表資料
  const categories = ref<ICategory[]>([])

  // 2. Loading 狀態
  const loading = ref(false)
  const saving = ref(false)

  // 3. 新增 / 修改 Dialog
  const dialog = ref(false)
  const editingId = ref<string | null>(null)

  // 4. 刪除 Dialog
  const deleteDialog = ref(false)
  const deletingCategory = ref<ICategory | null>(null)

  // 5. Snackbar
  const snackbar = ref(false)
  const snackbarMessage = ref('')
  const snackbarColor = ref<'success' | 'error'>('success')

  // 6. 表單
  const formRef = ref()

  const form = reactive({
    name: '',
    sort: 0,
    status: true,
  })

  // 7. 表格欄位
  const headers = [
    { title: '分類名稱', key: 'name' },
    { title: '排序', key: 'sort' },
    { title: '狀態', key: 'status' },
    { title: '操作', key: 'actions', sortable: false },
  ]

  // 8. 驗證規則
  const nameRules = [
    (value: string) => !!value || '分類名稱必填',
  ]

  const sortRules = [
    (value: number) => value >= 0 || '排序不能小於 0',
  ]

  // 9. 清空表單
  function resetForm () {
    form.name = ''
    form.sort = 0
    form.status = true
  }

  // 10. Snackbar 共用函式
  function showMessage (
    message: string,
    color: 'success' | 'error' = 'success',
  ) {
    snackbarMessage.value = message
    snackbarColor.value = color
    snackbar.value = true
  }

  // 11. 表單驗證
  async function validateForm () {
    const result = await formRef.value?.validate()

    return result?.valid ?? false
  }

  // 12. 取得分類
  async function loadCategories () {
    loading.value = true

    try {
      const response = await categoryApi.getCategories()

      categories.value = [...response.result].sort(
        (a, b) => a.sort - b.sort || a.name.localeCompare(b.name, 'zh-Hant'),
      )
    } catch (error) {
      console.error('取得分類失敗：', error)
      showMessage('取得分類失敗', 'error')
    } finally {
      loading.value = false
    }
  }

  // 13. 開啟新增 Dialog
  function openCreateDialog () {
    editingId.value = null
    resetForm()
    dialog.value = true
  }

  // 14. 開啟修改 Dialog
  function openEditDialog (category: ICategory) {
    editingId.value = category._id

    form.name = category.name
    form.sort = category.sort
    form.status = category.status

    dialog.value = true
  }

  // 15. 新增分類
  async function handleCreate () {
    const valid = await validateForm()

    if (!valid) return

    saving.value = true

    try {
      await categoryApi.createCategory({
        name: form.name,
        sort: form.sort,
        status: form.status,
      })

      showMessage('分類新增成功')

      dialog.value = false
      resetForm()

      await loadCategories()
    } catch (error) {
      console.error('新增分類失敗：', error)
      showMessage('分類新增失敗', 'error')
    } finally {
      saving.value = false
    }
  }

  // 16. 修改分類
  async function handleUpdate () {
    if (!editingId.value) return

    const valid = await validateForm()

    if (!valid) return

    saving.value = true

    try {
      await categoryApi.updateCategory(
        editingId.value,
        {
          name: form.name,
          sort: form.sort,
          status: form.status,
        },
      )

      showMessage('分類修改成功')

      dialog.value = false
      editingId.value = null
      resetForm()

      await loadCategories()
    } catch (error) {
      console.error('修改分類失敗：', error)
      showMessage('分類修改失敗', 'error')
    } finally {
      saving.value = false
    }
  }

  // 17. 開啟刪除 Dialog
  function openDeleteDialog (category: ICategory) {
    deletingCategory.value = category
    deleteDialog.value = true
  }

  // 18. 確認刪除
  async function confirmDelete () {
    if (!deletingCategory.value) return

    try {
      await categoryApi.deleteCategory(
        deletingCategory.value._id,
      )

      showMessage('分類刪除成功')

      deleteDialog.value = false
      deletingCategory.value = null

      await loadCategories()
    } catch (error) {
      console.error('刪除分類失敗：', error)
      showMessage('分類刪除失敗', 'error')
    }
  }

  // 19. 頁面載入時取得資料
  onMounted(() => {
    loadCategories()
  })
</script>

<style scoped>
:global(:root) {
  --cafe-bg: rgb(242, 235, 225);
  --cafe-surface: rgb(255, 251, 245);
  --cafe-primary: rgb(111, 78, 55);
  --cafe-secondary: rgb(166, 135, 108);
  --cafe-text: rgb(67, 52, 43);
  --cafe-muted: rgb(125, 105, 90);
}

/* 商品分類頁 */
.category-page {
  color: var(--cafe-text);
}

/* 標題 */
.category-title {
  color: var(--cafe-text);
}

/* 副標題 */
.category-subtitle {
  color: var(--cafe-muted);
}

/* 表格外面的卡片 */
.category-card {
  background: var(--cafe-surface);
  color: var(--cafe-text);
  border: 1px solid rgb(222, 210, 198);
}

/* 新增 / 修改 / 刪除視窗 */
.dialog-card {
  background: var(--cafe-surface);
  color: var(--cafe-text);
}

/* 主要按鈕 */
.create-btn {
  background: var(--cafe-primary);
  color: white;
}

/* Vuetify 表格 */
:deep(.v-data-table) {
  background: transparent;
  color: var(--cafe-text);
}

/* 表格標題 */
:deep(.v-data-table-header__content) {
  color: var(--cafe-primary);
  font-weight: 700;
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>
