/* 
    command to run
     \i 'C:/Users/rlar0/Documents/Programming assignment/CSCE 331/Project 2 folder/project-2-team-3S/queries/combo_query.sql'
    */

/*used for finding the menu items containing rice less than 9 dollars*/    
SELECT
    *
FROM
    combos
WHERE
    'White Rice' = ANY(items)
AND
    baseprice < 9;