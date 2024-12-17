/* Prepped Food Queries */

/* \i csce_331/queries/prepped_food_queries_three.sql */
/*gets the prepared food items with them ordered by ingredients used*/
SELECT
    food_name, 
    ingredients
FROM
    prepped_food
order BY
    ingredients;

    /* demo test*/