

CREATE PROCEDURE updateProduct ( @id VARCHAR(200) , @productName VARCHAR(200), @inStock INT, @price INT,
@image VARCHAR(255), @description VARCHAR(255))
AS
BEGIN

INSERT INTO product(id,productName,inStock, price, image, description)
VALUES(@id,@productName,@inStock,@price, @image,@description)

END