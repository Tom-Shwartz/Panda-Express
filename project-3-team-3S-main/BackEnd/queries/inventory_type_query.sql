
/*    command to run
    this is assuming it is on Richard's system:
     \i 'C:/Users/rlar0/Documents/Programming assignment/CSCE 331/Project 2 folder/project-2-team-3S/queries/inventory_type_query.sql'
    */

/* used for finding the inventory_items that are mesured in oz and less than $1 per oz and also displays 
    the total price for the items we have that fit the constraints mentioned
*/
SELECT 
    *,
    price*amount AS Total_Price
FROM 
    inventory_items
WHERE 
    unit = 'oz' 
AND 
    price < 1;

    /*demo test*/