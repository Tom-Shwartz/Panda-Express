
/* Initial Table setup */
CREATE TABLE Order_History(
    OrderID INTEGER PRIMARY KEY,
    TotalCost DECIMAL(7,2),
    Items INTEGER[], 
    OrderDate TIMESTAMP 
);
