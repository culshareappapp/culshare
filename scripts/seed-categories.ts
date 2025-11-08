import { createClient, SupabaseClient } from '@supabase/supabase-js';

// تعریف "نوع" داده‌های ما برای تایپ‌اسکریپت
interface CategoryNode {
  name: string;
  children: CategoryNode[];
}

const culturalArchitecture: CategoryNode[] = [
  // ... (محتوای این آرایه بدون تغییر باقی میماند)
  {
    name: 'Performing Arts',
    children: [
      { name: 'Cinema', children: [{ name: 'Fiction Film', children: [] }, { name: 'Documentary', children: [] }, { name: 'Animation', children: [] }] },
      { name: 'Theatre', children: [{ name: 'Play', children: [] }, { name: 'Opera', children: [] }, { name: 'Dance', children: [] }] },
      { name: 'Music', children: [] },
    ],
  },
  {
    name: 'Visual Arts',
    children: [
      { name: 'Artworks', children: [{ name: 'Painting', children: [] }, { name: 'Sculpture', children: [] }, { name: 'Photography', children: [] }] },
      { name: 'Exhibition Spaces', children: [{ name: 'Museums', children: [] }, { name: 'Galleries', children: [] }] },
    ],
  },
  {
    name: 'Literary Arts',
    children: [
      { name: 'Literature', children: [{ name: 'Novel', children: [] }, { name: 'Poetry', children: [] }, { name: 'Essay', children: [] }] },
    ],
  },
  {
    name: 'Cultural Heritage',
    children: [
      { name: 'Historic Sites', children: [{ name: 'Archaeological Sites', children: [] }, { name: 'Monuments', children: [] }] },
      { name: 'Architecture', children: [{ name: 'Buildings', children: [] }, { name: 'Urban Spaces', children: [] }] },
      { name: 'Traditions & Events', children: [{ name: 'Festivals', children: [] }, { name: 'Cuisine', children: [] }] },
    ],
  },
  {
    name: 'Natural Heritage',
    children: [
      { name: 'Landscapes', children: [{ name: 'National Parks', children: [] }, { name: 'Geographic Features', children: [] }] },
    ],
  },
];

// --- تابع اصلاح شده با تعریف نوع ---
async function insertCategory(category: CategoryNode, parent_id: number | null, client: SupabaseClient) {
  const { data, error } = await client
    .from('categories')
    .insert({ name: category.name, parent_id: parent_id })
    .select()
    .single();

  if (error) throw new Error(`Failed to insert ${category.name}: ${error.message}`);
  
  console.log(`- Inserted '${data.name}' with id ${data.id}`);

  if (category.children && category.children.length > 0) {
    for (const child of category.children) {
      await insertCategory(child, data.id, client);
    }
  }
}

async function seedCategories() {
  console.log('Starting hierarchical category seeding script...');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) throw new Error('Supabase URL or Service Key is missing.');
  
  const supabaseAdmin = createClient(supabaseUrl, serviceKey);

  try {
    console.log('Deleting all existing categories...');
    await supabaseAdmin.from('categories').delete().neq('id', 0);
    console.log('Inserting new architectural structure...');
    for (const category of culturalArchitecture) {
      await insertCategory(category, null, supabaseAdmin);
    }
    console.log('\n✅ Success! The new cultural architecture has been seeded.');
  } catch (error) {
    console.error('❌ An error occurred:', error);
  }
}

seedCategories();