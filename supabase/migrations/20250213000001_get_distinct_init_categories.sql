-- Returns all distinct init_category_name values from bcit_products.
-- Used for the Initial Category filter dropdown (avoids 1000-row limit).
CREATE OR REPLACE FUNCTION get_distinct_init_categories()
RETURNS TABLE (init_category_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT bcit_products.init_category_name
  FROM bcit_products
  WHERE bcit_products.init_category_name IS NOT NULL
  ORDER BY bcit_products.init_category_name;
$$;
