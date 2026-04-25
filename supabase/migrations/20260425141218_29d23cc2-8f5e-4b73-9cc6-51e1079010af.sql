-- Orders table for storing customer orders
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_method TEXT NOT NULL CHECK (delivery_method IN ('pickup', 'moscow', 'russia')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card_transfer')),
  delivery_address TEXT,
  items JSONB NOT NULL,
  total_amount BIGINT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone (anonymous customers) can create orders
CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- No one can read orders from the client (admin reads via service role / email)
-- Intentionally no SELECT policy to keep customer data private.
