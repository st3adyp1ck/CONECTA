// This script helps create an admin user in Supabase
// Run with: node create-admin-user.js

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Try to load environment variables from .env file
try {
  const envPath = path.resolve(__dirname, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');

  // Simple parsing of .env file
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });

  console.log('Loaded environment variables from .env file');
} catch (error) {
  console.log('Could not load .env file, using existing environment variables');
}

// Get Supabase credentials from environment or prompt user
const promptForCredentials = () => {
  return new Promise((resolve) => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      console.log('Using Supabase credentials from environment variables');
      resolve({ supabaseUrl, supabaseKey });
      return;
    }

    rl.question('Enter your Supabase URL: ', (url) => {
      rl.question('Enter your Supabase anon key: ', (key) => {
        resolve({ supabaseUrl: url, supabaseKey: key });
      });
    });
  });
};

// Prompt for admin user details
const promptForAdminDetails = () => {
  return new Promise((resolve) => {
    rl.question('Enter admin email: ', (email) => {
      rl.question('Enter admin password (min 6 characters): ', (password) => {
        resolve({ email, password });
      });
    });
  });
};

// Main function
const createAdmin = async () => {
  try {
    // Get credentials
    const { supabaseUrl, supabaseKey } = await promptForCredentials();

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get admin details
    const { email, password, name } = await promptForAdminDetails();

    // Create user in Auth
    console.log(`Creating user with email: ${email}...`);
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new Error(`Error creating auth user: ${authError.message}`);
    }

    console.log('Auth user created successfully!');
    console.log(`User ID: ${authData.user.id}`);

    // Set up admin in users table
    console.log('Setting up admin user in database...');
    const { error: dbError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email: email,
          role: 'admin'
        }
      ]);

    if (dbError) {
      console.log('Error inserting into users table:', dbError.message);
      console.log('Trying RPC method if available...');

      // Try using the RPC method if available
      try {
        const { error: rpcError } = await supabase.rpc('setup_admin_user', {
          admin_id: authData.user.id,
          admin_email: email
        });

        if (rpcError) {
          throw new Error(`Error setting up admin user: ${rpcError.message}`);
        }
      } catch (rpcErr) {
        console.error('Failed to use RPC method. Please manually add the user to the users table with role "admin".');
        console.error('SQL: INSERT INTO users (id, email, role) VALUES (\'' + authData.user.id + '\', \'' + email + '\', \'admin\');');
      }
    }

    console.log('Admin user created successfully!');
    console.log(`
Admin user details:
- Email: ${email}
- User ID: ${authData.user.id}
- Role: admin
    `);

    // Check email for confirmation
    console.log('Please check your email to confirm your account.');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
};

// Run the script
createAdmin();
