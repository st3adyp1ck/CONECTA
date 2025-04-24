# CONECTA Admin Setup Guide

This guide will help you set up an administrator account for the CONECTA app.

## Prerequisites

- Node.js installed
- Supabase project set up with the migrations applied
- `.env` file with Supabase credentials

## Creating an Admin User

There are two ways to create an admin user:

### Option 1: Using the Create Admin User Script

1. Install the required dependencies:
   ```
   npm install @supabase/supabase-js
   ```

2. Run the admin user creation script:
   ```
   node create-admin-user.js
   ```

3. Follow the prompts to enter:
   - Supabase URL and anon key (if not in .env file)
   - Admin email
   - Admin password

4. Check your email for a confirmation link and click it to verify your account.

5. After confirming your email, you can log in to the admin dashboard at `/login`.

### Option 2: Using the Supabase Dashboard

1. Go to your Supabase project dashboard at https://app.supabase.com
2. Navigate to Authentication > Users
3. Click "Invite user" and enter the admin email
4. The user will receive an email to set their password
5. After the user sets their password, insert a record into the `users` table with the following SQL:
   ```sql
   INSERT INTO users (id, email, role)
   VALUES ('USER_UUID_HERE', 'admin@example.com', 'admin');
   ```
   Replace `admin@example.com` with the admin email and `USER_UUID_HERE` with the UUID from the Users list.

## Accessing the Admin Dashboard

1. Go to the CONECTA app homepage
2. Click the "Login (Admin Access)" button in the top right
3. Enter your admin email and password
4. After successful login, you'll be redirected to the admin dashboard

## Troubleshooting

If you encounter issues:

1. Make sure the Supabase migrations have been applied correctly
2. Verify that your admin user has been added to the `users` table with the role 'admin'
3. Ensure your Supabase credentials in the `.env` file are correct
4. Check the browser console for any errors
5. Make sure you've confirmed your email address through the verification link

For more help, refer to the Supabase documentation or contact the CONECTA development team.
