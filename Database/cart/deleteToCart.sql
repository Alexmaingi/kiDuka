CREATE OR ALTER  PROCEDURE deleteToCart(@id VARCHAR(200))
AS
BEGIN

UPDATE cart SET isDeleted=1 WHERE id=@id AND isDeleted =0

END