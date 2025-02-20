/*
  # Update Partner System and Create Users

  1. Changes
    - Rename reward_percentage to reward_amount in partner_levels table
    - Remove partner role
    - Update partner_levels data with fixed USD amounts
    - Create initial users with roles and addresses
    
  2. Security
    - Maintain existing RLS policies
    - Ensure proper role assignments
*/

-- Rename reward_percentage to reward_amount in partner_levels
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partner_levels' AND column_name = 'reward_percentage'
  ) THEN
    ALTER TABLE partner_levels RENAME COLUMN reward_percentage TO reward_amount;
  END IF;
END $$;

-- Update partner levels with fixed USD amounts
UPDATE partner_levels SET reward_amount = 0.25 WHERE name = 'Silver';
UPDATE partner_levels SET reward_amount = 0.50 WHERE name = 'Gold';
UPDATE partner_levels SET reward_amount = 0.75 WHERE name = 'Platinum';
UPDATE partner_levels SET reward_amount = 1.00 WHERE name = 'Diamond';

-- Remove partner role if exists
DELETE FROM roles WHERE name = 'partner';

-- Create users with auth.users
INSERT INTO auth.users (
  id,
  email,
  raw_user_meta_data,
  created_at
) VALUES
-- Admin user
(
  gen_random_uuid(),
  'emiliogonzalez777@gmail.com',
  jsonb_build_object(
    'full_name', 'Emilio González',
    'username', 'admin'
  ),
  now()
),
-- Delivery user
(
  gen_random_uuid(),
  'businesstestuser1@gmail.com',
  jsonb_build_object(
    'full_name', 'Daniel González',
    'username', 'repartidor1'
  ),
  now()
),
-- Customer user
(
  gen_random_uuid(),
  'businesstestuser2@gmail.com',
  jsonb_build_object(
    'full_name', 'Karen Alvarez',
    'username', 'kalvarez7'
  ),
  now()
),
-- Customer (former partner) user
(
  gen_random_uuid(),
  'egonzalez.business@gmail.com',
  jsonb_build_object(
    'full_name', 'Juan Perez',
    'username', 'partner1'
  ),
  now()
);

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id)
SELECT 
  u.id,
  r.id
FROM auth.users u
CROSS JOIN roles r
WHERE 
  (u.email = 'emiliogonzalez777@gmail.com' AND r.name = 'admin') OR
  (u.email = 'businesstestuser1@gmail.com' AND r.name = 'delivery') OR
  (u.email = 'businesstestuser2@gmail.com' AND r.name = 'customer') OR
  (u.email = 'egonzalez.business@gmail.com' AND r.name = 'customer');

-- Add example addresses for customers
INSERT INTO customer_addresses (
  user_id,
  condominium_id,
  unit_identifier,
  is_default
)
SELECT 
  u.id,
  c.id,
  CASE 
    WHEN c.name = 'Residencial Sierra Verde' THEN '25-5'
    WHEN c.name = 'Ciudad Marsella' THEN 'J-45'
    ELSE 'C-105'
  END,
  true
FROM auth.users u
CROSS JOIN condominiums c
WHERE u.email IN ('businesstestuser2@gmail.com', 'egonzalez.business@gmail.com')
AND c.name = 'Residencial Sierra Verde';

-- Update auth.users passwords
UPDATE auth.users SET
  encrypted_password = crypt(
    CASE 
      WHEN email = 'emiliogonzalez777@gmail.com' THEN 'Admin123$'
      WHEN email = 'businesstestuser1@gmail.com' THEN 'Repartidor123$'
      WHEN email = 'businesstestuser2@gmail.com' THEN 'Cliente123$'
      WHEN email = 'egonzalez.business@gmail.com' THEN 'Partner23$'
    END,
    gen_salt('bf')
  )
WHERE email IN (
  'emiliogonzalez777@gmail.com',
  'businesstestuser1@gmail.com',
  'businesstestuser2@gmail.com',
  'egonzalez.business@gmail.com'
);

-- Set email confirm status
UPDATE auth.users SET
  email_confirmed_at = now()
WHERE email IN (
  'emiliogonzalez777@gmail.com',
  'businesstestuser1@gmail.com',
  'businesstestuser2@gmail.com',
  'egonzalez.business@gmail.com'
);