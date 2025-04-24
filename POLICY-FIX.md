# Fixing the "Infinite Recursion" Error in Supabase Policies

If you're seeing the error "Authentication error: infinite recursion detected in policy for relation 'users'", follow these steps to fix it:

## Option 1: Using the Fix Script

1. Install the required dependencies if you haven't already:
   ```
   npm install @supabase/supabase-js
   ```

2. Run the fix script:
   ```
   node fix-users-policy.js
   ```

3. The script will attempt to fix the policies automatically.

4. Try logging in again after the script completes.

## Option 2: Using the Supabase Dashboard

If the script doesn't work, you can fix the issue manually:

1. Go to your Supabase project dashboard at https://app.supabase.com
2. Navigate to the SQL Editor
3. Copy and paste the contents of the `fix-users-policy.sql` file
4. Run the SQL commands

## What Causes This Error?

The error occurs when there's a circular reference in your Row Level Security (RLS) policies. For example:

1. A policy tries to check if a user is an admin
2. But to check if a user is an admin, it needs to query the users table
3. Which triggers the policy again, creating an infinite loop

The fix creates policies that avoid this recursion by using a more direct approach to check admin status.

## Verifying the Fix

After applying the fix:

1. Try logging in again with your admin credentials
2. If you still have issues, check the Supabase logs for any errors
3. Make sure your admin user exists in the `users` table with the role set to 'admin'

## Checking Your Admin User

You can verify your admin user exists by running this SQL in the Supabase SQL Editor:

```sql
SELECT * FROM users WHERE email = 'your-email@example.com';
```

If the user doesn't exist or doesn't have the admin role, add it with:

```sql
INSERT INTO users (id, email, role) 
VALUES ('USER_UUID_HERE', 'your-email@example.com', 'admin');
```

Replace `USER_UUID_HERE` with the actual UUID from the auth.users table.
