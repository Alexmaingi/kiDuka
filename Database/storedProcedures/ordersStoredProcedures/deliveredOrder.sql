CREATE PROCEDURE updateOrderStatusToDelivered(@id varchar(255))
AS
BEGIN
UPDATE orders SET status='delivered' WHERE id=@id 
END