# 商品分類前後端串接流程

## 1. 目前功能範圍

目前前端商品分類管理頁面已完成：

- 新增商品分類
- 讀取既有分類清單
- 顯示分類排序與啟用狀態
- 使用開關更新分類啟用／停用狀態
- 編輯分類名稱、排序與啟用狀態
- 刪除分類前顯示確認視窗
- 刪除成功後更新清單
- 新增成功後重新載入分類清單
- API 錯誤訊息與 loading 狀態

## 2. 專案檔案安排

```text
cafe-fe/src/
├─ pages/admin/categories/create.vue
│  └─ 頁面畫面、表單、分類清單與使用者操作
├─ services/api.ts
│  └─ 共用 Axios instance、API baseURL、錯誤轉換
├─ services/category.ts
│  └─ Category API 函式
└─ types/category.ts
   └─ Category 型別與 Request／Response 型別
```

後端對應位置：

```text
cafe-back/src/
├─ routes/category.ts
│  └─ 定義 HTTP method 與 URL
├─ controllers/category.ts
│  └─ 驗證請求、呼叫 service、回傳 HTTP response
├─ services/category.ts
│  └─ 執行 Mongoose 資料操作
└─ models/category.ts
   └─ Category schema 與資料欄位
```

## 3. 共用 API 層

`src/services/api.ts` 負責建立共用 Axios instance：

```ts
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

這樣頁面不需要自行建立 Axios，也不需要重複設定：

- API baseURL
- Cookie credentials
- Content-Type
- API 錯誤格式

頁面只需要呼叫 `api.get`、`api.post` 或 `api.put`。

## 4. 新增分類流程

```text
使用者填寫表單
      ↓
Vuetify rules 驗證
      ↓
整理 name、sort、status
      ↓
category service
      ↓
POST /api/categories
      ↓
後端 Yup 驗證
      ↓
Category service 寫入 MongoDB
      ↓
回傳建立結果
      ↓
顯示成功訊息並重新載入清單
```

前端送出的資料只有：

```json
{
  "name": "咖啡",
  "sort": 1,
  "status": true
}
```

對應的 service：

```ts
export const createCategory = async (
  data: ICreateCategory,
): Promise<CreateCategoryResponse> => {
  return api.post<CreateCategoryResponse, ICreateCategory>(
    '/api/categories',
    data,
  )
}
```

## 5. 載入分類清單流程

頁面掛載時執行 `loadCategories`：

```ts
async function loadCategories () {
  isLoadingCategories.value = true

  try {
    const response = await getCategories()
    categories.value = [...response.result]
      .sort((first, second) => first.sort - second.sort)
  } finally {
    isLoadingCategories.value = false
  }
}
```

對應後端：

```text
GET /api/categories
```

這個流程讓畫面載入時可以知道：

- 資料庫目前有哪些分類
- 每個分類的排序
- 每個分類目前是否啟用

## 6. PUT 更新啟用狀態

目前右側清單的開關會執行：

```ts
const response = await updateCategory(category._id, {
  status: !category.status,
})
```

Service：

```ts
export const updateCategory = async (
  id: string,
  data: Partial<ICreateCategory>,
): Promise<UpdateCategoryResponse> => {
  return api.put<UpdateCategoryResponse, Partial<ICreateCategory>>(
    `/api/categories/${id}`,
    data,
  )
}
```

送出的 Request Body：

```json
{
  "status": false
}
```

後端會透過：

```text
PUT /api/categories/:id
```

更新 MongoDB。成功後前端把回傳的 `result` 放回清單，讓畫面立即反映最新狀態。

## 7. 編輯分類名稱與排序

未來可以在每筆清單增加編輯按鈕，開啟對話框：

```ts
const editForm = reactive<ICreateCategory>({
  name: category.name,
  sort: category.sort,
  status: category.status,
})
```

送出時：

```ts
await updateCategory(category._id, {
  name: editForm.name.trim(),
  sort: Number(editForm.sort),
  status: editForm.status,
})

await loadCategories()
```

編輯成功後重新載入清單的好處是排序結果、狀態與後端資料一定一致。

## 8. DELETE 刪除分類

API service 使用：

```ts
export interface DeleteCategoryResponse {
  success: boolean
  message: string
}

export const deleteCategory = async (
  id: string,
): Promise<DeleteCategoryResponse> => {
  return api.delete<DeleteCategoryResponse>(
    `/api/categories/${id}`,
  )
}
```

頁面操作流程：

```text
點擊刪除
  ↓
顯示確認視窗
  ↓
使用者取消：不呼叫 API
  ↓
使用者確認：DELETE /api/categories/:id
  ↓
刪除成功
  ↓
重新載入分類清單
```

刪除前應確認是否有商品正在使用該分類。若後端未處理關聯檢查，建議下一階段在後端補上保護規則，避免刪除後商品失去分類。

## 9. 編輯與刪除畫面行為

右側每筆分類現在都有：

- 鉛筆按鈕：開啟編輯對話框
- 垃圾桶按鈕：開啟刪除確認對話框
- 啟用開關：直接更新 `status`

編輯對話框會沿用新增表單的名稱與排序驗證規則；刪除對話框會顯示分類名稱，使用者確認後才送出 DELETE 請求。

## 10. 錯誤處理方式

共用 API 層會把 Axios 錯誤轉成 `ApiError`：

```ts
if (error instanceof ApiError) {
  errorMessage.value = error.message
} else {
  errorMessage.value = '操作失敗，請稍後再試'
}
```

常見情況：

| 狀況 | 使用者看到的訊息 |
| --- | --- |
| 後端未啟動 | 無法連接伺服器，請確認後端是否已啟動 |
| 分類名稱重複 | 顯示後端回傳的重複錯誤 |
| 請求格式錯誤 | 顯示後端 Yup 驗證訊息 |
| 沒有權限 | 顯示後端權限錯誤 |

## 11. 本次驗證結果

已完成：

- `npm install axios`
- `npm run type-check`
- `npm run build`
- `GET /api/categories` 連線測試
- `PUT /api/categories/:id` 狀態更新測試
- 前端編輯與刪除 UI 建置完成

建置時只出現 Vue Router 的 `rootDir` 提示，不影響 type-check 與 build 成功結果。

## 12. 執行方式

後端：

```bash
cd cafe-back
npm run dev
```

前端：

```bash
cd cafe-fe
npm run dev
```

頁面：

```text
http://localhost:3000/#/admin/categories/create
```
