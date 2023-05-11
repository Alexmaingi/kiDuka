
CREATE OR ALTER PROCEDURE updateUSer(@id VARCHAR(200) , @name VARCHAR(200), 
@email VARCHAR(200), @phoneNUmber INT, @password VARCHAR(100)
)
AS
BEGIN 
 
 UPDATE users SET name=@name , email=@email , phoneNumber=@phoneNUmber , password=@password
 WHERE id=@id AND isDeleted=0

END