import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import Image from 'next/image'; // به Image برگشتیم
import Link from 'next/link';

interface Movie { id: number; title: string; director: string; poster_url: string; }
interface PageProps { params: { iso_code: string; category_slug: string; subcategory_slug?: string; }; }

function slugToTitle(slug: string): string { /* ... */ }
async function fetchData(params: PageProps['params']) { /* ... */ }

export default async function GenericCategoryPage(props: PageProps) {
  const params = await props.params || {};
  const { country, currentCategory, subCategories, movies, parentCategory } = await fetchData(params);

  return (
    <main className="pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {/* ... Breadcrumbs ... */}
        </div>
        {subCategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* ... Subcategory links ... */}
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
// --- توابع کمکی کامل ---
function slugToTitle(slug: string): string { return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); }
async function fetchData(params: PageProps['params']) {
    const country = (await supabase.from('countries').select('id, name').eq('iso_code', params.iso_code.toUpperCase()).single()).data;
    const currentSlug = params.subcategory_slug || params.category_slug;
    const currentCategory = (await supabase.from('categories').select('id, name').eq('name', slugToTitle(currentSlug)).single()).data;
    if (!country || !currentCategory) notFound();
    const { data: subCategories } = await supabase.from('categories').select('id, name').eq('parent_id', currentCategory.id).order('name');
    let movies: Movie[] = [];
    if (!subCategories || subCategories.length === 0) {
        const { data: movieData } = await supabase.from('movies').select('*').eq('country_id', country.id).eq('category_id', currentCategory.id);
        movies = movieData || [];
    }
    const parentCategory = params.subcategory_slug ? (await supabase.from('categories').select('id, name').eq('name', slugToTitle(params.category_slug)).single()).data : null;
    return { country, currentCategory, subCategories: subCategories || [], movies, parentCategory };
}