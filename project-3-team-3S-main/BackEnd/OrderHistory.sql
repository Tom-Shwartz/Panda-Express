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



*/

SELECT date_trunc('hour', hourslist) as HoursSequence FROM generate_series( '2024-12-1 19:15:08'::timestamp, CURRENT_TIMESTAMP::timestamp, '1 hour'::interval) hourslist  ORDER BY HoursSequence DESC;

SELECT COUNT(orderid) as NumberOfSales, DATE_TRUNC('hour', orderdate::timestamp ) as HourDate FROM order_history WHERE orderdate::timestamp <=  CURRENT_TIMESTAMP and orderdate::timestamp >= '2024-12-1 19:15:08' GROUP BY HourDate ORDER BY HourDate DESC;