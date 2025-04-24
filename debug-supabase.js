import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://utoamblweltbcuvqaqaw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0b2FtYmx3ZWx0YmN1dnFhcWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0Njc1MjIsImV4cCI6MjA2MTA0MzUyMn0.zr3rcHm7RoHr3etMqfdhB8ebdtDXIAZA_PmjMi1lJ_Q';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugSupabase() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test authentication
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Authentication error:', authError);
    } else {
      console.log('Authentication successful');
    }
    
    // Test markets table
    console.log('\nTesting markets table...');
    const { data: markets, error: marketsError, count } = await supabase
      .from('markets')
      .select('*', { count: 'exact' })
      .limit(2);
    
    if (marketsError) {
      console.error('Error fetching markets:', marketsError);
    } else {
      console.log(`Found ${count} markets`);
      if (markets && markets.length > 0) {
        console.log('Sample market data:');
        console.log(JSON.stringify(markets[0], null, 2));
      }
    }
    
    // Test vendors table
    console.log('\nTesting vendors table...');
    const { data: vendors, error: vendorsError, count: vendorCount } = await supabase
      .from('vendors')
      .select('*', { count: 'exact' })
      .limit(2);
    
    if (vendorsError) {
      console.error('Error fetching vendors:', vendorsError);
    } else {
      console.log(`Found ${vendorCount} vendors`);
      if (vendors && vendors.length > 0) {
        console.log('Sample vendor data:');
        console.log(JSON.stringify(vendors[0], null, 2));
      }
    }
    
    // Test featured vendors
    console.log('\nTesting featured vendors...');
    const { data: featuredVendors, error: featuredError } = await supabase
      .from('vendors')
      .select('*')
      .eq('featured', true)
      .limit(2);
    
    if (featuredError) {
      console.error('Error fetching featured vendors:', featuredError);
    } else {
      console.log(`Found ${featuredVendors?.length || 0} featured vendors`);
      if (featuredVendors && featuredVendors.length > 0) {
        console.log('Sample featured vendor:');
        console.log(JSON.stringify(featuredVendors[0], null, 2));
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

debugSupabase();
