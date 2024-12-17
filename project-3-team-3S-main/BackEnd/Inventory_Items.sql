/* Creating Inventory items table*/
CREATE TYPE unit_type AS ENUM (
    'lb',
    'oz',
    'count'
);

CREATE TABLE Inventory_Items (
    id INTEGER PRIMARY KEY,
    Item_Name varchar,
    amount int,
    price decimal(5,2),
    unit unit_type
);


/*Running command to populate the prepped_food table with data*/
\copy Inventory_Items from project-2-team-3S\data\InventoryData.csv CSV HEADER


