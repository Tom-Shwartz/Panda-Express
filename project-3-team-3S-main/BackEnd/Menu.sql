I/*creates the table for combos (menu items a customer can order)*/


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



CREATE TABLE IF NOT EXISTS combos (
    ItemId INTEGER PRIMARY KEY,
    Type_ combo_type,
    BasePrice DECIMAL(6, 2),
    items TEXT[]
);






