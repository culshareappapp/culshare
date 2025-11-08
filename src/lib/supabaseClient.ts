import { createClient } from '@supabase/supabase-js';

// خواندن متغیرهای محیطی که در فایل .env.local تعریف کردیم
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ایجاد و خروجی گرفتن یک نمونه از کلاینت Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);