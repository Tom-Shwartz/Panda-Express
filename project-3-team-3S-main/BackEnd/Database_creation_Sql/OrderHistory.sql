CREATE TABLE Order_History (
    OrderID INTEGER PRIMARY KEY,
    TotalCost DECIMAL(7,2),
    OrderDate TEXT  -- Using TEXT for date storage in SQLite
);


/*relation table to help hold the items for each order*/

CREATE TABLE Order_Items (
    ItemID INTEGER PRIMARY KEY AUTOINCREMENT,  -- Optional: unique ID for each item entry
    OrderID INTEGER,
    Item INTEGER,
    FOREIGN KEY (OrderID) REFERENCES Order_History(OrderID)
);


/*
how to use this new format 

example finds all items that pertain to a certain order id
SELECT 
    Order_History.OrderID, 
    Order_History.TotalCost, 
    Order_History.OrderDate, 
    Order_Items.Item
FROM 
    Order_History
JOIN 
    Order_Items ON Order_History.OrderID = Order_Items.OrderID
WHERE 
    Order_History.OrderID = <specific_order_id>;


SELECT
    new_combos.itemid,
    type,
    combo_items.item_name 
FROM 
    new_combos 
JOIN 
    combo_items ON new_combos.itemid = comboid 
WHERE 
    Order_History.OrderID = <specific_order_id>;
*/