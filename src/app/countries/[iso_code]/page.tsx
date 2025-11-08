import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// این اینترفیس برای تعریف نوع پارامترهاست
interface CountryPageProps {
  params: {
    iso_code: string;
  };
}

async function getCountryData(isoCode: string) {
  if (!isoCode || typeof isoCode !== 'string') {
    notFound();
  }
  
  const { data: country, error } = await supabase
    .from('countries')
    .select('name, iso_code')
    .eq('iso_code', isoCode.toUpperCase())
    .single();

  if (error || !country) {
    notFound();
  }
  return country;
}

async function getRootCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .is('parent_id', null)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data;
}

// --- راه حل نهایی و قطعی ---
// ما کامپوننت را async تعریف میکنیم تا بتوانیم از await در داخل آن استفاده کنیم
export default async function CountryPage(props: CountryPageProps) {
  // اینجا نقطه کلیدی است: ما `props.params` را await میکنیم تا Promise باز شود
  // و اگر وجود نداشت، یک آبجکت خالی در نظر میگیریم
  const params = await props.params || {};
  const iso_code = params.iso_code;

  // بقیه کد دقیقا مثل قبل است
  const [country, categories] = await Promise.all([
    getCountryData(iso_code),
    getRootCategories()
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white pt-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">
          {country.name}
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          Explore the rich culture and arts of {country.name}.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <Link href={`/countries/${country.iso_code}/${category.name.toLowerCase().replace(/ /g, '-')}`} key={category.id}>
              <div className="bg-gray-800 p-6 rounded-lg h-full flex items-center justify-center hover:bg-pink-900/50 hover:border-pink-600 border border-transparent transition-all duration-200">
                <span className="text-lg font-semibold">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}