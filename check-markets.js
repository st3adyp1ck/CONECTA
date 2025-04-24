import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://utoamblweltbcuvqaqaw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0b2FtYmx3ZWx0YmN1dnFhcWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0Njc1MjIsImV4cCI6MjA2MTA0MzUyMn0.zr3rcHm7RoHr3etMqfdhB8ebdtDXIAZA_PmjMi1lJ_Q';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMarkets() {
  console.log('Checking markets in the database...');

  try {
    // Get count of markets
    const { count, error: countError } = await supabase
      .from('markets')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting market count:', countError);
      return;
    }

    console.log(`Total markets in database: ${count || 0}`);

    // Get first 5 markets
    const { data: markets, error: marketsError } = await supabase
      .from('markets')
      .select('*')
      .limit(5);

    if (marketsError) {
      console.error('Error getting markets:', marketsError);
      return;
    }

    console.log('First 5 markets:');
    console.log(JSON.stringify(markets, null, 2));

    // Check for any issues with the market data
    if (markets && markets.length > 0) {
      console.log('\nChecking market data structure:');
      const firstMarket = markets[0];

      // Check for required fields
      const requiredFields = ['id', 'name', 'description', 'location', 'coordinates', 'image_url'];
      const missingFields = requiredFields.filter(field => !firstMarket[field]);

      if (missingFields.length > 0) {
        console.error(`Missing required fields in market data: ${missingFields.join(', ')}`);
      } else {
        console.log('All required fields are present.');
      }

      // Check coordinates format
      if (firstMarket.coordinates) {
        console.log(`Coordinates format: ${typeof firstMarket.coordinates}`);
        console.log(`Coordinates value: ${JSON.stringify(firstMarket.coordinates)}`);
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkMarkets();
