/*
  # Add admin users

  1. Changes
    - Assign admin role to specified users
    - Create users if they don't exist
*/

-- Function to ensure user exists and has admin role
CREATE OR REPLACE FUNCTION ensure_admin_user(p_email TEXT, p_full_name TEXT)
RETURNS void AS $$
DECLARE
  v_user_id UUID;
  v_role_id UUID;
BEGIN
  -- Get or create user
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = p_email;

  IF v_user_id IS NULL THEN
    -- Create user if doesn't exist
    INSERT INTO auth.users (
      email,
      raw_user_meta_data,
      created_at,
      email_confirmed_at
    ) VALUES (
      p_email,
      jsonb_build_object(
        'full_name', p_full_name,
        'username', split_part(p_email, '@', 1)
      ),
      now(),
      now()
    )
    RETURNING id INTO v_user_id;
  END IF;

  -- Get admin role id
  SELECT id INTO v_role_id
  FROM roles
  WHERE name = 'admin';

  -- Assign admin role if not already assigned
  INSERT INTO user_roles (user_id, role_id)
  VALUES (v_user_id, v_role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Assign admin role to specified users
SELECT ensure_admin_user('emiliogonzalez777@gmail.com', 'Emilio González');
SELECT ensure_admin_user('egonzalez@cr.krugercorp.com', 'E. González');

-- Drop the function as it's no longer needed
DROP FUNCTION ensure_admin_user;