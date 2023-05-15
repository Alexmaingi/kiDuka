CREATE PROCEDURE updateOrderStatusToDispatched(@id varchar(255))
AS
BEGIN
UPDATE orders SET status='dispatched' WHERE id=@id 
END