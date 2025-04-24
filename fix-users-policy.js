// This script fixes the infinite recursion in users table policies
// Run with: node fix-users-policy.js

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

// Main function
const fixUsersPolicies = async () => {
  try {
    // Get credentials
    const { supabaseUrl, supabaseKey } = await promptForCredentials();
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('Connecting to Supabase...');
    
    // First, let's check if we can access the database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('count(*)')
      .limit(1)
      .single();
    
    if (userError) {
      console.log('Error accessing users table:', userError.message);
      console.log('This might be due to the policy issue we are trying to fix.');
    } else {
      console.log('Successfully connected to users table.');
    }
    
    // Execute SQL to fix the policies
    console.log('Attempting to fix users table policies...');
    
    // 1. First, disable RLS temporarily to allow us to fix it
    const { error: disableRlsError } = await supabase.rpc('disable_rls_for_users');
    
    if (disableRlsError) {
      console.log('Error disabling RLS:', disableRlsError.message);
      console.log('Trying alternative approach...');
      
      // Try direct SQL approach
      const sqlCommands = [
        // Drop all existing policies on users table
        "DROP POLICY IF EXISTS \"Users can view their own data.\" ON users;",
        "DROP POLICY IF EXISTS \"Users can update their own data.\" ON users;",
        "DROP POLICY IF EXISTS \"Admins can view all users.\" ON users;",
        "DROP POLICY IF EXISTS \"Admins can update all users.\" ON users;",
        
        // Disable RLS temporarily
        "ALTER TABLE users DISABLE ROW LEVEL SECURITY;",
        
        // Create new, safer policies
        "CREATE POLICY \"Public users can view their own data\" ON users FOR SELECT USING (auth.uid() = id);",
        "CREATE POLICY \"Public users can update their own data\" ON users FOR UPDATE USING (auth.uid() = id);",
        "CREATE POLICY \"Admins can view all users\" ON users FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));",
        "CREATE POLICY \"Admins can update all users\" ON users FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));",
        
        // Re-enable RLS
        "ALTER TABLE users ENABLE ROW LEVEL SECURITY;"
      ];
      
      // Execute each SQL command
      for (const sql of sqlCommands) {
        console.log(`Executing: ${sql}`);
        const { error } = await supabase.rpc('execute_sql', { sql_command: sql });
        
        if (error) {
          console.log(`Error executing SQL: ${error.message}`);
          console.log('Continuing with next command...');
        } else {
          console.log('Command executed successfully');
        }
      }
    } else {
      console.log('Successfully disabled RLS for users table');
      
      // 2. Create new, safer policies
      const { error: createPoliciesError } = await supabase.rpc('create_safe_users_policies');
      
      if (createPoliciesError) {
        console.log('Error creating new policies:', createPoliciesError.message);
      } else {
        console.log('Successfully created new policies');
      }
      
      // 3. Re-enable RLS
      const { error: enableRlsError } = await supabase.rpc('enable_rls_for_users');
      
      if (enableRlsError) {
        console.log('Error re-enabling RLS:', enableRlsError.message);
      } else {
        console.log('Successfully re-enabled RLS for users table');
      }
    }
    
    console.log('\nPolicy fix attempt completed.');
    console.log('Please try logging in again. If you still encounter issues, you may need to:');
    console.log('1. Log into the Supabase dashboard');
    console.log('2. Go to the SQL Editor');
    console.log('3. Run the following SQL commands:');
    console.log(`
-- Disable RLS temporarily
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own data." ON users;
DROP POLICY IF EXISTS "Users can update their own data." ON users;
DROP POLICY IF EXISTS "Admins can view all users." ON users;
DROP POLICY IF EXISTS "Admins can update all users." ON users;

-- Create new, safer policies
CREATE POLICY "Public users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Public users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update all users" ON users FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    `);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
};

// Run the script
fixUsersPolicies();
