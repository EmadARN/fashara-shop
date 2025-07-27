import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Cart, OrderItem, ShippingAddress } from '@/types'
import { calcDeliveryDateAndPrice } from '@/lib/actions/order.actions'

const initialState: Cart = {
    items: [],
    itemsPrice: 0,
    taxPrice: undefined,
    shippingPrice: undefined,
    totalPrice: 0,
    paymentMethod: undefined,
    deliveryDateIndex: undefined,
    shippingAddress: undefined,

}

interface CartState {
    cart: Cart
    addItem: (item: OrderItem, quantity: number) => Promise<string>
    updateItem: (item: OrderItem, quantity: number) => Promise<void>
    removeItem: (item: OrderItem) => void
    setShippingAddress: (shippingAddress: ShippingAddress) => Promise<void>
    setPaymentMethod: (paymentMethod: string) => void
    setDeliveryDateIndex: (index: number) => Promise<void>
    clearCart: () => void
}

const useCartStore = create(
    persist<CartState>(
        (set, get) => ({
            cart: initialState,

            addItem: async (item: OrderItem, quantity: number) => {
                const { items, shippingAddress } = get().cart
                const existItem = items.find(
                    (x) =>
                        x.product === item.product &&
                        x.color === item.color &&
                        x.size === item.size
                )

                if (existItem) {
                    if (existItem.countInStock < quantity + existItem.quantity) {
                        throw new Error('Not enough items in stock')
                    }
                } else {
                    if (item.countInStock < item.quantity) {
                        throw new Error('Not enough items in stock')
                    }
                }
                //اگر آیتم تکراری بود، مقدارش زیاد می‌شه. اگر نبود، به لیست اضافه می‌شه
                const updatedCartItems = existItem
                    ? items.map((x) =>
                        x.product === item.product &&
                            x.color === item.color &&
                            x.size === item.size
                            ? { ...existItem, quantity: existItem.quantity + quantity }
                            : x
                    )
                    : [...items, { ...item, quantity }]

                //محاسبه قیمت‌ها و ذخیره در Store:
                set({
                    cart: {
                        ...get().cart,
                        items: updatedCartItems,
                        ...(await calcDeliveryDateAndPrice({
                            items: updatedCartItems,
                            shippingAddress
                        })),
                    },
                })
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                return updatedCartItems.find(
                    (x) =>
                        x.product === item.product &&
                        x.color === item.color &&
                        x.size === item.size
                )?.clientId!
            },
            updateItem: async (item: OrderItem, quantity: number) => {
                const { items, shippingAddress } = get().cart
                const exist = items.find(
                    (x) =>
                        x.product === item.product &&
                        x.color === item.color &&
                        x.size === item.size
                )
                if (!exist) return
                const updatedCartItems = items.map((x) =>
                    x.product === item.product &&
                        x.color === item.color &&
                        x.size === item.size
                        ? { ...exist, quantity: quantity }
                        : x
                )
                set({
                    cart: {
                        ...get().cart,
                        items: updatedCartItems,
                        ...(await calcDeliveryDateAndPrice({
                            items: updatedCartItems,
                            shippingAddress
                        })),
                    },
                })
            },
            removeItem: async (item: OrderItem) => {
                const { items, shippingAddress } = get().cart
                const updatedCartItems = items.filter(
                    (x) =>
                        x.product !== item.product ||
                        x.color !== item.color ||
                        x.size !== item.size
                )
                set({
                    cart: {
                        ...get().cart,
                        items: updatedCartItems,
                        ...(await calcDeliveryDateAndPrice({
                            items: updatedCartItems, shippingAddress
                        })),
                    },
                })
            },
            init: () => set({ cart: initialState }),
            setShippingAddress: async (shippingAddress: ShippingAddress) => {
                const { items } = get().cart
                set({
                    cart: {
                        ...get().cart,
                        shippingAddress,
                        ...(await calcDeliveryDateAndPrice({
                            items,
                            shippingAddress,
                        })),
                    },
                })
            },
            setPaymentMethod: (paymentMethod: string) => {
                set({
                    cart: {
                        ...get().cart,
                        paymentMethod,
                    },
                })
            },
            setDeliveryDateIndex: async (index: number) => {
                const { items, shippingAddress } = get().cart

                set({
                    cart: {
                        ...get().cart,
                        ...(await calcDeliveryDateAndPrice({
                            items,
                            shippingAddress,
                            deliveryDateIndex: index,
                        })),
                    },
                })
            },
            clearCart: () => {
                set({
                    cart: {
                        ...get().cart,
                        items: [],
                    },
                })
            },
        }),
        {
            name: 'cart-store',
        }
    )
)
export default useCartStore