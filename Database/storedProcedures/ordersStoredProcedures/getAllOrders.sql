CREATE OR ALTER PROCEDURE getAllOrders
AS
BEGIN
SELECT
  c.order_id AS order_id,
  p.productName AS product_name,
  o.status AS status,
  o.isCancelled AS isCancelled,
  u.name AS user_name,
  u.email AS email
FROM
  cart c
  JOIN orders o ON c.order_id = o.id
  JOIN products p ON c.product_id = p.id
  JOIN users u ON c.user_id = u.id
END