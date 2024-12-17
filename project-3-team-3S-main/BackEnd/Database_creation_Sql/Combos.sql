I/*creates the table for combos (menu items a customer can order)*/
/*
useful command for copying over data

UPDATE table2 t2
SET    val2 = t1.val1
FROM   table1 t1
WHERE  t2.table2_id = t1.table2_id


*/

CREATE TYPE combo_type AS ENUM (
    'Bowl',
    'Plate',
    'Larger Plate',
    'Entree Small',
    'Entree Medium',
    'Entree Large',
    'Side Medium',
    'Side Large',
    'Drink'
);


/* OLD TABLE FOR COMBOS USING ARRAYS
CREATE TABLE IF NOT EXISTS combos (
    ItemId INTEGER PRIMARY KEY,
    Type_ combo_type,
    BasePrice DECIMAL(6, 2),
    items TEXT[]
);
*/

CREATE TABLE IF NOT EXISTS combos(
    ItemId INTEGER PRIMARY KEY,
    type TEXT,
    BasePrice DECIMAL(6, 2),
    FOREIGN KEY (type) REFERENCES combo_type_enum (type) ON DELETE RESTRICT
);

/*relation table to help hold the items for each order*/

CREATE TABLE if NOT EXISTS combo_items (
    ItemId SERIAL PRIMARY KEY,
    item_name TEXT,
    ComboID INTEGER,
    FOREIGN KEY (ComboID) REFERENCES combos(ItemId)
);

/* new enums that we are able to work with that are sql lite compatible*/
CREATE TABLE combo_type_enum (
    type TEXT PRIMARY KEY
);

INSERT INTO combo_type_enum (type) VALUES ('Plate'), ('Larger Plate'), ('Entree Small'), ('Entree Medium'),('Entree Large'),('Side Medium'),('Side Large'),('Drink'),('Appetizer');



INSERT INTO  (food_id, ingredient, inventory_used)
SELECT 
    menu_items.food_id,
    unnest(pf_old.ingredients) AS ingredient,
    unnest(pf_old.inventory_used) AS inventory_used
FROM 
    prepped_food_old AS pf_old
JOIN 
    menu_items AS mi
ON 
    pf.food_name = pf_old.food_name;
