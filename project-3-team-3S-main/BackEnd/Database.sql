
/**
Style Sheet...

 lowercase names of entities when denoting Entity Names for example entity_one
for attributes use cammel case Ex: SomeAttribute
for commands use ALL CAPS ex: CREATE TABLE{}

use the C++ stying of brackets as show
CREATE TABLE{
    entity_1

    
    }


**/


/* Creating Inventory items table*/
CREATE TYPE unit_type AS ENUM (
    'lb',
    'oz',
    'count'
);

CREATE TABLE Inventory_Items (
    id int,
    Item_Name varchar,
    amount int,
    price decimal(5,2),
    unit unit_type
);








/*gets the sales data for all the employees*/

CREATE TABLE IF NOT EXISTS employee_data (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    position VARCHAR(50),
    wage DECIMAL(10, 2),
    sales INT
);

INSERT INTO employee_data(id, name, position, wage, sales) 
VALUES (431131, 'Jerry Jones', 'Manager', 15, 0),
(749205, 'Amelia Wilson', 'Manager', 15, 0),
(452039, 'Jesus Ramirez', 'Cook', 12, -1),
(520957, 'Jerome Ford', 'Cook', 12, -1),
(884720, 'Clayton Breese', 'Cook', 12, -1),
(125043, 'Michael Marone', 'Cook', 12, -1),
(943032, 'Malik Willis', 'Cook', 12, -1),
(463823, 'Allen Fieri', 'Cashier', 11, 0),
(664738, 'Nicole Greenburg', 'Cashier', 11, 0),
(743987, 'Paola Lindor', 'Cashier', 11, 0);



/*
Creating a sql sheet of every preppared food items.
*/

/* Creating Prepped_food table*/
CREATE TABLE prepped_food (
    food_name varchar,
    ingredients text[],
    cost decimal,
    inventory_used int[3],
    amount int
);







/*creates the table for combos (menu items a customer can order)*/


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
    ItemId INT,
    Type_ combo_type,
    BasePrice DECIMAL(6, 2),
    items TEXT[]
);








/* Initial Table setup */
CREATE TABLE Order_History(
    OrderID INTEGER PRIMARY KEY,
    TotalCost DECIMAL(7,2),
    Items INTEGER[], 
    OrderDate TIMESTAMP 
);

