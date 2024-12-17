/*command to run:
 \i 'C:/Users/rlar0/Documents/Programming assignment/CSCE 331/Project 2 folder/project-2-team-3S/queries/Special_Query2.sql'*/

/*gets the number of orders per hour*/
SELECT
    DATE_TRUNC('hour',orderdate) AS Order_Hours,
    COUNT(orderid) AS Number_Of_Orders_Per_Hour,
    SUM(totalcost) AS Revenue_Per_Hour
FROM
    order_history
GROUP BY
    Order_Hours
/*fixes it not defaulting to ASC8*/
ORDER BY
    Order_Hours ASC;
