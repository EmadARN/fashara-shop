import { formatNumberWithDecimal } from '@/utils'
import { z } from 'zod'



// USER
const UserName = z
    .string()
    .min(2, { message: 'Username must be at least 2 characters' })
    .max(50, { message: 'Username must be at most 30 characters' })
const Email = z.string().min(1, 'Email is required').email('Email is invalid')
const Password = z.string().min(3, 'Password must be at least 3 characters')
const UserRole = z.string().min(1, 'role is required')

export const UserInputSchema = z.object({
    name: UserName,
    email: Email,
    image: z.string().optional(),
    emailVerified: z.boolean(),
    role: UserRole,
    password: Password,
    paymentMethod: z.string().min(1, 'Payment method is required'),
    address: z.object({
        fullName: z.string().min(1, 'Full name is required'),
        street: z.string().min(1, 'Street is required'),
        city: z.string().min(1, 'City is required'),
        province: z.string().min(1, 'Province is required'),
        postalCode: z.string().min(1, 'Postal code is required'),
        country: z.string().min(1, 'Country is required'),
        phone: z.string().min(1, 'Phone number is required'),
    }),
})

export const UserSignInSchema = z.object({
    email: Email,
    password: Password,
})


// Common
const Price = (field: string) =>
    z.coerce
        .number()
        .refine(
            (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(value)),
            `${field} must have exactly two decimal places (e.g., 49.99)`
        )
export const ProductInputSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    slug: z.string().min(3, 'Slug must be at least 3 characters'),
    category: z.string().min(1, 'Category is required'),
    images: z.array(z.string()).min(1, 'Product must have at least one image'),
    brand: z.string().min(1, 'Brand is required'),
    description: z.string().min(1, 'Description is required'),
    isPublished: z.boolean(),
    price: Price('Price'),
    listPrice: Price('List price'),
    countInStock: z.coerce
        .number()
        .int()
        .nonnegative('count in stock must be a non-negative number'),
    tags: z.array(z.string()).default([]),
    sizes: z.array(z.string()).default([]),
    colors: z.array(z.string()).default([]),
    avgRating: z.coerce
        .number()
        .min(0, 'Average rating must be at least 0')
        .max(5, 'Average rating must be at most 5'),
    numReviews: z.coerce
        .number()
        .int()
        .nonnegative('Number of reviews must be a non-negative number'),
    ratingDistribution: z
        .array(z.object({ rating: z.number(), count: z.number() }))
        .max(5),
    reviews: z.array(z.string()).default([]),
    numSales: z.coerce
        .number()
        .int()
        .nonnegative('Number of sales must be a non-negative number'),
})


// Order Item
export const OrderItemSchema = z.object({
    clientId: z.string().min(1, 'clientId is required'),
    product: z.string().min(1, 'Product is required'),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    category: z.string().min(1, 'Category is required'),
    quantity: z
        .number()
        .int()
        .nonnegative('Quantity must be a non-negative number'),
    countInStock: z
        .number()
        .int()
        .nonnegative('Quantity must be a non-negative number'),
    image: z.string().min(1, 'Image is required'),
    price: Price('Price'),
    size: z.string().optional(),
    color: z.string().optional(),
})

export const ShippingAddressSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    street: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    province: z.string().min(1, 'Province is required'),
    phone: z.string().min(1, 'Phone number is required'),
    country: z.string().min(1, 'Country is required'),
})


export const CartSchema = z.object({
    items: z
        .array(OrderItemSchema)
        .min(1, 'Order must contain at least one item'),
    itemsPrice: z.number(),
    shippingAddress: z.optional(ShippingAddressSchema),
    taxPrice: z.optional(z.number()),
    shippingPrice: z.optional(z.number()),
    totalPrice: z.number(),
    paymentMethod: z.optional(z.string()),
    deliveryDateIndex: z.optional(z.number()),
    expectedDeliveryDate: z.optional(z.date()),
})


export const UserSignUpSchema = UserSignInSchema.extend({
    name: UserName,
    confirmPassword: Password,
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})
