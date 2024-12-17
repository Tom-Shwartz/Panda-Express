/*gets the sales data for all the employees*/

CREATE TABLE IF NOT EXISTS employee_data (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    position VARCHAR(50),
    wage DECIMAL(10, 2),
    sales INT
);

INSERT INTO employee_data(id, name, position, wage, sales) 
VALUES (431131, 'Jerry Jones', 'Manager', 15, 0),
(749205, 'Amelia Wilson', 'Manager', 15, 0),
(452039, 'Jesus Ramirez', 'Cook', 12, -1),
(520957, 'Jerome Ford', 'Cook', 12, -1),
(884720, 'Clayton Breese', 'Cook', 12, -1),
(125043, 'Michael Marone', 'Cook', 12, -1),
(943032, 'Malik Willis', 'Cook', 12, -1),
(463823, 'Allen Fieri', 'Cashier', 11, 0),
(664738, 'Nicole Greenburg', 'Cashier', 11, 0),
(743987, 'Paola Lindor', 'Cashier', 11, 0);


WITH hours AS (
    SELECT date_trunc('hour', hourslist) AS HoursSequence
    FROM generate_series(CURRENT_DATE::timestamp, CURRENT_TIMESTAMP::timestamp, '1 hour'::interval) hourslist
)
SELECT 
    h.HoursSequence,
    COALESCE(s.NumberOfSales, 0) AS NumberOfSales
FROM 
    hours h
LEFT JOIN (
    SELECT 
        COUNT(DISTINCT orderid) AS NumberOfSales, 
        date_trunc('hour', orderdate::timestamp) AS HourDate
    FROM 
        order_history
    WHERE 
        orderdate::timestamp <= CURRENT_TIMESTAMP 
        AND orderdate::timestamp >= '2024-12-1 19:15:08'
    GROUP BY 
        HourDate
) s ON h.HoursSequence = s.HourDate
ORDER BY 
    h.HoursSequence DESC;

