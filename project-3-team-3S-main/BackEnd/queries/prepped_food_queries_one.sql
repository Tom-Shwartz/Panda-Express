/* Prepped Food Queries */

/* \i csce_331/queries/prepped_food_queries_one.sql */

SELECT
    food_name, 
    amount
FROM
    prepped_food
order BY
    amount DESC;