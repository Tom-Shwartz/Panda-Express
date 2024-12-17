/*command to run:
 \i 'C:/Users/rlar0/Documents/Programming assignment/CSCE 331/Project 2 folder/project-2-team-3S/queries/Special_Query3.sql'*/


/*gets the top 10 best performing days by revenue and orders them in descending order*/
SELECT
    DATE_TRUNC('day',orderdate)::date AS Order_Days,
    COUNT(orderid) AS Number_Of_Orders_Per_Day,
    SUM(totalcost) AS Revenue_Per_Day
FROM
    order_history
GROUP BY
    Order_Days
    /*prevents default to ascending and only get top 10*/
ORDER BY
    Revenue_Per_Day DESC

LIMIT 10;
