import { createClient } from '@supabase/supabase-js';

// --- داده های نمونه با آدرس های پوستر جدید و معتبر ---
const moviesData = [
  {
    country_iso: 'FR',
    category_name: 'Fiction Film',
    movies: [
      { title: 'La Haine', release_year: 1995, director: 'Mathieu Kassovitz', tmdb_id: 406, poster_url: 'https://image.tmdb.org/t/p/w500/1yv9fR9sOnjIA8iIA9IraH661T.jpg' },
      { title: 'Amélie', release_year: 2001, director: 'Jean-Pierre Jeunet', tmdb_id: 194, poster_url: 'https://image.tmdb.org/t/p/w500/lcW2n2ap7q9Z3e38lZmIOHnK8i2.jpg' },
    ]
  },
  {
    country_iso: 'JP',
    category_name: 'Fiction Film',
    movies: [
      { title: 'Seven Samurai', release_year: 1954, director: 'Akira Kurosawa', tmdb_id: 346, poster_url: 'https://image.tmdb.org/t/p/w500/8O8pAL8SAQmlJTwMdsiHwVI942d.jpg' },
    ]
  },
  {
    country_iso: 'JP',
    category_name: 'Animation',
    movies: [
        { title: 'Spirited Away', release_year: 2001, director: 'Hayao Miyazaki', tmdb_id: 129, poster_url: 'https://image.tmdb.org/t/p/w500/39wmItIW2asRMyffAroBPnOUG2S.jpg' },
    ]
  }
];

// بقیه اسکریپت بدون تغییر باقی میماند
async function seedMovies() {
  console.log('Starting movie seeding script with updated URLs...');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) throw new Error('Supabase URL or Service Key is missing.');
  const supabaseAdmin = createClient(supabaseUrl, serviceKey);

  try {
    await supabaseAdmin.from('movies').delete().neq('id', 0);
    const { data: countries } = await supabaseAdmin.from('countries').select('id, iso_code');
    const { data: categories } = await supabaseAdmin.from('categories').select('id, name');
    if (!countries || !categories) throw new Error('Could not fetch countries or categories.');

    const moviesToInsert = [];
    for (const data of moviesData) {
      const country = countries.find(c => c.iso_code === data.country_iso);
      const category = categories.find(c => c.name === data.category_name);
      if (country && category) {
        for (const movie of data.movies) {
          moviesToInsert.push({ ...movie, country_id: country.id, category_id: category.id });
        }
      }
    }
    
    console.log(`Inserting ${moviesToInsert.length} movies...`);
    const { error } = await supabaseAdmin.from('movies').insert(moviesToInsert);
    if (error) throw error;
    console.log('✅ Success! Movies have been seeded with valid URLs.');
  } catch (error) {
    console.error('❌ An error occurred:', error);
  }
}

seedMovies();