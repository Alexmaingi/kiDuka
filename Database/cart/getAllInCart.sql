CREATE OR ALTER PROCEDURE getAllInCart(@user_id VARCHAR(200))
AS
BEGIN
SELECT * FROM products WHERE id in (SELECT product_id FROM cart WHERE user_id = @user_id and isDeleted=0 and order_id is NULL)
END
