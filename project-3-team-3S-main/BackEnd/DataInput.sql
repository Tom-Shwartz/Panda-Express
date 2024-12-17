\copy inventory_items from 'C:/Users/rlar0/Documents/Programming assignment/CSCE 331/Project 2 folder/project-2-team-3S/data/InventoryData.csv' CSV HEADER
\copy combos from 'C:/Users/rlar0/Documents/Programming assignment/CSCE 331/Project 2 folder/project-2-team-3S/data/menuitems.csv' CSV HEADER
\copy order_history from 'C:/Users/rlar0/Documents/Programming assignment/CSCE 331/Project 2 folder/project-2-team-3S/data/OrderHistory.csv' CSV HEADER
\copy prepped_food from 'C:/Users/rlar0/Documents/Programming assignment/CSCE 331/Project 2 folder/project-2-team-3S/data/prepped_food.csv' CSV HEADER
\i 'C:/Users/rlar0/Documents/Programming assignment/CSCE 331/Project 2 folder/project-2-team-3S/TotalCostCalculateFunction.sql'
select TotalCostCalculate();