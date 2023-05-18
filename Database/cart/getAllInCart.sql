CREATE OR ALTER PROCEDURE getAllInCart(@user_id VARCHAR(200))
AS
BEGIN
SELECT p.productName, p.id, p.description, p.price, p.image, c.count
FROM cart c
JOIN products p ON c.product_id = p.id
WHERE c.user_id = @user_id AND c.isDeleted = 0 AND c.order_id IS NULL AND p.isDeleted = 0;

END
