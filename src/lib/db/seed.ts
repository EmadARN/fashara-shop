// در پروژه‌هایی که از MongoDB استفاده می‌کنند، برای تست دیتابیس یا ریست کردن داده‌های نمونه مفید است.
// در محیط‌های توسعه (development) می‌توان هر بار دیتابیس را پاک کرد و داده‌های جدید را جایگزین کرد.
import data from '@/lib/data'
import { connectToDatabase } from '.'
import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import Product from './models/product.model'

// در Next.js، متغیرهای محیطی (.env.local) به‌صورت خودکار در زمان اجرای سرور بارگذاری می‌شوند.
// 🔹 اما در اسکریپت‌های مستقل (مانند این اسکریپت seeding) که خارج از محیط Next.js اجرا می‌شوند، این اتفاق نمی‌افتد.
// 🔹 loadEnvConfig(cwd()) این مشکل را حل می‌کند و متغیرهای .env.local را لود می‌کند.
// بارگذاری دستی متغیرهای محیطی از فایل .env.local
loadEnvConfig(cwd())

const main = async () => {
    try {
        const { products } = data
        await connectToDatabase(process.env.MONGODB_URI)

        await Product.deleteMany()
        const createdProducts = await Product.insertMany(products)

        console.log({
            createdProducts,
            message: 'Seeded database successfully',
        })
        process.exit(0) // خروج امن از فرآیند
    } catch (error) {
        console.error(error)
        throw new Error('Failed to seed database')
    }
}

main()