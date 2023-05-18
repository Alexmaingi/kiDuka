CREATE OR ALTER PROCEDURE getAllOrders
AS
BEGIN
SELECT
  u.name AS user_name,
  u.email AS email,
  o.status AS order_status,
  o.id AS order_id
FROM
  orders o
  JOIN users u ON o.user_id = u.id;
END