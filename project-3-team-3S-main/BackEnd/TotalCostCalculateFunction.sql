/*seeds the total cost in order_history from from the baseprice combos given*/
CREATE OR REPLACE Function TotalCostCalculate()
RETURNS VOID as $$
BEGIN
    UPDATE order_history 
    SET TotalCost = (
        SELECT SUM(BasePrice) 
        FROM combos 
        WHERE ItemId = ANY(order_history.items));
END;
$$ LANGUAGE plpgsql;

