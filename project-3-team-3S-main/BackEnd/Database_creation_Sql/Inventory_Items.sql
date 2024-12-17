/* Creating Inventory items table DEPRECEATED
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
*/


CREATE TABLE new_Inventory_Items (
    id INTEGER PRIMARY KEY,
    Item_Name varchar,
    amount int,
    price decimal(5,2),
    unit TEXT,
    FOREIGN KEY (unit) REFERENCES unit_enum_type(unit)
);

/* new enums that we are able to work with that are sql lite compatible*/
CREATE TABLE unit_enum_type (
    unit TEXT PRIMARY KEY
);

INSERT INTO unit_enum_type (unit) VALUES ('lb'), ('oz'), ('count');
/*Running command to populate the prepped_food table with data*/
\copy Inventory_Items from project-2-team-3S\data\InventoryData.csv CSV HEADER


