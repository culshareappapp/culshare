import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// --- تعریف انواع داده برای امنیت و خوانایی کد (فقط یک بار) ---
interface Movie { id: number; title: string; director: string; poster_url: string; }
interface Category { id: number; name: string; }
interface PageProps { params: { iso_code: string; category_slug: string; subcategory_slug?: string; }; }

// --- تابع کمکی (فقط یک بار) ---
function slugToTitle(slug: string): string {
  if (!slug) return '';
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// --- تابع اصلی واکشی داده (فقط یک بار) ---
async function fetchData(params: PageProps['params']) {
  const countryResult = await supabase.from('countries').select('id, name').eq('iso_code', params.iso_code.toUpperCase()).single();
  const country = countryResult.data;

  const currentSlug = params.subcategory_slug || params.category_slug;
  const currentCategoryResult = await supabase.from('categories').select('id, name').eq('name', slugToTitle(currentSlug)).single();
  const currentCategory = currentCategoryResult.data;

  if (!country || !currentCategory) {
    notFound();
  }

  const { data: subCategories } = await supabase.from('categories').select('id, name').eq('parent_id', currentCategory.id).order('name');
  
  let movies: Movie[] = [];
  if (!subCategories || subCategories.length === 0) {
    const { data: movieData } = await supabase.from('movies').select('*').eq('country_id', country.id).eq('category_id', currentCategory.id);
    movies = movieData || [];
  }

  let parentCategory: Category | null = null;
  if (params.subcategory_slug) {
    const parentCategoryResult = await supabase.from('categories').select('id, name').eq('name', slugToTitle(params.category_slug)).single();
    parentCategory = parentCategoryResult.data;
  }
  
  return { country, currentCategory, subCategories: subCategories || [], movies, parentCategory };
}

// --- کامپوننت اصلی صفحه (فقط یک بار) ---
export default async function GenericCategoryPage(props: PageProps) {
  const params = await props.params || {};
  const { country, currentCategory, subCategories, movies, parentCategory } = await fetchData(params);

  return (
    <main className="pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-md text-pink-400 mb-2">
            <Link href={`/countries/${params.iso_code}`} className="hover:underline">{country.name}</Link>
            {parentCategory && (
              <>
                {' > '}
                <Link href={`/countries/${params.iso_code}/${parentCategory.name.toLowerCase().replace(/ /g, '-')}`} className="hover:underline">{parentCategory.name}</Link>
              </>
            )}
          </p>
          <h1 className="text-5xl font-bold">{currentCategory.name}</h1>
        </div>
        
        {subCategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {subCategories.map((subCat: Category) => ( // Type added here
              <Link href={`/countries/${params.iso_code}/${params.category_slug}/${subCat.name.toLowerCase().replace(/ /g, '-')}`} key={subCat.id}>
                <div className="bg-slate-800 p-6 rounded-lg h-full flex items-center justify-center hover:bg-pink-900/50 hover:border-pink-600 border border-transparent transition-all duration-200">
                  <span className="text-lg font-semibold">{subCat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie: Movie) => (
              <div key={movie.id} className="text-left">
                 <div className="bg-slate-800 rounded-lg overflow-hidden aspect-[2/3] relative">
                    {movie.poster_url && <Image src={movie.poster_url} alt={`Poster for ${movie.title}`} fill sizes="(max-width: 640px) 50vw, 20vw" className="object-cover" />}
                 </div>
                 <h3 className="mt-2 font-semibold text-white">{movie.title}</h3>
                 <p className="text-sm text-gray-400">{movie.director}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-800 rounded-lg">
              <p className="text-gray-400">No items found for this category yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}