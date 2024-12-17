/*gets the sum of all orders we have*/
SELECT
    SUM(totalcost) AS total_revenue
FROM
    order_history;