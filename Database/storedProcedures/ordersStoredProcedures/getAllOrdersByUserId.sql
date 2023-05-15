CREATE OR ALTER PROCEDURE getAllOrdersByUserId(@id varchar(255),@user_id varchar(255))
AS
BEGIN
SELECT * FROM products p  where id in (SELECT product_id FROM cart c where p.id = c.product_id and 
isDeleted =1 and order_id= @id
 and user_id =(SELECT user_id FROM orders WHERE id =@id and isCancelled= 0 )
 
)
END