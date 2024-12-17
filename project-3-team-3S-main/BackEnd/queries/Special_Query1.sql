/* Command to run 
\i 'C:/Users/rlar0/Documents/Programming assignment/CSCE 331/Project 2 folder/project-2-team-3S/queries/Special_Query1.sql'
*/

/*used to get the number of orders per week*/

SELECT
    /*number of orders per week*/
    DATE_TRUNC('week',orderdate::timestamp)::date As OrderWeeks,
    COUNT(orderid) AS TotalOrdersPerWeek

FROM
    order_history
GROUP BY
  DATE_TRUNC('week',orderdate) /*might have to use DATE_TRUNC('week',orderdate)*/
ORDER BY
    OrderWeeks ASC;

select DATE_Trunc('week',orderdate::timestamp)::date as OrderWeeks, Count(orderid) AS TotalOrdersPerWeek from order_history group by Date_trunc('week',orderdate::timestamp) order by orderweeks asc;