import { supabase } from '@/lib/supabaseClient'; // وارد کردن کلاینت سوپابیس
import Link from 'next/link'; // وارد کردن کامپوننت لینک برای ساختن لینک های قابل کلیک

// این تابع داده ها را از سوپابیس می خواند
async function getCountries() {
  const { data, error } = await supabase
    .from('countries') // از جدول countries
    .select('id, name, iso_code') // ستون های id, name, و iso_code را انتخاب کن
    .order('name', { ascending: true }); // و بر اساس نام مرتب کن

  if (error) {
    console.error('Error fetching countries:', error);
    return []; // در صورت خطا، یک آرایه خالی برمیگردانیم
  }

  return data;
}

// این کامپوننت اصلی صفحه است
export default async function CountriesPage() {
  // ما تابع getCountries را فراخوانی کرده و منتظر نتیجه آن می مانیم
  const countries = await getCountries();

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Explore Countries
        </h1>
        
        {/* بررسی میکنیم که آیا کشوری برای نمایش وجود دارد یا نه */}
        {countries.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {countries.map((country) => (
              // هر کشور یک لینک قابل کلیک خواهد بود
              <Link href={`/countries/${country.iso_code}`} key={country.id}>
                <div className="bg-gray-800 p-4 rounded-lg text-center h-full flex items-center justify-center hover:bg-pink-900/50 hover:border-pink-600 border border-transparent transition-all duration-200">
                  <span className="font-semibold">{country.name}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // اگر هیچ کشوری یافت نشد، این پیام نمایش داده میشود
          <p className="text-center text-gray-400">No countries found.</p>
        )}
      </div>
    </main>
  );
}