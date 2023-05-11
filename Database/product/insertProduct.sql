

CREATE PROCEDURE insertProduct ( @id VARCHAR(200) , @productName VARCHAR(200), @isDeleted INT, @inStock INT, @price INT,
@image VARCHAR(255), @description VARCHAR(255))
AS
BEGIN

INSERT INTO product(id,productName,isDeleted,inStock, price, image, description)
VALUES(@id,@productName,@isDeleted,@inStock,@price, @image,@description)

END