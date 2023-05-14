CREATE PROCEDURE deleteOrder(@id varchar(255), @user_id varchar(255))
AS
BEGIN
UPDATE orders SET isCancelled= 1 WHERE id=@id and user_id=@user_id
END