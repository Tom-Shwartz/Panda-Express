/*gets all inventory whose amount is less than 25 (regardless of unit)*/
SELECT 
    * 
FROM 
    inventory_items 
WHERE 
    amount < 25;