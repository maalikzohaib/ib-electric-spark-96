-- Delete test products that were added during development
DELETE FROM products WHERE name IN ('hk', 'IB Electric Store');