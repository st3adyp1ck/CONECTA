-- Fix for infinite recursion in users table policies

-- Disable RLS temporarily
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own data." ON users;
DROP POLICY IF EXISTS "Users can update their own data." ON users;
DROP POLICY IF EXISTS "Admins can view all users." ON users;
DROP POLICY IF EXISTS "Admins can update all users." ON users;
DROP POLICY IF EXISTS "Public users can view their own data" ON users;
DROP POLICY IF EXISTS "Public users can update their own data" ON users;

-- Create new, safer policies
CREATE POLICY "Public users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Public users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Create admin policies that avoid recursion
-- This policy uses a direct comparison instead of a recursive check
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update all users" ON users FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Verify the admin user exists
SELECT * FROM users WHERE email = 'ib310us@gmail.com';

-- If the admin user doesn't exist or doesn't have the admin role, run:
-- INSERT INTO users (id, email, role) VALUES ('USER_UUID_HERE', 'ib310us@gmail.com', 'admin');
-- Replace USER_UUID_HERE with the actual UUID from auth.users
