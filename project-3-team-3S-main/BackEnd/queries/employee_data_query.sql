/*gets all employees who operate the register (excludes cooks) along with the wage and position*/
SELECT 
    id,
    name,
    position,
    wage
FROM
    employee_data
where
    sales > -1;

/*test demo*/