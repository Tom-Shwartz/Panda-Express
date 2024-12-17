/*Find the total amount of money earned on the specified 'big day'*/
SELECT
    SUM(totalcost)
FROM
    order_history
WHERE  
    orderdate::DATE = '2024-9-27'

    /*demo test*/