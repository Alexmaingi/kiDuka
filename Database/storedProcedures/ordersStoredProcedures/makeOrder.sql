
CREATE OR ALTER PROCEDURE makeOrder(@id varchar(255), @user_id varchar(255))
AS
BEGIN
INSERT INTO orders(id, user_id, status)
VALUES (@id, @user_id,'pending')
UPDATE cart SET isDeleted=1, order_id=@id where user_id = @user_id and isDeleted = 0
END
