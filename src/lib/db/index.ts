import mongoose from 'mongoose'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null }

export const connectToDatabase = async (
    MONGODB_URI = process.env.MONGODB_URI
) => {
    if (cached.conn) return cached.conn //اگر قبلاً وصل شده‌ایم، همونو برگردون

    if (!MONGODB_URI) throw new Error('MONGODB_URI is missing')

    cached.promise = cached.promise || mongoose.connect(MONGODB_URI) // اتصال (اگر از قبل نبود) Promise ساخت

    cached.conn = await cached.promise //صبر می‌کنیم اتصال برقرار شه

    return cached.conn
}