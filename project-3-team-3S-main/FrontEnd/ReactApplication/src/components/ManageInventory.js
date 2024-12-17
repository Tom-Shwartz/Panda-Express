import React, { useState, useEffect } from 'react';
import './CSS/ManageInventory.css';
import PostgresFetcher from '../Classes/PosgresFetcher';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
const DB = new PostgresFetcher();


/**
 * React component for managing inventort. This includes adding, removing, and updating menu and inventory details,
 * as well as interacting with a database to fetch and update menu and inventory information.
 * Component to manage inventory items.
 * @component
 * @returns {JSX.Element} - The rendered InventoryManagement component.
 */
function ManageInventory() {

    const [inventoryList,setInventory] = useState([]);
    const [units, setUnit] = useState(["lb"]);
    const [test, settest] = useState([""]);
    const [amountList, setAmount] = useState([""]);
    const [countList, setCount] = useState([""]);
    const [updateamountList, updatesetAmount] = useState([""]);
    const [updatecountList, updatesetCount] = useState([""]);
    const [inputs, setInputs] = useState([""]);
    //for menu items
    const [menuinputs, setmenuInputs] = useState([""]);
    const [costinputs, setcostInputs] = useState([""]);
    const [amountinputs, setamountInputs] = useState([""]);
    const [ftinputs, setftInputs] = useState(["entree"]);
    const [ingreinputs, setingreInputs] = useState([""]);
    const [invusedinputs, setinvusedInputs] = useState([""]);
    const [updatemenuItems, setupdateMenuitem] = useState([""]);
    const [updateinge, setupdateingre] = useState([""]);
    const [updateingeused, setupdateingreused] = useState([""]);
    const [updatemenuamount, setupdatemenuamount] = useState([""]);
    const [updatemenucost, setupdatemenucost] = useState([""]);
    const [updatemenutype, setupdatemenutype] = useState([""]);


    /**
     * Fetches every inventory item from the database.
     * @async
     * @returns {Promise<number[]>} An array of the inventory list. 
     */
    async function getInventoryfromDatabase() {
        const getinventoryList = await DB.CustomSQL("select * from inventory_items",'item_name');

        return Array.from({ length: getinventoryList.length }, (_, i) => 
            getinventoryList[i]
        );
    }
    useEffect(() => {
        /**
         * Fetches inventory and menu item data from the database and updates component state.
         * @async
         */
        async function waitonInvt() {
            const RetrievedInvent = await getInventoryfromDatabase();
            const RetrievedUnit = await DB.CustomSQL("select * from inventory_items" , 'unit');
            const RetrievedMenu = await DB.CustomSQL("select * from menu_items" ,'food_name' );
            const RetrievedType = await DB.CustomSQL("select * from menu_items", 'food_type');
            setInventory(RetrievedInvent);
            settest(RetrievedUnit);
            setupdateMenuitem(RetrievedMenu);
            setupdatemenutype(RetrievedType);
        }
        waitonInvt();
    },[])

    /**
     * Removes an inventory item input field if the X is clicked.
     * 
     * @function removeitemFrom
     * @param {number} index - The index of the inventory item field to be remove.
     */
    const removeitemFrom = (index) => {
        if (inputs.length > 1) {
            setInputs(inputs.slice(0, -1));
            setUnit(units.filter((_, i) => i !== index));
            setAmount(amountList.slice(0,-1));
            setCount(countList.slice(0,-1));
        }
    }

    /**
     * Adds a new input field for inventory items.
     */
    const addToitem = () => {
        setInputs([...inputs, ""]); 
        setUnit([...units, ""]);
    }

    /**
     * Adds new inventory items to the database.
     *
     * @param {string[]} item - Array of item names to add.
     * @param {string[]} a - Array of amounts for each item.
     * @param {string[]} c - Array of counts for each item.
     * @param {string[]} u - Array of units for each item (e.g., "lb", "oz").
     */

    async function additemtoDB(item,a,c,u) {

        let itemnull = [];
        let anull = [];
        let cnull = [];
        let unull = [];
        for (let i = 0; i < item.length; i++) {
            if(item[i] !== "") {
                itemnull[i] = item[i];
                anull[i] = a[i];
                cnull[i] = c[i];
                unull[i] = u[i];
                console.log("Amounts:", amountList);
                console.log("Counts:", countList);
                console.log("unit:", unull);
                console.log("item:", itemnull);
                DB.CustomSQL(`INSERT INTO inventory_items VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM inventory_items), '${itemnull[i]}' , ${anull[i]} , ${cnull[i]}, '${unull[i]}')`);
            }
            
        }
        const updatedInventory = await getInventoryfromDatabase();
        setInventory(updatedInventory);
        alert("Items Added to Database!");
    }
  
    /**
     * Renders the Add Item section of the inventory management system.
     * @returns {JSX.Element} The rendered Add Item section.
     */
    const renderAddItem = () => (
        <div className="manage-employee-container secondary">
          <h2>Add Items</h2>
          <div className="employee-grid">
            {inputs.map((label, index) => (
              <div key={index} className="employee-row">
                <button className="remove-btn" onClick={() => removeitemFrom(index)}>
                  ✖
                </button>
                <input
                    className="name-input"
                    value={label}
                    placeholder="Item Name"
                    onChange={(e) => {
                        const updatedInputs = [...inputs];
                        updatedInputs[index] = e.target.value;
                        setInputs(updatedInputs);
                    }}
                />
                <input
                    className="name-input"
                    value={amountList[index]}
                    placeholder="AMOUNT"
                    onChange={(e) => {
                        const updatedAmount = [...amountList];
                        updatedAmount[index] = e.target.value;
                        setAmount(updatedAmount);
                    }}
                />

                <input
                    className="name-input"
                    value={countList[index]}
                    placeholder="COUNT"
                    onChange={(e) => {
                        const updatedCount = [...countList];
                        updatedCount[index] = e.target.value;
                        setCount(updatedCount);
                    }}
                />
                <select
                  className="position-dropdown"
                  value={units[index]}
                  onChange={(e) => {
                    const updatedUnit = [...units];
                    updatedUnit[index] = e.target.value;
                    setUnit(updatedUnit);
                  }}
                >
                  <option value="lb">lb</option>
                  <option value="oz">oz</option>
                  <option value="count">count</option>
                </select>
              </div>
            ))}
            <button className="add-btn" onClick={addToitem}>+</button>

          </div>
          <button className='save-btn' onClick={() => additemtoDB(inputs,amountList,countList,units)}>Add Items</button>
        </div>
      );


    /**
     * Removes an inventory item from the database and updates the state.
     * 
     * @async
     * @function removeitemFromdb
     * @param {number} index - The index of the inventory item to remove.
     */
    const removeitemFromdb = async (index) => {
        const specItem = inventoryList[index];
        await DB.CustomSQL(`DELETE FROM inventory_items WHERE item_name = '${specItem}'`);

        const updatedItems = [...inventoryList];
        updatedItems.splice(index, 1);
        setInventory(updatedItems);
        alert(`${specItem} Removed`);
    }

    /**
     * Updates an inventory items details in the database.
     * 
     * @async
     * @param {number} index - The index of the inventory item to update.
     */
    const updateInvetorydb = async(index) => {
        const specAmount = updateamountList[index];
        const specCost = updatecountList[index];
        const specItem = inventoryList[index];
        const specUnit = test[index];
        if(updateamountList[index] && updateamountList[index].trim() !== "") {
          await DB.CustomSQL(`UPDATE inventory_items SET amount = ${specAmount}  WHERE item_name = '${specItem}'`);
        } if(updatecountList[index] && updatecountList[index].trim() !== "") {
          await DB.CustomSQL(`UPDATE inventory_items SET price = ${specCost} WHERE item_name = '${specItem}'`);
        }
        await DB.CustomSQL(`UPDATE inventory_items SET unit = '${specUnit}'  WHERE item_name = '${specItem}'`);
        alert(`${specItem} Updated`);
      }

      const renderUpdateItems = () => (
        <div className="manage-employee-container secondary">
          <h2>Update Items</h2>
          <div className="employee-grid">
            {inventoryList.map((label, index) => (
              <div key={index} className="employee-row">
                <button className="remove-btn" onClick={() => removeitemFromdb(index)}>
                  ✖
                </button>
                <button onClick={() => updateInvetorydb(index)}>{label}</button>

                <input
                    className="name-input"
                    value={updateamountList[index]}
                    placeholder="AMOUNT"
                    onChange={(e) => {
                        const updatedAmount = [...updateamountList];
                        updatedAmount[index] = e.target.value;
                        updatesetAmount(updatedAmount);
                    }}
                />

                <input
                    className="name-input"
                    value={updatecountList[index]}
                    placeholder="COUNT"
                    onChange={(e) => {
                        const updatedCount = [...updatecountList];
                        updatedCount[index] = e.target.value;
                        updatesetCount(updatedCount);
                    }}
                />
                <select
                  className="position-dropdown"
                  value={test[index]}
                  onChange={(e) => {
                    const updatedUnits = [...test];
                    updatedUnits[index] = e.target.value;
                    settest(updatedUnits);
                  }}
                >
                  <option value="lb">lb</option>
                  <option value="oz">oz</option>
                  <option value="count">count</option>
                </select>
              </div>
            ))}

          </div>
        </div>
      );

      /**
     * Removes a menu item input field if the X is clicked.
     * 
     * @param {number} index - The index of the menu item field to be remove.
     */
      const removeMenuFrom = (index) => {
        if (menuinputs.length > 1) {
          setmenuInputs(menuinputs.slice(0, -1));
          setftInputs(ftinputs.filter((_, i) => i !== index));
          setcostInputs(costinputs.slice(0,-1));
          setamountInputs(amountinputs.slice(0,-1));
          setingreInputs(ingreinputs.slice(0,-1));
          setinvusedInputs(invusedinputs.slice(0,-1));
        }
      }

    
    /**
     * Adds a new input field for menu items.
     */
    const addToMenuitem = () => {
      setmenuInputs([...menuinputs, ""]); 
      setftInputs([...ftinputs, ""]);
    }

    /**
     * Adds a new menu item to the database, 
     * including ingredients and associated inventory 
     * along with the cost and amounts used.
     * 
     * @async
     */
    async function addMenutoDB() {
      try {
        for (let i = 0; i < menuinputs.length; i++) {
            if (menuinputs[i] !== "") {
                const foodName = menuinputs[i];
                const foodType = ftinputs[i];
                const cost = parseFloat(costinputs[i]) || 0; 
                const ingredients = ingreinputs[i].split(","); 
                const inventoryUsed = invusedinputs[i].split(","); 
                const amounts = amountinputs[i];

                if (inventoryUsed.length !== amounts.length) {
                    console.error("Mismatch between inventory used and amounts");
                    continue;
                }

                await DB.CustomSQL(`INSERT INTO menu_items VALUES ((SELECT COALESCE(MAX(food_id), 0) + 1 FROM menu_items), '${foodName}', ${cost}, ${amounts},'${foodType}')`);

                for (let j = 0; j < inventoryUsed.length; j++) {
                    const inventoryName = inventoryUsed[j].trim();
                    const ingresplice = ingredients[j].trim();

                    await DB.CustomSQL(
                        `INSERT INTO menu_ingredients VALUES ((SELECT COALESCE(MAX(ingredient_id), 0) + 1 FROM menu_ingredients) ,(SELECT MAX(food_id) AS food_id FROM menu_items WHERE food_name = '${foodName}'), '${ingresplice}', ${inventoryName})`
                    );
                }

                alert(`Successfully added menu item: ${foodName}`);
            }
            const updateMenu = await DB.CustomSQL("select * from menu_items" ,'food_name' );
            setupdateMenuitem(updateMenu);
        }
      } catch (error) {
          console.error("Error adding menu items:", error);
      }

    }

    /**
     * Renders the Add Menu Items section for the menu management system.
     * @returns {JSX.Element} The rendered Add Menu Items section.
     */
      const renderMenuItems = () => (
        <div className="manage-employee-container secondary">
          <h2>Add Items</h2>
          <div className="employee-grid">
            {menuinputs.map((label, index) => (
              <div key={index} className="employee-row">
                <button className="remove-btn" onClick={() => removeMenuFrom(index)}>
                  ✖
                </button>
                <input
                    className="name-input"
                    value={label}
                    placeholder="Food Name"
                    onChange={(e) => {
                        const updatedmenuInputs = [...menuinputs];
                        updatedmenuInputs[index] = e.target.value;
                        setmenuInputs(updatedmenuInputs);
                    }}
                />
                <input
                    className="name-input"
                    value={ingreinputs[index]}
                    placeholder="Ingredients"
                    onChange={(e) => {
                        const updatedmenuIngre = [...ingreinputs];
                        updatedmenuIngre[index] = e.target.value;
                        setingreInputs(updatedmenuIngre);
                    }}
                />
                <input
                    className="name-input"
                    value={invusedinputs[index]}
                    placeholder="Inventory Used"
                    onChange={(e) => {
                        const updatedmenuInv = [...invusedinputs];
                        updatedmenuInv[index] = e.target.value;
                        setinvusedInputs(updatedmenuInv);
                    }}
                />

                <input
                    className="name-input"
                    value={amountinputs[index]}
                    placeholder="Amount"
                    onChange={(e) => {
                        const updatedmenuAmount = [...amountinputs];
                        updatedmenuAmount[index] = e.target.value;
                        setamountInputs(updatedmenuAmount);
                    }}
                />

                <input
                    className="name-input"
                    value={costinputs[index]}
                    placeholder="Cost"
                    onChange={(e) => {
                        const updatedmenyuCost = [...costinputs];
                        updatedmenyuCost[index] = e.target.value;
                        setcostInputs(updatedmenyuCost);
                    }}
                />
                <select
                  className="position-dropdown"
                  value={ftinputs[index]}
                  onChange={(e) => {
                    const updatedFT = [...ftinputs];
                    updatedFT[index] = e.target.value;
                    setftInputs(updatedFT);
                  }}
                >
                  <option value="entree">entree</option>
                  <option value="side">side</option>
                  <option value="Appetizer">Appetizer</option>
                </select>
              </div>
            ))}
            <button className="add-btn" onClick={addToMenuitem}>+</button>

          </div>
          <button className='save-btn' onClick={() => addMenutoDB()}>Add Items</button>
        </div>
      );

      /**
       * Removes a menu item from the database and updates the UI to reflect the change.
       *
       *
       * @async
       * @param {number} index - The index of the menu item to be removed.
       */
      const removemenuitemFromdb = async (index) => {
        const specItem = updatemenuItems[index];
        await DB.CustomSQL(`DELETE FROM menu_items WHERE food_name = '${specItem}'`);

        const updatedItems = [...updatemenuItems];
        updatedItems.splice(index, 1);
        setupdateMenuitem(updatedItems);
        alert(`${specItem} removed from Database`);
      }

      /**
       * Updates menu item details and associated inventory in the database.
       * 
       * If the ingredient does not exist in the `inventory_items` table, it inserts a new entry.
       *
       * @async
       * @param {number} index - The index of the menu item being updated.
       */
      const updatemenuInvetorydb = async(index) => {
        for (let i = 0; i < updatemenuItems.length; i++) {
          if(updateinge[index] === inventoryList[i] ) {
            DB.CustomSQL(`UPDATE menu_ingredients SET inventory_used = ${updateingeused[index]} WHERE ingredient = '${updateinge[index]}' AND menu_id = (SELECT food_id FROM menu_items WHERE food_name = '${updatemenuItems[index]}')`);
          } else {
            DB.CustomSQL(`INSERT INTO menu_ingredients VALUES ((SELECT COALESCE(MAX(ingredient_id), 0) + 1 FROM menu_ingredients),(SELECT food_id FROM menu_items WHERE food_name = '${updatemenuItems[index]}'),'${updateinge[index]}' , ${updateingeused[index]})`);
            DB.CustomSQL(`INSERT INTO inventory_items VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM inventory_items), '${updateinge[index]}' , 0, 0.00, 'lb')`);
          }
        }
        if(updatemenuamount[index] && updatemenuamount[index].trim() !== "") {
          DB.CustomSQL(`UPDATE menu_items SET amount = ${updatemenuamount[index]} WHERE food_name = '${updatemenuItems[index]}'`);
        }
        if(updatemenucost[index] && updatemenucost[index].trim() !== "") {
          DB.CustomSQL(`UPDATE menu_items SET cost = ${updatemenucost[index]} WHERE food_name = '${updatemenuItems[index]}'`);
        }
        const specType = updatemenutype[index];
        DB.CustomSQL(`UPDATE menu_items SET food_type = '${specType}' WHERE food_name = '${updatemenuItems[index]}'`)
        alert(`${updatemenuItems[index]} has been updated!`);
      }

      /**
       * Renders the Update Menu Items section.
       * @returns {JSX.Element} The rendered Update Menu Items section.
       */
      const renderupdateMenuItems = () => (
        <div className="manage-employee-container secondary">
          <h2>Add Items</h2>
          <div className="employee-grid">
            {updatemenuItems.map((label, index) => (
              <div key={index} className="employee-row">
                <button className="remove-btn" onClick={() => removemenuitemFromdb(index)}>
                  ✖
                </button>
                <button onClick={() => updatemenuInvetorydb(index)}>{label}</button>
                <input
                    className="name-input"
                    value={updateinge[index]}
                    placeholder="Ingredients"
                    onChange={(e) => {
                        const updatedmenuIngre = [...updateinge];
                        updatedmenuIngre[index] = e.target.value;
                        setupdateingre(updatedmenuIngre);
                    }}
                />
                <input
                    className="name-input"
                    value={updateingeused[index]}
                    placeholder="Inventory Used"
                    onChange={(e) => {
                        const updatedmenuInv = [...updateingeused];
                        updatedmenuInv[index] = e.target.value;
                        setupdateingreused(updatedmenuInv);
                    }}
                />

                <input
                    className="name-input"
                    value={updatemenuamount[index]}
                    placeholder="Amount"
                    onChange={(e) => {
                        const updatedmenuAmount = [...updatemenuamount];
                        updatedmenuAmount[index] = e.target.value;
                        setupdatemenuamount(updatedmenuAmount);
                    }}
                />

                <input
                    className="name-input"
                    value={updatemenucost[index]}
                    placeholder="Cost"
                    onChange={(e) => {
                        const updatedmenyuCost = [...updatemenucost];
                        updatedmenyuCost[index] = e.target.value;
                        setupdatemenucost(updatedmenyuCost);
                    }}
                />
                <select
                  className="position-dropdown"
                  value={updatemenutype[index]}
                  onChange={(e) => {
                    const updatedFT = [...updatemenutype];
                    updatedFT[index] = e.target.value;
                    setupdatemenutype(updatedFT);
                  }}
                >
                  <option value="entree">entree</option>
                  <option value="side">side</option>
                  <option value="Appetizer">Appetizer</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      );

    return(
        <div className='manage-inv-container'>
            <div className='inv-grid'>
                <div className='list inventory-items'>
                    <ul>
                    {inventoryList.map((label, index) => (
                        <li key={index}>
                            {inventoryList[index]}
                        </li>
                    ))}
                    </ul>
                </div>
            </div>

            <Popup
                trigger={<button className="save-btn">Add Items</button>}
                modal
                nested
            >
                {(close) => (
                <div className="popup-content-manager-empl">
                    {renderAddItem()}
                    <button className="close-btn-empl" onClick={() => { close();}}>
                    Close
                    </button>
                </div>
                )}
            </Popup>
            <Popup
                trigger={<button className="save-btn">Update/Remove Items</button>}
                modal
                nested
            >
                {(close) => (
                <div className="popup-content-manager-empl">
                    {renderUpdateItems()}
                    <button className="close-btn-empl" onClick={close}>
                    Close
                    </button>
                </div>
                )}
            </Popup>

            <Popup
                trigger={<button className="save-btn">Add Menu Items</button>}
                modal
                nested
            >
                {(close) => (
                <div className="popup-content-manager-empl">
                    {renderMenuItems()}
                    <button className="close-btn-empl" onClick={close}>
                    Close
                    </button>
                </div>
                )}
            </Popup>
            <Popup
                trigger={<button className="save-btn">Update Menu Items</button>}
                modal
                nested
            >
                {(close) => (
                <div className="popup-content-manager-empl">
                    {renderupdateMenuItems()}
                    <button className="close-btn-empl" onClick={close}>
                    Close
                    </button>
                </div>
                )}
            </Popup>
        </div>
    ); 
}

export default ManageInventory;