
CREATE OR ALTER PROCEDURE getProducts
AS
BEGIN
SELECT * FROM product WHERE isDeleted=0

END