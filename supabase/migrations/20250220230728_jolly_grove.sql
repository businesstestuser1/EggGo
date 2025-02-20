/*
  # Add foreign key constraints to user_roles table

  1. Changes
    - Add ON DELETE CASCADE constraint to user_roles.user_id
    - Add ON DELETE CASCADE constraint to user_roles.role_id
    - Add NOT NULL constraints to both columns
    - Add indexes for better query performance

  2. Security
    - Maintain existing RLS policies
*/

-- Add NOT NULL constraints
ALTER TABLE user_roles 
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN role_id SET NOT NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

-- Add RLS policy for admin users
CREATE POLICY "Admins can manage user roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

-- Add RLS policy for users to view their own roles
CREATE POLICY "Users can view their own roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());