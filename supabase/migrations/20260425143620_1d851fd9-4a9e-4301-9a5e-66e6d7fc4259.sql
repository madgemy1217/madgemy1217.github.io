-- Drop existing policy and recreate with explicit grants
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Allow public (anon and authenticated) to insert orders
CREATE POLICY "Public can create orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Ensure proper grants on the table
GRANT INSERT ON public.orders TO anon, authenticated;