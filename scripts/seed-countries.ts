import { createClient } from '@supabase/supabase-js';

async function seedCountries() {
  console.log('Starting geo-architectural seeding script...');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) throw new Error('Supabase URL or Service Key is missing.');
  const supabaseAdmin = createClient(supabaseUrl, serviceKey);

  try {
    await supabaseAdmin.from('countries').delete().neq('id', 0);
    await supabaseAdmin.from('regions').delete().neq('id', 0);
    await supabaseAdmin.from('continents').delete().neq('id', 0);

    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,region,subregion,continents');
    if (!response.ok) throw new Error('Failed to fetch from API');
    const countriesData: any[] = await response.json();

    const continents = [...new Set(countriesData.map(c => c.continents[0]).filter(Boolean))];
    const { data: insertedContinents, error: continentsError } = await supabaseAdmin.from('continents').insert(continents.map(name => ({ name }))).select();
    if (continentsError || !insertedContinents) throw new Error('Failed to insert continents'); // <-- اصلاح اول
    console.log(`Inserted ${insertedContinents.length} continents.`);

    const regions = [...new Set(countriesData.map(c => c.subregion).filter(Boolean))];
    const regionsToInsert = [];
    for (const regionName of regions) {
      const countryInRegion = countriesData.find(c => c.subregion === regionName);
      const continentName = countryInRegion?.continents[0];
      const continent = insertedContinents.find(c => c.name === continentName);
      if (continent) {
        regionsToInsert.push({ name: regionName, continent_id: continent.id });
      }
    }
    const { data: insertedRegions, error: regionsError } = await supabaseAdmin.from('regions').insert(regionsToInsert).select();
    if (regionsError || !insertedRegions) throw new Error('Failed to insert regions'); // <-- اصلاح دوم
    console.log(`Inserted ${insertedRegions.length} regions.`);

    const countriesToInsert = countriesData.map(country => {
        const region = insertedRegions.find(r => r.name === country.subregion);
        if (region) return { name: country.name.common, iso_code: country.cca2, region_id: region.id };
        return null;
      }).filter(Boolean);

    await supabaseAdmin.from('countries').insert(countriesToInsert as any[]); // as any[] برای سادگی
    console.log(`Inserted ${countriesToInsert.length} countries.`);
    
    console.log('\n✅ Success! The new geo-architecture has been seeded.');

  } catch (error) {
    console.error('❌ An error occurred:', error);
  }
}

seedCountries();