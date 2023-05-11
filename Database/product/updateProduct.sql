
CREATE OR ALTER PROCEDURE updateProduct ( @id VARCHAR(200) , @productName VARCHAR(200), @inStock INT, @price INT,
@image VARCHAR(255), @description VARCHAR(255))
AS
BEGIN

UPDATE product SET productName=@productName,inStock=@inStock,price=@price, image=@image,description=@description
WHERE id=@id AND isDeleted=0
END