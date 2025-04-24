import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://utoamblweltbcuvqaqaw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0b2FtYmx3ZWx0YmN1dnFhcWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0Njc1MjIsImV4cCI6MjA2MTA0MzUyMn0.zr3rcHm7RoHr3etMqfdhB8ebdtDXIAZA_PmjMi1lJ_Q';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Create a test user
async function createTestUser() {
  try {
    // Test user details
    const email = 'test@conecta.com';
    const password = 'testpassword';
    const name = 'Test User';

    console.log(`Creating test user with email: ${email}...`);

    // Create user in Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new Error(`Error creating auth user: ${authError.message}`);
    }

    console.log('Auth user created successfully!');
    console.log(`User ID: ${authData.user.id}`);

    // Set up user in users table
    const { error: dbError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email: email,
          name: name,
          role: 'user'
        }
      ]);

    if (dbError) {
      throw new Error(`Error creating user record: ${dbError.message}`);
    }

    console.log('User record created successfully!');
    console.log('Test user details:');
    console.log(`- Email: ${email}`);
    console.log(`- Password: ${password}`);
    console.log(`- Name: ${name}`);
    console.log(`- Role: user`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the script
createTestUser();
