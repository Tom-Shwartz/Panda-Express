import './CSS/OrderMenu.css';
import React, { useState } from 'react';
import Entrees from './Entrees';
import Sides from './Sides';
import Extras from './Extras';
import Combos from './Combos';
import Cart from './Cart';
import Translator from './Translator';

/**
 * Generates the jsx for the customer view 
 * 
 * 
 * @param {string} CurrentLanguage - string that contains the current language code for google translate
 * @returns {JSX.Element} - returns the jsx for customer view
 */
function OrderMenu({CurrentLanguage}) {
    const [activeComponent, setActiveComponent] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);

    const toggleAccessibility = () => {
        setIsAccessibilityMode((prev) => !prev);
    };
   
    
    const renderContent = () => {
        switch (activeComponent) {
            case 'Combos':
                return <Combos mode = "customer" onUpdateOrders = {setOrders} CurrentLanguage = {CurrentLanguage} isAccessibilityMode={isAccessibilityMode}/>;
            case 'Entrees':
                return <Entrees mode = "customer" onUpdateOrders = {setOrders} CurrentLanguage = {CurrentLanguage} isAccessibilityMode={isAccessibilityMode} />;
            case 'Sides':
                return <Sides mode = "customer" onUpdateOrders = {setOrders} CurrentLanguage = {CurrentLanguage} isAccessibilityMode={isAccessibilityMode} />;
            case 'Extras':
                return <Extras mode = "customer" onUpdateOrders = {setOrders} CurrentLanguage = {CurrentLanguage} isAccessibilityMode={isAccessibilityMode}/>;    
            case 'Cart':

                return <Cart
                    OrderList={orders}
                    mode = "customer"
                    setOrders={setOrders}
                    CurrentLanguage = {CurrentLanguage}
                />;
            default:
                return <Combos mode = "customer" onUpdateOrders = {setOrders} CurrentLanguage = {CurrentLanguage} isAccessibilityMode={isAccessibilityMode}/>;
        }
    };
    
    return (
        <div className="App">
            <aside className="sidebar">
                <button className={isAccessibilityMode ? 'accessibility-button-menu' : 'sidebar-button'} onClick={() => setActiveComponent('Combos')}> <Translator  text="Combos" language={CurrentLanguage} /> </button>
                <button className={isAccessibilityMode ? 'accessibility-button-menu' : 'sidebar-button'} onClick={() => setActiveComponent('Entrees')}> <Translator  text="Entrees" language={CurrentLanguage}/> </button>
                <button className={isAccessibilityMode ? 'accessibility-button-menu' : 'sidebar-button'} onClick={() => setActiveComponent('Sides')}><Translator  text="Sides" language={CurrentLanguage}/></button>
                <button className={isAccessibilityMode ? 'accessibility-button-menu' : 'sidebar-button'} onClick={() => setActiveComponent('Extras')}> <Translator  text="Extras" language={CurrentLanguage}/> </button>
            </aside> 

            <div className="main-content">{renderContent()}</div>

            <div className="shopping-cart">
                <button onClick={() => setActiveComponent('Cart')}>
                <h5>{orders.length}</h5>
                <img src='cart.png' alt='Shopping shop icon' width='100' height='75'/>
                
                <Translator  text="Cart" language={CurrentLanguage}/>
                
                </button>
            </div>

            <div className="Accessibility">
                <button onClick={toggleAccessibility}>
                   
                    <Translator  text= {isAccessibilityMode ? 'Disable Accessibility' : 'Enable Accessibility'} language={CurrentLanguage}/>
                </button>
            </div>
        </div>
    );
}

export default OrderMenu;