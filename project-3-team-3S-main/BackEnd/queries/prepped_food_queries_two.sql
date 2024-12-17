/* Prepped Food Queries */

/* \i csce_331/queries/prepped_food_queries_two.sql */


/* get the cost of preppared food and orders them in ascending order*/
SELECT
    food_name, 
    cost
FROM
    prepped_food
order BY
    cost ASC;