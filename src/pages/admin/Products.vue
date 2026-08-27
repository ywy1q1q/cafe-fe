<template>
  <v-container class="product-page">
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <div>
        <div class="section-kicker">MENU MANAGEMENT</div>
        <h1 class="text-h5 font-weight-bold product-title">商品管理</h1>

        <p class="product-subtitle mb-0">
          管理商品資料、圖片與客製化群組
        </p>
      </div>

      <v-btn
        class="create-btn"
        prepend-icon="mdi-plus"
        @click="openCreateDialog"
      >
        新增商品
      </v-btn>
    </div>

    <v-card
      class="product-card"
      elevation="0"
      rounded="xl"
    >
      <v-data-table
        :headers="headers"
        hover
        :items="products"
        :loading="loading"
      >
        <template #item.imageUrl="{ item }">
          <v-avatar
            class="product-thumb my-2"
            rounded="lg"
            size="48"
          >
            <v-img
              v-if="hasValidImage(item)"
              alt="商品圖片"
              cover
              :src="item.imageUrl"
              @error="handleImageError(item)"
            />

            <v-icon
              v-else
              icon="mdi-image-off-outline"
            />
          </v-avatar>
        </template>

        <template #item.categoryId="{ item }">
          {{ getCategoryName(item.categoryId) }}
        </template>

        <template #item.modifierGroupIds="{ item }">
          {{ getModifierGroupNames(item.modifierGroupIds) || '無' }}
        </template>

        <template #item.price="{ item }">
          ${{ item.price }}
        </template>

        <template #item.stock="{ item }">
          <div class="stock-stepper">
            <v-btn
              aria-label="減少庫存"
              class="stock-stepper-button"
              :disabled="item.stock <= 0 || isStockSaving(item._id)"
              icon="mdi-minus"
              size="x-small"
              variant="text"
              @click.stop="changeStock(item, -1)"
            />
            <input
              :aria-label="`${item.name}庫存數量`"
              class="stock-input"
              min="0"
              :value="item.stock"
              type="number"
              @change="commitStockInput(item, $event)"
              @click.stop
              @keydown.enter.prevent="commitStockInput(item, $event)"
            >
            <v-btn
              aria-label="增加庫存"
              class="stock-stepper-button"
              :disabled="isStockSaving(item._id)"
              icon="mdi-plus"
              size="x-small"
              variant="text"
              @click.stop="changeStock(item, 1)"
            />
          </div>
        </template>

        <template #item.status="{ item }">
          <v-chip
            :color="item.status ? 'success' : 'grey'"
            size="small"
            variant="tonal"
          >
            {{ item.status ? '啟用' : '停用' }}
          </v-chip>
        </template>

        <template #item.isPopular="{ item }">
          <v-chip
            v-if="item.isPopular"
            color="warning"
            size="small"
            variant="tonal"
          >
            熱門
          </v-chip>

          <span v-else>-</span>
        </template>

        <template #item.actions="{ item }">
          <v-btn
            aria-label="編輯商品"
            icon="mdi-pencil-outline"
            size="small"
            variant="text"
            @click="openEditDialog(item)"
          />

          <v-btn
            aria-label="刪除商品"
            color="error"
            icon="mdi-delete-outline"
            size="small"
            variant="text"
            @click="openDeleteDialog(item)"
          />
        </template>

        <template #no-data>
          <div class="py-10 text-center product-subtitle">
            目前還沒有商品，先新增一個吧。
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog
      v-model="dialog"
      max-width="760"
    >
      <v-card
        class="dialog-card pa-4"
        rounded="xl"
      >
        <v-card-title class="dialog-title d-flex align-center justify-space-between px-2">
          <span>{{ editingId ? '編輯商品' : '新增商品' }}</span>

          <v-btn
            aria-label="關閉視窗"
            class="dialog-close-btn"
            icon="mdi-close"
            size="small"
            variant="text"
            @click="closeDialog"
          />
        </v-card-title>

        <v-card-text class="px-2">
          <v-form ref="formRef">
            <div class="form-grid">
              <v-text-field
                v-model="form.name"
                label="商品名稱"
                :rules="[requiredRule('請輸入商品名稱')]"
              />

              <v-text-field
                v-model.number="form.price"
                label="價格"
                min="0"
                prefix="$"
                :rules="[numberRule('請輸入商品價格')]"
                type="number"
              />

              <v-text-field
                v-model.number="form.stock"
                label="庫存"
                min="0"
                :rules="[numberRule('請輸入庫存數量')]"
                type="number"
              />

              <v-select
                v-model="selectedCategoryId"
                item-title="title"
                item-value="value"
                :items="categoryOptions"
                label="商品分類"
                :rules="[requiredRule('請選擇商品分類')]"
              />
            </div>

            <v-textarea
              v-model="form.description"
              auto-grow
              label="商品描述"
              rows="3"
              :rules="[requiredRule('請輸入商品描述')]"
            />

            <v-select
              v-model="form.modifierGroupIds"
              chips
              closable-chips
              item-title="name"
              item-value="_id"
              :items="modifierGroups"
              label="客製化群組"
              multiple
            />

            <v-file-input
              accept="image/png,image/jpeg"
              class="image-input"
              hint="限 PNG 或 JPG，檔案大小上限 1 MB"
              label="商品圖片"
              :model-value="form.image"
              persistent-hint
              prepend-icon="mdi-camera-outline"
              show-size
              @update:model-value="handleFileChange"
            />

            <div
              v-if="imagePreview"
              class="image-preview mt-4"
            >
              <v-img
                alt="商品圖片預覽"
                cover
                height="180"
                :src="imagePreview"
              />

              <div class="image-preview-label">
                {{ form.image ? '新圖片預覽' : '目前圖片' }}
              </div>
            </div>

            <div class="d-flex flex-wrap ga-6 mt-4">
              <v-switch
                v-model="form.status"
                color="success"
                hide-details
                label="啟用商品"
              />

              <v-switch
                v-model="form.isPopular"
                color="warning"
                hide-details
                label="熱門商品"
              />
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions class="px-2">
          <v-spacer />

          <v-btn
            variant="text"
            @click="closeDialog"
          >
            取消
          </v-btn>

          <v-btn
            class="create-btn"
            :loading="saving"
            @click="editingId ? handleUpdate() : handleCreate()"
          >
            {{ editingId ? '儲存變更' : '建立商品' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="deleteDialog"
      max-width="420"
    >
      <v-card
        class="dialog-card pa-4"
        rounded="xl"
      >
        <v-card-title class="font-weight-bold">刪除商品</v-card-title>

        <v-card-text>
          確定要刪除「{{ deletingProduct?.name }}」嗎？此操作無法復原。
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
            :loading="deleting"
            @click="confirmDelete"
          >
            確認刪除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="2800"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
  import type { ICategory } from '@/types/category'
  import type { IModifierGroup } from '@/types/modifierGroup'
  import type { IProduct, ProductForm } from '@/types/product'
  import { computed, onMounted, reactive, ref } from 'vue'
  import * as categoryApi from '@/api/category'
  import * as modifierGroupApi from '@/api/modifierGroup'
  import * as productApi from '@/api/product'

  const products = ref<IProduct[]>([])
  const categories = ref<ICategory[]>([])
  const modifierGroups = ref<IModifierGroup[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const deleting = ref(false)
  const dialog = ref(false)
  const deleteDialog = ref(false)
  const editingId = ref<string | null>(null)
  const deletingProduct = ref<IProduct | null>(null)
  const imagePreview = ref<string | null>(null)
  const failedImageIds = ref(new Set<string>())
  const stockSavingIds = ref(new Set<string>())
  const selectedCategoryId = ref('')
  const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
  const snackbar = ref(false)
  const snackbarMessage = ref('')
  const snackbarColor = ref<'success' | 'error'>('success')

  const categoryOptions = computed(() => categories.value.map(category => ({
    title: category.name,
    value: category._id,
  })))

  const form = reactive<ProductForm>({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    image: null,
    status: true,
    isPopular: false,
    modifierGroupIds: [],
  })

  const headers = [
    { title: '圖片', key: 'imageUrl', sortable: false },
    { title: '商品名稱', key: 'name' },
    { title: '商品分類', key: 'categoryId' },
    { title: '價格', key: 'price' },
    { title: '庫存', key: 'stock' },
    { title: '客製化群組', key: 'modifierGroupIds', sortable: false },
    { title: '熱門', key: 'isPopular' },
    { title: '狀態', key: 'status' },
    { title: '操作', key: 'actions', sortable: false },
  ]

  function showMessage (message: string, color: 'success' | 'error' = 'success') {
    snackbarMessage.value = message
    snackbarColor.value = color
    snackbar.value = true
  }

  function requiredRule (message: string) {
    return (value: string) => !!String(value ?? '').trim() || message
  }

  function numberRule (message: string) {
    return (value: number) => Number.isFinite(Number(value)) && Number(value) >= 0 || message
  }

  function getCategoryName (category: IProduct['categoryId']) {
    if (typeof category === 'string') {
      return categories.value.find(item => item._id === category)?.name ?? category
    }

    return category?.name ?? '-'
  }

  function getModifierGroupNames (groups: IProduct['modifierGroupIds']) {
    return groups.map(group => typeof group === 'string'
      ? modifierGroups.value.find(item => item._id === group)?.name ?? ''
      : group.name).filter(Boolean).join('、')
  }

  function hasValidImage (product: IProduct) {
    return Boolean(product.imageUrl) && !failedImageIds.value.has(product._id)
  }

  function handleImageError (product: IProduct) {
    failedImageIds.value = new Set(failedImageIds.value).add(product._id)
  }

  function isStockSaving (productId: string) {
    return stockSavingIds.value.has(productId)
  }

  async function changeStock (product: IProduct, amount: number) {
    await saveStock(product, Math.max(0, product.stock + amount))
  }

  function commitStockInput (product: IProduct, event: Event) {
    const input = event.target as HTMLInputElement
    const nextStock = Number(input.value)

    if (!Number.isInteger(nextStock) || nextStock < 0) {
      input.value = String(product.stock)
      return
    }

    void saveStock(product, nextStock)
  }

  async function saveStock (product: IProduct, nextStock: number) {
    if (isStockSaving(product._id) || nextStock === product.stock) return

    const previousStock = product.stock

    product.stock = nextStock
    stockSavingIds.value = new Set(stockSavingIds.value).add(product._id)

    const data = new FormData()
    data.append('stock', String(nextStock))

    try {
      const response = await productApi.updateProduct(product._id, data)
      const index = products.value.findIndex(item => item._id === product._id)
      if (index >= 0) products.value[index] = response.result
    } catch (error) {
      product.stock = previousStock
      console.error('更新庫存失敗', error)
      showMessage('更新庫存失敗，數量已還原', 'error')
    } finally {
      const nextSavingIds = new Set(stockSavingIds.value)
      nextSavingIds.delete(product._id)
      stockSavingIds.value = nextSavingIds
    }
  }

  function resetForm () {
    form.name = ''
    form.price = 0
    form.stock = 0
    form.description = ''
    form.image = null
    form.status = true
    form.isPopular = false
    selectedCategoryId.value = ''
    form.modifierGroupIds = []
    imagePreview.value = null
  }

  function closeDialog () {
    dialog.value = false
    editingId.value = null
    resetForm()
  }

  function openCreateDialog () {
    editingId.value = null
    resetForm()
    selectedCategoryId.value = categories.value[0]?._id ?? ''
    dialog.value = true
  }

  function openEditDialog (product: IProduct) {
    editingId.value = product._id
    form.name = product.name
    form.price = product.price
    form.stock = product.stock
    form.description = product.description
    form.image = null
    form.status = product.status
    form.isPopular = product.isPopular
    selectedCategoryId.value = typeof product.categoryId === 'string' ? product.categoryId : product.categoryId?._id ?? ''
    form.modifierGroupIds = product.modifierGroupIds.map(group => typeof group === 'string' ? group : group._id)
    imagePreview.value = product.imageUrl ?? null
    dialog.value = true
  }

  function handleFileChange (value: File | File[] | null) {
    const file = Array.isArray(value) ? value[0] ?? null : value

    if (!file) {
      form.image = null
      return
    }

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      showMessage('圖片格式必須是 PNG 或 JPG', 'error')
      return
    }
    if (file.size > 1024 * 1024) {
      showMessage('圖片大小不可超過 1 MB', 'error')
      return
    }

    form.image = file
    imagePreview.value = URL.createObjectURL(file)
  }

  function buildFormData () {
    const data = new FormData()
    data.append('name', form.name.trim())
    data.append('price', String(form.price))
    data.append('stock', String(form.stock))
    data.append('description', form.description.trim())
    data.append('status', String(form.status))
    data.append('isPopular', String(form.isPopular))
    data.append('categoryId', selectedCategoryId.value)
    data.append('modifierGroupIds', JSON.stringify(form.modifierGroupIds))
    if (form.image) data.append('image', form.image)

    return data
  }

  async function validateForm () {
    const result = await formRef.value?.validate()
    if (!result?.valid) return false
    if (!selectedCategoryId.value) {
      showMessage('請選擇商品分類', 'error')
      return false
    }
    if (!editingId.value && !form.image) {
      showMessage('新增商品時必須選擇圖片', 'error')
      return false
    }
    return true
  }

  async function loadData () {
    loading.value = true
    try {
      const [productResponse, categoryResponse, modifierResponse] = await Promise.all([
        productApi.getAllProducts(),
        categoryApi.getCategories(),
        modifierGroupApi.getModifierGroups(),
      ])
      products.value = productResponse.result
      categories.value = categoryResponse.result
      modifierGroups.value = modifierResponse.result
    } catch (error) {
      console.error('載入商品資料失敗', error)
      showMessage('載入商品資料失敗', 'error')
    } finally {
      loading.value = false
    }
  }

  async function handleCreate () {
    if (!(await validateForm())) return
    saving.value = true
    try {
      await productApi.createProduct(buildFormData())
      showMessage('商品建立成功')
      closeDialog()
      await loadData()
    } catch (error) {
      console.error('建立商品失敗', error)
      showMessage('建立商品失敗，請確認圖片與商品資料', 'error')
    } finally {
      saving.value = false
    }
  }

  async function handleUpdate () {
    if (!editingId.value || !(await validateForm())) return
    saving.value = true
    try {
      await productApi.updateProduct(editingId.value, buildFormData())
      showMessage('商品更新成功')
      closeDialog()
      await loadData()
    } catch (error) {
      console.error('更新商品失敗', error)
      showMessage('更新商品失敗，請確認圖片與商品資料', 'error')
    } finally {
      saving.value = false
    }
  }

  function openDeleteDialog (product: IProduct) {
    deletingProduct.value = product
    deleteDialog.value = true
  }

  async function confirmDelete () {
    if (!deletingProduct.value) return
    deleting.value = true
    try {
      await productApi.deleteProduct(deletingProduct.value._id)
      showMessage('商品已刪除')
      deleteDialog.value = false
      deletingProduct.value = null
      await loadData()
    } catch (error) {
      console.error('刪除商品失敗', error)
      showMessage('刪除商品失敗', 'error')
    } finally {
      deleting.value = false
    }
  }

  onMounted(loadData)
</script>

<style scoped>
:global(:root) {
  --cafe-surface: rgb(255, 251, 245);
  --cafe-primary: rgb(111, 78, 55);
  --cafe-border: rgb(222, 210, 198);
  --cafe-text: rgb(67, 52, 43);
  --cafe-muted: rgb(125, 105, 90);
}

.product-page {
  color: var(--cafe-text);
}

.section-kicker {
  color: var(--cafe-muted);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  margin-bottom: 0.35rem;
}

.product-title,
.dialog-title {
  color: var(--cafe-text);
}

.product-subtitle {
  color: var(--cafe-muted);
}

.product-card,
.dialog-card {
  background: var(--cafe-surface);
  border: 1px solid var(--cafe-border);
  color: var(--cafe-text);
}

.create-btn {
  background: var(--cafe-primary);
  color: white;
}

.dialog-close-btn {
  color: var(--cafe-muted);
}

.product-thumb {
  background: rgb(248, 241, 232);
  color: var(--cafe-muted);
}

.stock-stepper {
  align-items: center;
  background: rgb(248, 241, 232);
  border: 1px solid var(--cafe-border);
  border-radius: 999px;
  display: inline-flex;
  min-height: 34px;
  padding: 0 0.15rem;
}

.stock-stepper-button {
  color: var(--cafe-primary);
}

.stock-stepper-button:focus-visible {
  outline: 2px solid var(--cafe-primary);
  outline-offset: 1px;
}

.stock-value {
  color: var(--cafe-text);
  font-variant-numeric: tabular-nums;
  min-width: 2rem;
  text-align: center;
}

.stock-input {
  appearance: textfield;
  background: transparent;
  border: 0;
  color: var(--cafe-text);
  font: inherit;
  min-width: 2.5rem;
  outline: none;
  text-align: center;
  width: 3rem;
}

.stock-input::-webkit-inner-spin-button,
.stock-input::-webkit-outer-spin-button {
  appearance: none;
  margin: 0;
}

.stock-input:focus-visible {
  border-radius: 0.25rem;
  outline: 2px solid var(--cafe-primary);
  outline-offset: 1px;
}

.form-grid {
  display: grid;
  gap: 0.8rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.image-preview {
  border: 1px solid var(--cafe-border);
  border-radius: 0.75rem;
  overflow: hidden;
  position: relative;
}

.image-preview-label {
  background: rgba(67, 52, 43, 0.76);
  bottom: 0;
  color: white;
  left: 0;
  padding: 0.4rem 0.7rem;
  position: absolute;
  right: 0;
}

:deep(.v-data-table) {
  background: transparent !important;
  color: var(--cafe-text) !important;
}

:deep(.v-data-table thead),
:deep(.v-data-table-footer) {
  background: transparent !important;
}

:deep(.v-data-table th),
:deep(.v-data-table td),
:deep(.v-data-table-header__content),
:deep(.v-data-table-footer) {
  color: var(--cafe-text) !important;
}

:deep(.v-data-table th) {
  color: var(--cafe-primary) !important;
  font-weight: 700 !important;
}

.image-input :deep(.v-label),
.dialog-card :deep(.v-label),
.dialog-card :deep(.v-field-label),
.dialog-card :deep(.v-field__input) {
  color: var(--cafe-text) !important;
  opacity: 1;
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>
