/*gets price per amount inventory items that are less than $2 per quantity and also displays the total price of those ingrediants*/
SELECT 
    *,
    price*amount AS Total_Price
FROM 
    inventory_items 
WHERE 
    price > 2;