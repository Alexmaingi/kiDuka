
CREATE OR ALTER PROCEDURE insertUser(@id VARCHAR(200) , @name VARCHAR(200), 
@email VARCHAR(200) ,@password VARCHAR(200), @phoneNumber  VARCHAR(200)
)

AS
BEGIN 


INSERT INTO users(id,name,email,password, phoneNumber)
VALUES( @id, @name,@email, @password, @phoneNumber)

END