import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

const CART_STORAGE_KEY = 'cafe-cart'

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  stock: number
  imageUrl: string
  modifiers: Record<string, string[]>
  modifierGroups: CartModifierGroup[]
}

export interface CartModifierItem {
  name: string
  extraPrice: number
  status: boolean
}

export interface CartModifierGroup {
  _id: string
  name: string
  type: 'single' | 'multiple'
  required: boolean
  minSelect: number
  maxSelect: number
  items: CartModifierItem[]
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadCartItems())
  const drawerOpen = ref(false)

  const totalQuantity = computed(() => {
    return items.value.reduce(
      (total, item) => total + item.quantity,
      0,
    )
  })

  const totalPrice = computed(() => {
    return items.value.reduce(
      (total, item) => total + getItemUnitPrice(item) * item.quantity,
      0,
    )
  })

  watch(
    items,
    cartItems => {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems),
      )
    },
    { deep: true },
  )

  function addItem (item: CartItem) {
    const existingItem = items.value.find(cartItem => {
      return cartItem.productId === item.productId
        && areModifiersEqual(cartItem.modifiers, item.modifiers)
    })

    if (existingItem) {
      existingItem.quantity += item.quantity
      existingItem.name = item.name
      existingItem.price = item.price
      existingItem.stock = item.stock
      existingItem.imageUrl = item.imageUrl
      existingItem.modifierGroups = item.modifierGroups
      return
    }

    items.value.push(item)
  }

  function getItemQuantity (
    productId: string,
    modifiers: Record<string, string[]>,
  ) {
    return items.value.find(item => {
      return item.productId === productId
        && areModifiersEqual(item.modifiers, modifiers)
    })?.quantity ?? 0
  }

  function areModifiersEqual (
    modifiersA: Record<string, string[]>,
    modifiersB: Record<string, string[]>,
  ) {
    const groupIdsA = Object.keys(modifiersA)
    const groupIdsB = Object.keys(modifiersB)

    return groupIdsA.length === groupIdsB.length
      && groupIdsA.every(groupId => {
        const valuesA = modifiersA[groupId] ?? []
        const valuesB = modifiersB[groupId] ?? []

        return valuesA.length === valuesB.length
          && valuesA.every(value => valuesB.includes(value))
      })
  }

  function removeItem (index: number) {
    items.value.splice(index, 1)
  }

  function increaseItem (index: number) {
    const item = items.value[index]

    if (item && item.quantity < item.stock) {
      item.quantity += 1
    }
  }

  function decreaseItem (index: number) {
    const item = items.value[index]

    if (item && item.quantity > 1) {
      item.quantity -= 1
    }
  }

  function updateItemModifiers (
    index: number,
    modifiers: Record<string, string[]>,
  ) {
    const item = items.value[index]

    if (!item) {
      return
    }

    const duplicateIndex = items.value.findIndex((cartItem, cartIndex) => {
      return cartIndex !== index
        && cartItem.productId === item.productId
        && areModifiersEqual(cartItem.modifiers, modifiers)
    })

    if (duplicateIndex !== -1) {
      const duplicateItem = items.value[duplicateIndex]

      if (duplicateItem) {
        duplicateItem.quantity += item.quantity
        items.value.splice(index, 1)
      }
      return
    }

    item.modifiers = Object.fromEntries(
      Object.entries(modifiers).map(([groupId, values]) => {
        return [groupId, [...values]]
      }),
    )
  }

  function clearCart () {
    items.value = []
  }

  function openDrawer () {
    drawerOpen.value = true
  }

  function closeDrawer () {
    drawerOpen.value = false
  }

  function toggleDrawer () {
    drawerOpen.value = !drawerOpen.value
  }

  return {
    items,
    drawerOpen,
    totalPrice,
    totalQuantity,
    addItem,
    closeDrawer,
    decreaseItem,
    getItemQuantity,
    increaseItem,
    openDrawer,
    removeItem,
    toggleDrawer,
    updateItemModifiers,
    clearCart,
  }
})

function getItemUnitPrice (item: CartItem) {
  const modifierPrice = Object.entries(item.modifiers).reduce(
    (total, [groupId, itemNames]) => {
      const group = item.modifierGroups.find(
        modifierGroup => modifierGroup._id === groupId,
      )

      if (!group) {
        return total
      }

      return total + itemNames.reduce((groupTotal, itemName) => {
        const modifierItem = group.items.find(option => option.name === itemName)
        return groupTotal + (modifierItem?.extraPrice ?? 0)
      }, 0)
    },
    0,
  )

  return item.price + modifierPrice
}

function loadCartItems (): CartItem[] {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY)

  if (!storedCart) {
    return []
  }

  try {
    const parsedCart: unknown = JSON.parse(storedCart)

    if (!Array.isArray(parsedCart)) {
      return []
    }

    return parsedCart
      .filter(isStoredCartItem)
      .map(item => ({
        ...item,
        stock: item.stock ?? Math.max(item.quantity, 1),
        modifierGroups: item.modifierGroups ?? [],
      }))
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY)
    return []
  }
}

function isStoredCartItem (
  item: unknown,
): item is Omit<CartItem, 'stock' | 'modifierGroups'> & {
  stock?: number
  modifierGroups?: CartModifierGroup[]
} {
  if (!item || typeof item !== 'object') {
    return false
  }

  const cartItem = item as Partial<CartItem>

  return typeof cartItem.productId === 'string'
    && typeof cartItem.name === 'string'
    && typeof cartItem.price === 'number'
    && typeof cartItem.quantity === 'number'
    && typeof cartItem.imageUrl === 'string'
    && !!cartItem.modifiers
    && typeof cartItem.modifiers === 'object'
}
