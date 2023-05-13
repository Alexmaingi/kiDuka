CREATE TABLE orders(
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(200) FOREIGN KEY REFERENCES product(id) NOT NULL,
    user_id VARCHAR(200) FOREIGN KEY REFERENCES users(id) NOT NULL,
    count INT DEFAULT 0,
    isCancelled INT DEFAULT 0,
    status VARCHAR(200)
)
