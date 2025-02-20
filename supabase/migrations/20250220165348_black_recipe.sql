/*
  # Initial Schema for EggGo Application

  1. New Tables
    - users: Core user table with authentication and profile data
    - roles: User role definitions
    - user_roles: Many-to-many relationship between users and roles
    - condominiums: Residential complexes information
    - condominium_types: Types of condominiums (vertical/horizontal)
    - distribution_types: Types of distributions within condominiums
    - customer_addresses: Customer addresses linked to condominiums
    - partner_levels: Partner program levels
    - partner_rewards: Partner reward tracking
    - egg_sizes: Available egg sizes
    - orders: Customer orders
    - order_statuses: Order status definitions
    - payment_methods: Available payment methods
    - delivery_windows: Configurable delivery time windows
    - inventory: Egg inventory tracking
    
  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    - Secure user data access
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Role definitions
CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User roles junction table
CREATE TABLE user_roles (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Condominium types
CREATE TABLE condominium_types (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Distribution types
CREATE TABLE distribution_types (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Condominiums
CREATE TABLE condominiums (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type_id uuid REFERENCES condominium_types(id),
  has_lobby boolean DEFAULT false,
  distribution_type_id uuid REFERENCES distribution_types(id),
  location_lat decimal(10,8),
  location_lng decimal(11,8),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customer addresses
CREATE TABLE customer_addresses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  condominium_id uuid REFERENCES condominiums(id),
  unit_identifier text NOT NULL, -- e.g., "C-105", "25-5", "J-45"
  additional_details text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Partner levels
CREATE TABLE partner_levels (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  min_referrals integer NOT NULL DEFAULT 0,
  reward_percentage decimal(5,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Partner rewards
CREATE TABLE partner_rewards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id uuid REFERENCES auth.users(id),
  referral_id uuid REFERENCES auth.users(id),
  amount decimal(10,2) NOT NULL,
  payment_method text DEFAULT 'Saldo Promocional',
  status text DEFAULT 'pending',
  reward_month date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Egg sizes
CREATE TABLE egg_sizes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order statuses
CREATE TABLE order_statuses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Payment methods
CREATE TABLE payment_methods (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Delivery windows
CREATE TABLE delivery_windows (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  condominium_id uuid REFERENCES condominiums(id),
  day_of_week integer NOT NULL, -- 0 = Sunday, 1 = Monday, etc.
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid REFERENCES auth.users(id),
  address_id uuid REFERENCES customer_addresses(id),
  status_id uuid REFERENCES order_statuses(id),
  delivery_window_id uuid REFERENCES delivery_windows(id),
  payment_method_id uuid REFERENCES payment_methods(id),
  total_amount decimal(10,2) NOT NULL,
  delivery_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id),
  egg_size_id uuid REFERENCES egg_sizes(id),
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Inventory
CREATE TABLE inventory (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  egg_size_id uuid REFERENCES egg_sizes(id),
  quantity integer NOT NULL DEFAULT 0,
  date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chat messages
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id),
  sender_id uuid REFERENCES auth.users(id),
  receiver_id uuid REFERENCES auth.users(id),
  message text NOT NULL,
  status text DEFAULT 'sent',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE condominium_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE condominiums ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Insert initial data
INSERT INTO roles (name, description) VALUES
  ('admin', 'System administrator with full access'),
  ('delivery', 'Delivery personnel'),
  ('customer', 'Regular customer'),
  ('partner', 'Partner with referral capabilities');

INSERT INTO condominium_types (name) VALUES
  ('vertical'),
  ('horizontal');

INSERT INTO distribution_types (name) VALUES
  ('cluster'),
  ('quartier'),
  ('floor'),
  ('tower_floor');

-- Insert partner levels
INSERT INTO partner_levels (name, min_referrals, reward_percentage) VALUES
  ('Silver', 0, 5.00),
  ('Gold', 5, 7.50),
  ('Platinum', 10, 10.00),
  ('Diamond', 20, 15.00);

-- Insert egg sizes
INSERT INTO egg_sizes (name, price) VALUES
  ('Mediano', 3.50),
  ('Grande', 4.00),
  ('Extra Grande', 4.50),
  ('Jumbo', 5.00),
  ('Super Jumbo', 5.50);

-- Insert order statuses
INSERT INTO order_statuses (name) VALUES
  ('pending'),
  ('confirmed'),
  ('in_delivery'),
  ('delivered'),
  ('failed_delivery');

-- Insert payment methods
INSERT INTO payment_methods (name) VALUES
  ('cash'),
  ('bank_transfer'),
  ('n1co'),
  ('bitcoin'),
  ('chivo_wallet'),
  ('credit_card');

-- Insert example condominiums
INSERT INTO condominiums (name, type_id, has_lobby, distribution_type_id) VALUES
  (
    'Residencial Sierra Verde',
    (SELECT id FROM condominium_types WHERE name = 'horizontal'),
    false,
    (SELECT id FROM distribution_types WHERE name = 'cluster')
  ),
  (
    'Ciudad Marsella',
    (SELECT id FROM condominium_types WHERE name = 'horizontal'),
    false,
    (SELECT id FROM distribution_types WHERE name = 'quartier')
  ),
  (
    'Avitat Joy',
    (SELECT id FROM condominium_types WHERE name = 'vertical'),
    true,
    (SELECT id FROM distribution_types WHERE name = 'tower_floor')
  );

-- Create policies
CREATE POLICY "Enable read access for all users" ON roles
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON condominium_types
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON distribution_types
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON condominiums
  FOR SELECT USING (true);

CREATE POLICY "Customers can manage their own addresses" ON customer_addresses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Enable read access for all users" ON partner_levels
  FOR SELECT USING (true);

CREATE POLICY "Partners can view their own rewards" ON partner_rewards
  FOR SELECT USING (auth.uid() = partner_id);

CREATE POLICY "Enable read access for all users" ON egg_sizes
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON order_statuses
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON payment_methods
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON delivery_windows
  FOR SELECT USING (true);

CREATE POLICY "Customers can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Customers can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = auth.uid()
    )
  );

CREATE POLICY "Enable read access for admins" ON inventory
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role_id = (SELECT id FROM roles WHERE name = 'admin')
    )
  );

CREATE POLICY "Users can view their own chat messages" ON chat_messages
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );