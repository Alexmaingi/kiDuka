CREATE OR ALTER PROCEDURE insertProductToCart (@id VARCHAR(255),  @product_id VARCHAR(200), @user_id VARCHAR(200))
AS
BEGIN

INSERT INTO cart (id, product_id, user_id)
VALUES(@id, @product_id, @user_id)

END