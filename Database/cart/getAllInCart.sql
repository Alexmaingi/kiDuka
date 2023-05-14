CREATE OR ALTER PROCEDURE getAllInCart(@user_id VARCHAR(200))
AS
BEGIN
SELECT * FROM cart WHERE isDeleted=0 AND user_id = @user_id

END