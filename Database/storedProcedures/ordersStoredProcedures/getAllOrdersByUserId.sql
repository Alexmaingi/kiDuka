CREATE OR ALTER PROCEDURE getAllOrdersByUserId(@user_id varchar(255))
AS
BEGIN
SELECT * FROM orders WHERE user_id =@user_id
END