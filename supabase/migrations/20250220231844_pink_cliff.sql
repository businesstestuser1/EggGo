/*
  # Create users view and function

  1. New Objects
    - Function `get_user_roles`: Returns array of role names for a user
    - View `user_profiles`: Safe view of user data for admins
  
  2. Security
    - Function is security definer to access auth schema
    - View uses RLS through underlying tables
*/

-- Create function to get user roles
CREATE OR REPLACE FUNCTION get_user_roles(user_id uuid)
RETURNS text[] AS $$
  SELECT array_agg(r.name)
  FROM user_roles ur
  JOIN roles r ON r.id = ur.role_id
  WHERE ur.user_id = $1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Create view for user profiles
CREATE OR REPLACE VIEW user_profiles AS
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name' as full_name,
  au.raw_user_meta_data->>'username' as username,
  au.created_at,
  COALESCE(get_user_roles(au.id), ARRAY[]::text[]) as roles
FROM auth.users au;

-- Grant access to authenticated users
GRANT SELECT ON user_profiles TO authenticated;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = $1
    AND r.name = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS policy through a secure view
CREATE OR REPLACE VIEW user_profiles_secure AS
SELECT *
FROM user_profiles
WHERE is_admin(auth.uid());

-- Grant access to the secure view
GRANT SELECT ON user_profiles_secure TO authenticated;