


CREATE TABLE product(
     id VARCHAR(200) PRIMARY KEY,
    productName VARCHAR(200),
    inStock INT ,
    isDeleted INT DEFAULT 0,
    description VARCHAR(255),
    price INT,
    image VARCHAR(255)
)
