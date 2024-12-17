import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import PostgresFetcher from '../Classes/PosgresFetcher';
import './CSS/EmployeeLogin.css';

const DB = new PostgresFetcher();

/**
 * Verifies the provided email against the database and navigates based on position.
 * @param {string} email - The email address to check against the database.
 * @returns {void}
 */
async function checkEmail(email) {
    var data = await DB.CustomSQL(`SELECT * FROM employee_data WHERE email = '${email}'`);
    if (data.length !== 0) {
        if (data[0].position === 'Manager') {
            navigate("/manager");
        } else {
            alert("Permission Denied");
        }
    } else {
        alert("Unverified User");
    }
}

/**
 * Callback function for handling Google Sign-In responses.
 * Decodes the JWT response and verifies the user's email, then checks the database.
 * @param {Object} response - The response object containing the JWT credential.
 * @returns {void}
 */
function handleCallbackResponse(response) {
    var user_things = jwtDecode(response.credential);
    console.log(user_things.email);
    if (user_things.email_verified === true) {
        checkEmail(user_things.email);
    }
}

/**
 * EmployeeLogin component for handling PIN-based and Google account-based login.
 * Includes interactive PIN pad, Google sign-in button, and navigation logic.
 * @returns {JSX.Element} - The rendered EmployeeLogin component.
 */
function EmployeeLogin() {
    useEffect(() => {
        // Initialize Google Sign-In
        /* global google */
        google.accounts.id.initialize({
            client_id: "897318928375-aks2c1bnh2kbbmgca9l55ms0rhfkdr12.apps.googleusercontent.com",
            callback: handleCallbackResponse
        });
        google.accounts.id.renderButton(
            document.getElementById("GoogleSignIn"),
            { theme: "filled_black", size: "large", shape: "pill" }
        );
    }, []);

    const employeePasswords = ["8594", "4543", "9854", "2373", "8031", "5783", "6560", "1205", "9923", "4189"];
    const [pin, setPin] = useState("");
    const navigate = useNavigate();

    /**
     * Adds a number to the PIN, ensuring it does not exceed 4 digits.
     * @param {string} number - The number to add to the PIN.
     * @returns {void}
     */
    const addToPin = (number) => {
        if (pin.length < 4) {
            setPin((prevPin) => prevPin + number);
        }
    };

    /**
     * Removes the last digit from the PIN if it exists.
     * @returns {void}
     */
    const removeFromPin = () => {
        if (pin.length > 0) {
            setPin((prevPin) => prevPin.substring(0, prevPin.length - 1));
        }
    };

    /**
     * Verifies the entered PIN against a list of valid employee passwords.
     * Navigates to the cashier screen if valid, otherwise alerts the user.
     * @returns {void}
     */
    const verifyPassword = () => {
        if (employeePasswords.includes(pin)) {
            navigate("/cashier");
        } else {
            alert("Incorrect PIN. Please try again.");
        }
        setPin("");
    };

    /**
     * Navigates back to the home screen.
     * @returns {void}
     */
    const backButton = () => {
        navigate("/");
    };

    return (
        <main>
            <div className="container">
                <div className='Manager_Button'>
                    <div className="google_description">Manager Login:</div>
                    <div className="google_button" id="GoogleSignIn"></div>
                </div>
                <div className="vertical-center">
                    <div className="pin-display">
                        <p className="header">Enter PIN:</p>
                        <input type="text" value={pin} readOnly className="pin-output" />
                    </div>
                    {/* PIN pad buttons */}
                    <div className="btn-group" style={{ width: '50%' }}>
                        <button onClick={() => addToPin("1")} style={{ width: '33.3%' }}>1</button>
                        <button onClick={() => addToPin("2")} style={{ width: '33.3%' }}>2</button>
                        <button onClick={() => addToPin("3")} style={{ width: '33.3%' }}>3</button>
                    </div>
                    <div className="btn-group" style={{ width: '50%' }}>
                        <button onClick={() => addToPin("4")} style={{ width: '33.3%' }}>4</button>
                        <button onClick={() => addToPin("5")} style={{ width: '33.3%' }}>5</button>
                        <button onClick={() => addToPin("6")} style={{ width: '33.3%' }}>6</button>
                    </div>
                    <div className="btn-group" style={{ width: '50%' }}>
                        <button onClick={() => addToPin("7")} style={{ width: '33.3%' }}>7</button>
                        <button onClick={() => addToPin("8")} style={{ width: '33.3%' }}>8</button>
                        <button onClick={() => addToPin("9")} style={{ width: '33.3%' }}>9</button>
                    </div>
                    <div className="btn-group" style={{ width: '50%' }}>
                        <button onClick={() => verifyPassword()} style={{ width: '33.3%' }}>Sign In</button>
                        <button onClick={() => addToPin("0")} style={{ width: '33.3%' }}>0</button>
                        <button onClick={() => removeFromPin()} style={{ width: '33.3%' }}>Backspace</button>
                    </div>
                </div>
                <div className="back-button">
                    <button onClick={() => backButton()}>&larr;</button>
                </div>
            </div>
        </main>
    );
}

export default EmployeeLogin;
