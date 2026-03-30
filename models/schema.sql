-- 1. Create a Table for Product Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- 2. Create the Products Table
-- Includes 'eco_score' for your unique project idea
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES categories(id),
  stock_quantity INTEGER DEFAULT 10,
  eco_score INTEGER CHECK (eco_score BETWEEN 1 AND 100), -- Unique feature
  is_swap_eligible BOOLEAN DEFAULT FALSE,              -- Unique feature
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create the Swaps Table (The "Mind-Exploding" Logic)
-- Tracks when a user wants to trade Item A for Item B
CREATE TABLE swaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  offered_item_id UUID REFERENCES products(id),
  desired_item_id UUID REFERENCES products(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  shipping_status TEXT DEFAULT 'pending' CHECK (shipping_status IN ('pending', 'shipped', 'in_transit', 'delivered')),
  delivery_status TEXT DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create the Orders Table (For standard checkout)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address TEXT NOT NULL,
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Order Items (Junction table for many-to-many)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE swaps ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view products
CREATE POLICY "Allow public read access" ON products 
  FOR SELECT USING (true);

-- Policy: Only authenticated users can create orders
CREATE POLICY "Allow individual insert" ON orders 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only see their own orders
CREATE POLICY "Allow individual select" ON orders 
  FOR SELECT USING (auth.uid() = user_id);

  -- Function to decrease stock
CREATE OR REPLACE FUNCTION handle_stock_reduction() 
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity - NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger that fires after an order_item is created
CREATE TRIGGER on_order_item_created
  AFTER INSERT ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION handle_stock_reduction();