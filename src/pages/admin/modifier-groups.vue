<template>
  <v-container class="modifier-page">
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <div>
        <div class="section-kicker">MENU SETTINGS</div>

        <h1 class="text-h5 font-weight-bold modifier-title">
          客製化群組
        </h1>

        <p class="text-body-2 modifier-subtitle mb-0">
          管理商品可選的客製化內容與加價設定
        </p>
      </div>

      <v-btn
        class="create-btn"
        prepend-icon="mdi-plus"
        @click="openCreateDialog"
      >
        新增客製化群組
      </v-btn>
    </div>

    <v-card
      class="modifier-card"
      elevation="0"
      rounded="xl"
    >
      <v-data-table
        v-model:expanded="expandedGroups"
        :headers="headers"
        hover
        item-value="_id"
        :items="modifierGroups"
        :loading="loading"
        show-expand
      >
        <template #item.type="{ item }">
          {{ item.type === 'single' ? '單選' : '複選' }}
        </template>

        <template #item.required="{ item }">
          {{ item.required ? '必選' : '非必選' }}
        </template>

        <template #item.items="{ item }">
          {{ item.items.length }} 項
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

        <template #item.actions="{ item }">
          <v-btn
            aria-label="編輯群組"
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click="openEditDialog(item)"
          />

          <v-btn
            aria-label="刪除群組"
            color="error"
            icon="mdi-delete-outline"
            size="small"
            variant="text"
            @click="openDeleteDialog(item)"
          />
        </template>

        <template #expanded-row="{ columns, item }">
          <tr class="expanded-group-row">
            <td :colspan="columns.length">
              <div class="expanded-group-content">
                <div class="expanded-group-heading">
                  <span class="text-subtitle-2 font-weight-bold">內容選項</span>
                  <span class="modifier-subtitle">共 {{ item.items.length }} 項</span>
                </div>

                <div
                  v-if="item.items.length > 0"
                  class="expanded-items"
                >
                  <div
                    v-for="option in [...item.items].sort((a, b) => a.sort - b.sort)"
                    :key="`${item._id}-${option.sort}-${option.name}`"
                    class="expanded-item"
                  >
                    <div class="expanded-item-name">
                      <span class="expanded-item-number">{{ option.sort }}</span>
                      <span>{{ option.name }}</span>
                    </div>

                    <span>加價 {{ option.extraPrice }} 元</span>

                    <v-chip
                      v-if="option.isDefault"
                      color="primary"
                      size="x-small"
                      variant="tonal"
                    >
                      預設
                    </v-chip>

                    <v-switch
                      class="expanded-item-switch"
                      color="success"
                      density="compact"
                      hide-details
                      :label="option.status ? '啟用' : '停用'"
                      :model-value="option.status"
                      @click.stop
                      @update:model-value="toggleItemStatus(item, option, $event)"
                    />

                    <v-btn
                      aria-label="編輯內容選項"
                      class="expanded-item-edit"
                      icon="mdi-pencil-outline"
                      size="small"
                      variant="text"
                      @click.stop="openItemEditor(item, option)"
                    />
                  </div>
                </div>

                <div
                  v-else
                  class="modifier-subtitle py-2"
                >
                  此群組目前沒有內容選項。
                </div>
              </div>
            </td>
          </tr>
        </template>

        <template #no-data>
          <div class="py-10 text-center modifier-subtitle">
            目前還沒有客製化群組，先新增一個吧。
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
          <span>
            {{ editingId ? '編輯客製化群組' : '新增客製化群組' }}
          </span>

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
                label="群組名稱"
                :rules="nameRules"
              />

              <v-select
                v-model="form.type"
                item-title="title"
                item-value="value"
                :items="typeOptions"
                label="選擇方式"
              />

              <v-text-field
                v-model.number="form.minSelect"
                label="最少選擇數量"
                min="0"
                type="number"
              />

              <v-text-field
                v-model.number="form.maxSelect"
                label="最多選擇數量"
                min="1"
                type="number"
              />
            </div>

            <div class="d-flex flex-wrap ga-6 mb-5">
              <v-switch
                v-model="form.required"
                color="primary"
                hide-details
                label="必須選擇"
              />

              <v-switch
                v-model="form.status"
                color="primary"
                hide-details
                label="啟用群組"
              />
            </div>

            <div class="items-heading d-flex align-center justify-space-between mb-3">
              <div>
                <div class="text-subtitle-1 font-weight-bold">客製化選項</div>

                <div class="text-body-2 modifier-subtitle">
                  點擊選項列即可直接編輯或刪除內容
                </div>
              </div>

              <v-chip
                color="primary"
                size="small"
                variant="tonal"
              >
                {{ form.items.length }} 項
              </v-chip>
            </div>

            <v-list
              class="item-list pa-0"
              lines="two"
            >
              <div
                v-for="(item, index) in form.items"
                :key="index"
                class="item-editor"
                :class="{
                  'item-editor--active': expandedItemIndex === index,
                  'item-editor--drag-over': dragOverIndex === index,
                  'item-editor--dragging': draggedItemIndex === index,
                }"
                :draggable="expandedItemIndex !== index"
                @dragend.stop="clearDragState"
                @dragover.stop.prevent="dragOverIndex = index"
                @dragstart.stop="startDragging(index)"
                @drop.stop.prevent="dropItem(index)"
              >
                <v-list-item
                  class="item-row"
                  rounded="lg"
                  @click="toggleItemEditor(index)"
                >
                  <template #prepend>
                    <div class="d-flex align-center ga-2">
                      <v-icon
                        class="drag-handle"
                        icon="mdi-drag-vertical"
                        size="22"
                        title="拖曳調整順序"
                      />

                      <v-avatar
                        class="item-index"
                        size="34"
                      >
                        {{ index + 1 }}
                      </v-avatar>
                    </div>
                  </template>

                  <v-list-item-title class="font-weight-bold">
                    {{ item.name || '未命名選項' }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    加價 {{ item.extraPrice }} 元・排序 {{ item.sort }}・{{ item.status ? '啟用' : '停用' }}・{{ item.isDefault ? '預設' : '非預設' }}
                  </v-list-item-subtitle>

                  <template #append>
                    <v-btn
                      :aria-label="expandedItemIndex === index ? '收合選項' : '編輯選項'"
                      :icon="expandedItemIndex === index ? 'mdi-chevron-up' : 'mdi-pencil-outline'"
                      size="small"
                      variant="text"
                      @click.stop="toggleItemEditor(index)"
                    />

                    <v-btn
                      aria-label="刪除選項"
                      color="error"
                      icon="mdi-delete-outline"
                      size="small"
                      variant="text"
                      @click.stop="removeItem(index)"
                    />
                  </template>
                </v-list-item>

                <v-expand-transition>
                  <div
                    v-if="expandedItemIndex === index"
                    class="item-edit-panel"
                  >
                    <div class="item-form-grid">
                      <v-text-field
                        v-model="item.name"
                        density="comfortable"
                        hide-details
                        label="選項名稱"
                      />

                      <v-text-field
                        v-model.number="item.extraPrice"
                        density="comfortable"
                        hide-details
                        label="加價"
                        min="0"
                        suffix="元"
                        type="number"
                      />

                      <v-text-field
                        v-model.number="item.sort"
                        density="comfortable"
                        hide-details
                        label="排序"
                        min="0"
                        type="number"
                      />
                    </div>

                    <div class="d-flex flex-wrap align-center justify-space-between ga-3 mt-2">
                      <div class="d-flex flex-wrap ga-5">
                        <v-switch
                          v-model="item.isDefault"
                          color="primary"
                          density="compact"
                          hide-details
                          label="設為預設"
                        />

                        <v-switch
                          v-model="item.status"
                          color="primary"
                          density="compact"
                          hide-details
                          label="啟用"
                        />
                      </div>

                      <v-btn
                        class="item-done-btn"
                        size="small"
                        @click="expandedItemIndex = null"
                      >
                        完成編輯
                      </v-btn>
                    </div>
                  </div>
                </v-expand-transition>
              </div>
            </v-list>

            <div class="new-item-panel mt-4">
              <div class="text-subtitle-2 font-weight-bold mb-3">新增選項</div>

              <div class="item-form-grid">
                <v-text-field
                  v-model="newItem.name"
                  density="comfortable"
                  hide-details
                  label="選項名稱"
                  placeholder="例如：無糖、正常冰"
                />

                <v-text-field
                  v-model.number="newItem.extraPrice"
                  density="comfortable"
                  hide-details
                  label="加價"
                  min="0"
                  suffix="元"
                  type="number"
                />

                <v-text-field
                  v-model.number="newItem.sort"
                  density="comfortable"
                  hide-details
                  label="排序"
                  min="0"
                  type="number"
                />
              </div>

              <div class="d-flex flex-wrap align-center justify-space-between ga-3 mt-2">
                <div class="d-flex flex-wrap ga-5">
                  <v-switch
                    v-model="newItem.isDefault"
                    color="primary"
                    density="compact"
                    hide-details
                    label="設為預設"
                  />

                  <v-switch
                    v-model="newItem.status"
                    color="primary"
                    density="compact"
                    hide-details
                    label="啟用"
                  />
                </div>

                <v-btn
                  color="primary"
                  prepend-icon="mdi-plus"
                  variant="outlined"
                  @click="addItem"
                >
                  加入選項
                </v-btn>
              </div>
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
            {{ editingId ? '儲存變更' : '建立群組' }}
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
        <v-card-title class="font-weight-bold">刪除客製化群組</v-card-title>

        <v-card-text>
          確定要刪除「{{ deletingGroup?.name }}」嗎？此操作無法復原。
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
      timeout="2500"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
  import type { IModifierGroup, IModifierItem } from '@/types/modifierGroup'
  import { onMounted, reactive, ref } from 'vue'
  import * as modifierGroupApi from '@/api/modifierGroup'

  const modifierGroups = ref<IModifierGroup[]>([])
  const expandedGroups = ref<string[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const deleting = ref(false)
  const dialog = ref(false)
  const deleteDialog = ref(false)
  const editingId = ref<string | null>(null)
  const deletingGroup = ref<IModifierGroup | null>(null)
  const expandedItemIndex = ref<number | null>(null)
  const draggedItemIndex = ref<number | null>(null)
  const dragOverIndex = ref<number | null>(null)
  const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

  const snackbar = ref(false)
  const snackbarMessage = ref('')
  const snackbarColor = ref<'success' | 'error'>('success')

  const form = reactive({
    name: '',
    type: 'single' as 'single' | 'multiple',
    required: false,
    minSelect: 0,
    maxSelect: 1,
    status: true,
    items: [] as IModifierItem[],
  })

  const newItem = reactive<IModifierItem>({
    name: '',
    extraPrice: 0,
    isDefault: false,
    sort: 1,
    status: true,
  })

  const headers = [
    { title: '群組名稱', key: 'name' },
    { title: '選擇方式', key: 'type' },
    { title: '必要性', key: 'required' },
    { title: '最少選擇', key: 'minSelect' },
    { title: '最多選擇', key: 'maxSelect' },
    { title: '選項數量', key: 'items' },
    { title: '狀態', key: 'status' },
    { title: '操作', key: 'actions', sortable: false },
  ]

  const typeOptions = [
    { title: '單選', value: 'single' },
    { title: '複選', value: 'multiple' },
  ]

  const nameRules = [
    (value: string) => !!value.trim() || '請輸入群組名稱',
  ]

  function showMessage (message: string, color: 'success' | 'error' = 'success') {
    snackbarMessage.value = message
    snackbarColor.value = color
    snackbar.value = true
  }

  function resetNewItem () {
    newItem.name = ''
    newItem.extraPrice = 0
    newItem.isDefault = false
    newItem.sort = form.items.length + 1
    newItem.status = true
  }

  function resetForm () {
    form.name = ''
    form.type = 'single'
    form.required = false
    form.minSelect = 0
    form.maxSelect = 1
    form.status = true
    form.items = []
    expandedItemIndex.value = null
    resetNewItem()
  }

  function closeDialog () {
    dialog.value = false
    editingId.value = null
    expandedItemIndex.value = null
  }

  function openCreateDialog () {
    editingId.value = null
    resetForm()
    dialog.value = true
  }

  function openEditDialog (group: IModifierGroup) {
    editingId.value = group._id
    form.name = group.name
    form.type = group.type
    form.required = group.required
    form.minSelect = group.minSelect
    form.maxSelect = group.maxSelect
    form.status = group.status
    form.items = group.items.map(item => ({ ...item }))
    expandedItemIndex.value = null
    resetNewItem()
    dialog.value = true
  }

  function addItem () {
    if (!newItem.name.trim()) {
      showMessage('請輸入選項名稱', 'error')
      return
    }

    form.items.push({
      name: newItem.name.trim(),
      extraPrice: Number(newItem.extraPrice) || 0,
      isDefault: newItem.isDefault,
      sort: Number(newItem.sort) || form.items.length + 1,
      status: newItem.status,
    })
    resetNewItem()
  }

  function toggleItemEditor (index: number) {
    expandedItemIndex.value = expandedItemIndex.value === index ? null : index
  }

  function removeItem (index: number) {
    form.items.splice(index, 1)
    updateItemSort()
    expandedItemIndex.value = null
    resetNewItem()
  }

  function startDragging (index: number) {
    draggedItemIndex.value = index
    dragOverIndex.value = index
  }

  function clearDragState () {
    draggedItemIndex.value = null
    dragOverIndex.value = null
  }

  function updateItemSort () {
    for (const [index, item] of form.items.entries()) {
      item.sort = index + 1
    }
  }

  function dropItem (targetIndex: number) {
    if (draggedItemIndex.value === null || draggedItemIndex.value === targetIndex) {
      clearDragState()
      return
    }

    const [draggedItem] = form.items.splice(draggedItemIndex.value, 1)

    if (draggedItem) {
      form.items.splice(targetIndex, 0, draggedItem)
      updateItemSort()
      resetNewItem()
    }

    clearDragState()
  }

  async function validateForm () {
    const result = await formRef.value?.validate()

    if (!result?.valid) return false
    if (form.items.length === 0) {
      showMessage('請至少加入一個客製化選項', 'error')
      return false
    }
    if (form.minSelect > form.maxSelect) {
      showMessage('最少選擇數量不能大於最多選擇數量', 'error')
      return false
    }
    return true
  }

  async function loadModifierGroups () {
    loading.value = true
    try {
      const response = await modifierGroupApi.getModifierGroups()
      modifierGroups.value = response.result
    } catch (error) {
      console.error('載入客製化群組失敗', error)
      showMessage('載入客製化群組失敗', 'error')
    } finally {
      loading.value = false
    }
  }

  async function handleCreate () {
    if (!(await validateForm())) return

    saving.value = true
    try {
      await modifierGroupApi.createModifierGroup({ ...form })
      showMessage('客製化群組建立成功')
      closeDialog()
      resetForm()
      await loadModifierGroups()
    } catch (error) {
      console.error('建立客製化群組失敗', error)
      showMessage('建立客製化群組失敗', 'error')
    } finally {
      saving.value = false
    }
  }

  async function handleUpdate () {
    if (!editingId.value || !(await validateForm())) return

    saving.value = true
    try {
      await modifierGroupApi.updateModifierGroup(editingId.value, { ...form })
      showMessage('客製化群組更新成功')
      closeDialog()
      resetForm()
      await loadModifierGroups()
    } catch (error) {
      console.error('更新客製化群組失敗', error)
      showMessage('更新客製化群組失敗', 'error')
    } finally {
      saving.value = false
    }
  }

  async function toggleItemStatus (
    group: IModifierGroup,
    option: IModifierItem,
    status: boolean | null,
  ) {
    if (status === null) return

    const previousStatus = option.status
    option.status = status

    try {
      await modifierGroupApi.updateModifierGroup(group._id, {
        items: group.items,
      })
      showMessage(`${option.name} 已${status ? '啟用' : '停用'}`)
    } catch (error) {
      option.status = previousStatus
      console.error('更新客製化選項狀態失敗', error)
      showMessage('更新客製化選項狀態失敗', 'error')
    }
  }

  function openItemEditor (group: IModifierGroup, option: IModifierItem) {
    const optionIndex = group.items.indexOf(option)

    openEditDialog(group)
    expandedItemIndex.value = optionIndex === -1 ? null : optionIndex
  }

  function openDeleteDialog (group: IModifierGroup) {
    deletingGroup.value = group
    deleteDialog.value = true
  }

  async function confirmDelete () {
    if (!deletingGroup.value) return

    deleting.value = true
    try {
      await modifierGroupApi.deleteModifierGroup(deletingGroup.value._id)
      showMessage('客製化群組已刪除')
      deleteDialog.value = false
      deletingGroup.value = null
      await loadModifierGroups()
    } catch (error) {
      console.error('刪除客製化群組失敗', error)
      showMessage('刪除客製化群組失敗', 'error')
    } finally {
      deleting.value = false
    }
  }

  onMounted(loadModifierGroups)
</script>

<style scoped>
:global(:root) {
  --cafe-bg: rgb(242, 235, 225);
  --cafe-surface: rgb(255, 251, 245);
  --cafe-primary: rgb(111, 78, 55);
  --cafe-border: rgb(222, 210, 198);
  --cafe-text: rgb(67, 52, 43);
  --cafe-muted: rgb(125, 105, 90);
}

.modifier-page {
  color: var(--cafe-text);
}

.section-kicker {
  color: var(--cafe-muted);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  margin-bottom: 0.35rem;
}

.modifier-title,
.item-list :deep(.v-list-item-title) {
  color: var(--cafe-text);
}

.modifier-subtitle {
  color: var(--cafe-muted);
}

.modifier-card,
.dialog-card {
  background: var(--cafe-surface);
  border: 1px solid var(--cafe-border);
  color: var(--cafe-text);
}

.create-btn {
  background: var(--cafe-primary);
  color: white;
}

.dialog-title {
  color: var(--cafe-text);
}

.dialog-close-btn {
  color: var(--cafe-muted);
}

.expanded-group-row {
  background: rgb(248, 241, 232);
}

.expanded-group-content {
  padding: 0.85rem 1.2rem 1rem;
}

.expanded-group-heading {
  align-items: center;
  color: var(--cafe-text);
  display: flex;
  gap: 0.7rem;
  margin-bottom: 0.6rem;
}

.expanded-items {
  display: grid;
  gap: 0.45rem;
}

.expanded-item {
  align-items: center;
  background: var(--cafe-surface);
  border: 1px solid var(--cafe-border);
  border-radius: 0.6rem;
  color: var(--cafe-text);
  display: grid;
  gap: 0.75rem;
  grid-template-columns: minmax(160px, 1fr) auto auto auto;
  padding: 0.55rem 0.75rem;
}

.expanded-item-name {
  align-items: center;
  display: flex;
  font-weight: 600;
  gap: 0.55rem;
}

.expanded-item-number {
  align-items: center;
  background: var(--cafe-primary);
  border-radius: 999px;
  color: white;
  display: inline-flex;
  font-size: 0.72rem;
  height: 1.45rem;
  justify-content: center;
  width: 1.45rem;
}

.expanded-item-switch {
  justify-self: end;
  min-width: 76px;
}

.expanded-item-switch :deep(.v-label) {
  color: var(--cafe-text);
  opacity: 1;
}

.expanded-item-edit {
  color: var(--cafe-primary);
  justify-self: end;
}

.item-done-btn {
  background: var(--cafe-primary);
  color: white;
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

.form-grid,
.item-form-grid {
  display: grid;
  gap: 0.8rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.item-form-grid {
  grid-template-columns: 2fr 1fr 1fr;
}

.items-heading {
  border-top: 1px solid var(--cafe-border);
  padding-top: 1.2rem;
}

.item-list {
  background: transparent;
}

.item-editor {
  border: 1px solid var(--cafe-border);
  border-radius: 0.75rem;
  margin-bottom: 0.65rem;
  overflow: hidden;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.item-editor--active {
  border-color: var(--cafe-primary);
  box-shadow: 0 6px 18px rgba(67, 52, 43, 0.08);
}

.item-editor--drag-over {
  border-color: var(--cafe-primary);
  border-style: dashed;
}

.item-editor--dragging {
  opacity: 0.55;
  transform: scale(0.99);
}

.item-row {
  background: rgb(248, 241, 232);
  color: var(--cafe-text);
  cursor: pointer;
}

.item-row :deep(.v-list-item-subtitle) {
  color: var(--cafe-muted);
  opacity: 1;
}

.item-index {
  background: var(--cafe-primary);
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
}

.drag-handle {
  color: var(--cafe-muted);
  cursor: grab;
  pointer-events: none;
}

.drag-handle:active {
  cursor: grabbing;
}

.item-edit-panel,
.new-item-panel {
  background: rgb(255, 253, 249);
  padding: 1rem 1.2rem 1.15rem;
}

.item-edit-panel :deep(.v-label),
.new-item-panel :deep(.v-label) {
  color: var(--cafe-text) !important;
  opacity: 1;
}

.item-edit-panel :deep(.v-field-label),
.new-item-panel :deep(.v-field-label),
.item-edit-panel :deep(.v-field__input),
.new-item-panel :deep(.v-field__input) {
  color: var(--cafe-text) !important;
}

.new-item-panel {
  border: 1px dashed var(--cafe-border);
  border-radius: 0.75rem;
}

@media (max-width: 600px) {
  .form-grid,
  .item-form-grid {
    grid-template-columns: 1fr;
  }

  .item-edit-panel,
  .new-item-panel {
    padding: 0.85rem;
  }

  .expanded-item {
    align-items: start;
    grid-template-columns: 1fr auto auto;
  }

  .expanded-item-name {
    grid-column: 1 / -1;
  }
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>
