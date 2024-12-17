/*
Creating a sql sheet of every preppared food items.
*/

/* Creating Prepped_food table DPRECEATED NOT USEFUL ANYMORE*/
/*CREATE TABLE prepped_food (
    food_name varchar,
    ingredients text[],
    cost decimal,
    inventory_used int[],
    amount int
);
*/

/*NEW TABLE FORMAT for relation tables */

CREATE TABLE menu_items (
    food_id SERIAL PRIMARY KEY,
    food_name VARCHAR NOT NULL,
    cost DECIMAL,
    amount INT
);

/*relational items */
CREATE TABLE menu_ingredients (
    ingredient_id SERIAL PRIMARY KEY,
    food_id INT REFERENCES menu_items(food_id) ON DELETE CASCADE,
    ingredient TEXT NOT NULL,
    inventory_used INT NOT NULL
);

/**/
/*Running command to populate the prepped_food table with data*/
\copy prepped_food from csce_331/prepped_food.csv CSV HEADER

/*Command just to see if the data was populated to the table*/
SELECT * FROM prepped_food;


INSERT INTO food_ingredients (food_id, ingredient, inventory_used)
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
