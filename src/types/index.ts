import { CartSchema, OrderItemSchema, ProductInputSchema, UserInputSchema, UserSignInSchema } from "@/lib/validator";
import { z } from 'zod'

export type IProductInput = z.infer<typeof ProductInputSchema>
export type Data = {
    products: IProductInput[]
    users: IUserInput[]
    headerMenus: {
        name: string
        href: string
    }[]
    carousels: {
        image: string
        url: string
        title: string
        buttonCaption: string
        isPublished: boolean
    }[]
}

// user
export type IUserInput = z.infer<typeof UserInputSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>

export type OrderItem = z.infer<typeof OrderItemSchema>
export type Cart = z.infer<typeof CartSchema>