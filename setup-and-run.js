// This script helps set up and run the CONECTA app
// Run with: node setup-and-run.js

const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if .env file exists
const checkEnvFile = () => {
  if (!fs.existsSync('.env')) {
    console.log('No .env file found. Creating one from .env.example...');
    
    if (fs.existsSync('.env.example')) {
      fs.copyFileSync('.env.example', '.env');
      console.log('.env file created. Please update it with your API keys.');
    } else {
      console.error('No .env.example file found. Please create a .env file manually.');
      return false;
    }
  }
  
  return true;
};

// Check if Supabase is configured
const checkSupabaseConfig = () => {
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/);
    const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
    
    if (!supabaseUrl || !supabaseKey || 
        supabaseUrl[1].includes('your-project-id') || 
        supabaseKey[1].includes('your-anon-key')) {
      console.log('Supabase not configured in .env file.');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error reading .env file:', error.message);
    return false;
  }
};

// Prompt for Supabase configuration
const promptSupabaseConfig = () => {
  return new Promise((resolve) => {
    rl.question('Enter your Supabase URL: ', (url) => {
      rl.question('Enter your Supabase anon key: ', (key) => {
        // Update .env file
        try {
          let envContent = fs.readFileSync('.env', 'utf8');
          envContent = envContent.replace(/VITE_SUPABASE_URL=.+/, `VITE_SUPABASE_URL=${url}`);
          envContent = envContent.replace(/VITE_SUPABASE_ANON_KEY=.+/, `VITE_SUPABASE_ANON_KEY=${key}`);
          
          // Extract project ID from URL
          const projectId = url.match(/https:\/\/(.+)\.supabase\.co/)[1];
          envContent = envContent.replace(/VITE_SUPABASE_PROJECT_ID=.+/, `VITE_SUPABASE_PROJECT_ID=${projectId}`);
          
          fs.writeFileSync('.env', envContent);
          console.log('Supabase configuration updated in .env file.');
          resolve(true);
        } catch (error) {
          console.error('Error updating .env file:', error.message);
          resolve(false);
        }
      });
    });
  });
};

// Run a command and return the output
const runCommand = (command, options = {}) => {
  try {
    console.log(`Running: ${command}`);
    const output = execSync(command, { 
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return output ? output.toString() : '';
  } catch (error) {
    if (options.ignoreError) {
      return '';
    }
    console.error(`Error running command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
};

// Main function
const setupAndRun = async () => {
  console.log('=== CONECTA App Setup and Run ===');
  
  // Check if npm is installed
  try {
    runCommand('npm --version', { silent: true });
  } catch (error) {
    console.error('npm is not installed. Please install Node.js and npm first.');
    process.exit(1);
  }
  
  // Check if dependencies are installed
  if (!fs.existsSync('node_modules')) {
    console.log('Installing dependencies...');
    runCommand('npm install');
  }
  
  // Check .env file
  if (!checkEnvFile()) {
    process.exit(1);
  }
  
  // Check Supabase configuration
  if (!checkSupabaseConfig()) {
    console.log('Supabase needs to be configured.');
    const configured = await promptSupabaseConfig();
    if (!configured) {
      process.exit(1);
    }
  }
  
  // Test Supabase connection
  console.log('Testing Supabase connection...');
  if (!fs.existsSync('supabase/node_modules')) {
    console.log('Installing Supabase dependencies...');
    runCommand('cd supabase && npm install');
  }
  
  runCommand('node supabase/test-connection.js');
  
  // Ask if user wants to set up the database
  rl.question('Do you want to set up the Supabase database now? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      console.log('Setting up Supabase database...');
      console.log('Please follow the instructions in supabase/README.md to set up your database.');
      console.log('You can run the SQL scripts manually in the Supabase dashboard SQL editor.');
      
      rl.question('Do you want to create an admin user now? (y/n) ', (createAdmin) => {
        if (createAdmin.toLowerCase() === 'y') {
          runCommand('cd supabase && node create-admin.js');
        }
        
        // Start the app
        rl.question('Do you want to start the app now? (y/n) ', (startApp) => {
          if (startApp.toLowerCase() === 'y') {
            console.log('Starting the app...');
            runCommand('npm run dev');
          } else {
            console.log('You can start the app later with: npm run dev');
            rl.close();
          }
        });
      });
    } else {
      // Start the app
      rl.question('Do you want to start the app now? (y/n) ', (startApp) => {
        if (startApp.toLowerCase() === 'y') {
          console.log('Starting the app...');
          runCommand('npm run dev');
        } else {
          console.log('You can start the app later with: npm run dev');
          rl.close();
        }
      });
    }
  });
};

// Run the script
setupAndRun();
