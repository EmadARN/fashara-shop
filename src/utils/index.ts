import { clsx, type ClassValue } from "clsx";
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatNumberWithDecimal = (num: number): string => {
    const [int, decimal] = num.toString().split('.')
    return decimal ? `${int}.${decimal.padEnd(2, '0')}` : int
}

export const toSlug = (text: string): string =>
    text
        .toLowerCase()
        .replace(/[^\w\s-]+/g, '')     // حذف کاراکترهای خاص
        .replace(/\s+/g, '-')          // فاصله به خط فاصله
        .replace(/-+/g, '-')           // خط فاصله‌های تکراری به یکی
        .replace(/^-+|-+$/g, '');      // حذف خط فاصله‌ی اضافی اول و آخر


const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
    minimumFractionDigits: 2,
})
export function formatCurrency(amount: number) {
    return CURRENCY_FORMATTER.format(amount)
}

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US')
export function formatNumber(number: number) {
    return NUMBER_FORMATTER.format(number)
}


export const round2 = (num: number) =>
    Math.round((num + Number.EPSILON) * 100) / 100

export const generateId = () =>
    Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)).join('')
