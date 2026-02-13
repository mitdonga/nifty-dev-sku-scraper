-- Run this via web-dev-nifty-supabase MCP or Supabase Dashboard SQL editor.
-- Enables RLS and allows public (anon) read on bcit_products and category_sheet_data.
-- Table names match n8n workflow (bcit_products, category_sheet_data).

-- bcit_products: allow anyone to read
ALTER TABLE bcit_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON bcit_products FOR SELECT TO anon USING (true);

-- category_sheet_data: allow anyone to read
ALTER TABLE category_sheet_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON category_sheet_data FOR SELECT TO anon USING (true);
