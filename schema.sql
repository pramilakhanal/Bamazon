

CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products (
item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(45) NOT NULL,
department_name VARCHAR(45),
price INTEGER(10) NOT NULL,
stock_quantity INTEGER(10),
product_sales INTEGER(10) NOT NULL DEFAULT 0,
PRIMARY KEY (item_id)
)