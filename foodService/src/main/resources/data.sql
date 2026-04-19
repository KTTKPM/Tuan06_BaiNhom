INSERT INTO foods (name, category, price, available, created_at)
SELECT seed.name, seed.category, seed.price, seed.available, seed.created_at
FROM (
  SELECT 'Pho Bo' AS name, 'Vietnamese' AS category, 55000.00 AS price, 1 AS available, NOW() AS created_at
  UNION ALL SELECT 'Com Tam Suon', 'Vietnamese', 62000.00, 1, NOW()
  UNION ALL SELECT 'Banh Mi Thit', 'Vietnamese', 28000.00, 1, NOW()
  UNION ALL SELECT 'Bun Bo Hue', 'Vietnamese', 60000.00, 0, NOW()
  UNION ALL SELECT 'Pizza Margherita', 'Italian', 149000.00, 1, NOW()
  UNION ALL SELECT 'Spaghetti Carbonara', 'Italian', 139000.00, 1, NOW()
  UNION ALL SELECT 'Sushi Set', 'Japanese', 199000.00, 1, NOW()
  UNION ALL SELECT 'Ramen Tonkotsu', 'Japanese', 129000.00, 0, NOW()
  UNION ALL SELECT 'Burger Beef', 'Fast Food', 89000.00, 1, NOW()
  UNION ALL SELECT 'Caesar Salad', 'Healthy', 99000.00, 1, NOW()
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM foods LIMIT 1);
