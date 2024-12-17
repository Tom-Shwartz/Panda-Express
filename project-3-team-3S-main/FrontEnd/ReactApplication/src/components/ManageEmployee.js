import React, { useState, useEffect } from 'react';
import './CSS/ManageEmployee.css';
import PostgresFetcher from '../Classes/PosgresFetcher';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const DB = new PostgresFetcher();


/**
 * React component for managing employees. This includes adding, removing, and updating employee details,
 * as well as interacting with a database to fetch and update employee information.
 */
function ManageEmployee() {
    const [getId,setId] = useState([Math.floor(Math.random() * (999999 - 100000) ) + 100000]);
    const [getPass, setPass] = useState([Math.floor(Math.random() * (9999 - 1000) ) + 1000]);
    const [getdbPass, setdbPass] = useState([]);
    const [getdbId, setdbId] = useState([]);
    const [inputs, setInputs] = useState([""]);
    const [inputss, setInputss] = useState([""]);
    const [names, setNames] = useState([""]);
    const [getdbIdd, setdbIdd] = useState([]);
    const [positions, setPositions] = useState(["Cook"]);

    /**
     * Fetches employee IDs from the database.
     * @returns {Promise<number[]>} An array of employee IDs.
     */
    async function getEmployeefromDatabase() {
        const employeelistId = await DB.CustomSQL("select * from employee_data",'id');

        return Array.from({ length: employeelistId.length }, (_, i) => 
            employeelistId[i]
        );
    }
    useEffect (() => {
        /**
         * Fetches employee data from the database of their passwords, names, and IDs and updates component state.
         * @async
         */
        async function waitonID() {
            const RetrievedId = await getEmployeefromDatabase();
            const Retrievedpwd = await DB.CustomSQL("select * from employee_data",'password');
            const Retrievednames = await DB.CustomSQL("select * from employee_data",'name');
            setdbId(RetrievedId);
            setdbPass(Retrievedpwd);
            setNames(Retrievednames);
        }
        waitonID();
    }, [])

    /**
     * Ensures generated IDs and PINs are unique compared to the database.
     */
    function idCheck() {
        for (let i = 0; i < getdbId.length; i++) {
            for(let j = 0; j < inputs.length; j++) {
                if(getdbId[i] === getId[j]) {
                    setId([...getId[j] ,Math.floor(Math.random() * (999999 - 100000) ) + 100000]);
                    // return true;
                }
                if(getdbPass[i] === getPass[j]) {
                    setPass([...getPass[j] ,Math.floor(Math.random() * (9999 - 1000) ) + 1000]);
                    // return flase;
                }
            }
        }
        // return false;
    }


    /**
     * Regenerates a new PIN for a specific employee.
     * @param {number} index - Index of the employee in the state array.
     */
    const regeneratePin = (index) => {
                const newPins = [...getPass];
                newPins[index] = Math.floor(Math.random() * (9999 - 1000)) + 1000;
                setPass(newPins);
            }
        

    /**
     * Adds a new input fields to be able to add multiple employees .
     */
    const addTo = () => {
        setInputs([...inputs, ""]); 
        setId([...getId ,Math.floor(Math.random() * (999999 - 100000) ) + 100000]);
        setPass([...getPass ,Math.floor(Math.random() * (9999 - 1000) ) + 1000]);
        setPositions([...positions, "Cook"]);
    }


    /**
     * Removes the last employee input field if too many have been added.
     * @param {number} index - Index of the input field to be removed.
     */
    const removeFrom = (index) => {
        if (inputs.length > 1) {
            setInputs(inputs.slice(0, -1));
            setId(getId.slice(0, -1)); 
            setPass(getPass.slice(0, -1)); 
            setPositions(positions.filter((_, i) => i !== index));    
        }
    }

    /**
     * Removes an employee from the database if the X has been clicked.
     * @param {number} index - Index of the employee in the names array to know which person to remove.
     */
    const removeFromdb = async (index) => {
        const specName = names[index];
        await DB.CustomSQL(`DELETE FROM employee_data WHERE name = '${specName}'`);

        const updatedNames = [...names];
        updatedNames.splice(index, 1);
        setNames(updatedNames);
    }

    /**
     * Changes an employee's password in the database.
     * @param {number} index - Index of the employee in the arrays to know which person to be changed.
     */
    const chnagePass = async(index) => {
        const newPassword = Math.floor(Math.random() * (9999 - 1000)) + 1000;

        await DB.CustomSQL(`UPDATE employee_data SET password = ${newPassword} WHERE password = ${getdbPass[index]}`);

        const updatedPasswords = [...getdbPass];
        updatedPasswords[index] = newPassword;
        setdbPass(updatedPasswords);
    }


    /**
     * Adds new employees to the employee_date within the database.
     * @param {string[]} n - Array to copy the employee names.
     * @param {string[]} p - Array to copy the employee positions.
     */
    function addtoDB(n , p) {
        let newIds = [...getId];
        let newPasswords = [...getPass];

        for (let i = 0; i < inputs.length; i++) {
            while (getdbId.includes(newIds[i])) {
                newIds[i] = Math.floor(Math.random() * (999999 - 100000)) + 100000;
            }
    
            while (getdbPass.includes(newPasswords[i])) {
                newPasswords[i] = Math.floor(Math.random() * (9999 - 1000)) + 1000;
            }
        }

        setId(newIds);
        setPass(newPasswords);

        let a = [];
        let b = [];
            for(let i = 0; i < n.length; i++) {
                if(n[i] !== "") {
                a[i] =  n[i];
                b[i] = p[i]
                // DB.CustomSQL(`INSERT INTO employee_data VALUES ('" + a[i] + "','" + b[i] + "',12," + getId[i] + "," + getPass[i] + ")`);
                if(b[i] === "Cook") {
                    DB.CustomSQL(`INSERT INTO employee_data VALUES (${getId[i]}, '${a[i]}' , '${b[i]}', 12.00, 0, ${getPass[i]}, 'test_cook@gmail.com') `);
                }
                else if(b[i] == "Cashier") {
                    DB.CustomSQL(`INSERT INTO employee_data VALUES (${getId[i]}, '${a[i]}' , '${b[i]}', 11.00, 0, ${getPass[i]}, 'test_cash@gmail.com')`);
                } else {
                    DB.CustomSQL(`INSERT INTO employee_data VALUES (${getId[i]}, '${a[i]}' , '${b[i]}', 15.00, 0, ${getPass[i]} , 'test_manager@gmail.com')`);
                }

                }
            }
    }

    /**
     * Handles saving employees to the database by checking if all the fields are empty or not.
     */
    const handleSave = () => {
        const emptyIndexes = inputs.map((name, index) => (name.trim() === "" ? index : null)).filter((index) => index !== null);

        if (emptyIndexes.length > 0) {
            alert("Please insert a name for all employees.");
        } else {
            addtoDB(inputs, positions);
            alert("Added to database.");
        }
    };

    /**
     * Renders the update employee interface.
     * @returns {JSX.Element} The update employee interface.
     */
    const renderUpdateEmployee = () => (
        <div className="manage-employee-container secondary">
          <h2>Update Employees</h2>
          <div className="employee-grid">
            {names.map((label, index) => (
              <div key={index} className="employee-row">
                <button className="remove-btn" onClick={() => removeFromdb(index)}>
                  ✖
                </button>
                <button>{label}</button>
                <select
                  className="position-dropdown"
                  value={positions[index]}
                  onChange={(e) => {
                    const updatedPositions = [...positions];
                    updatedPositions[index] = e.target.value;
                    setPositions(updatedPositions);
                  }}
                >
                  <option value="Cook">Cook</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Manager">Manager</option>
                </select>
                <input className="pin-display" value={getdbPass[index]} readOnly />
                <button className="refresh-btn" onClick={() => chnagePass(index)}>🔄</button>
              </div>
            ))}
          </div>
        </div>
      );

    return(
        <div className="manage-employee-container">
            <h2>Employees</h2>
            <div className="employee-grid">
                {inputs.map((input, index) => (
                    <div key={index} className="employee-row">
                        <button className="remove-btn" onClick={() => removeFrom(index)}>✖</button>

                        <input
                            className="name-input"
                            value={input}
                            placeholder="NAME"
                            onChange={(e) => {
                                const updatedInputs = [...inputs];
                                updatedInputs[index] = e.target.value;
                                setInputs(updatedInputs);
                            }}
                        />

                        <select
                            className="position-dropdown"
                            value={positions[index]}
                            onChange={(e) => {
                                const updatedPositions = [...positions];
                                updatedPositions[index] = e.target.value;
                                setPositions(updatedPositions);
                            }}
                        >
                            <option value="Cook">Cook</option>
                            <option value="Cashier">Cashier</option>
                            <option value="Manager">Manager</option>
                        </select>
                        
                        <input className="pin-display" value={getPass[index]} readOnly />

                        <button className="refresh-btn" onClick={() => regeneratePin(index)}>🔄</button>
                    </div>
                ))}

                <button className="add-btn" onClick={addTo}>+</button>
            </div>

            <button className="save-btn" onClick={handleSave}>Save Employees</button>
            <Popup
                trigger={<button className="save-btn">Update Employee</button>}
                modal
                nested
            >
                {(close) => (
                <div className="popup-content-manager-empl">
                    {renderUpdateEmployee()}
                    <button className="close-btn-empl" onClick={close}>
                    Close
                    </button>
                </div>
                )}
            </Popup>
            {/* <div>
                {renderAdditionalContainer()}
            </div> */}
        </div>
        
    );
}
 

export default ManageEmployee;

