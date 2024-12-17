
//import OrderClass from '../Classes/Orders.js';
import React , { useState } from 'react';
import orderItemList from './OrderItemlist.js';
import Translator from './Translator.js';
import PostgresFetcher from '../Classes/PosgresFetcher';
import Popup from 'reactjs-popup';
import './CSS/Cart.css'

const DB = new PostgresFetcher();
//orderlist is list of orders while setorders updates the list dynamically
var RemoveSoundCue = new Audio('Flick_Switch_04.WAV');
var ClearSoundCue = new Audio('ClearSound.mp3');
    ClearSoundCue.volume = 0.3;
var CheckoutCue = new Audio('Special_Powerup_01.WAV');
//React.Dispatch<React.SetStateAction<never[]>>
/**
 * Sets up and renders the cart menu
 * @component Cart
 * @example
 * <Cart OrderList={orders} mode = "customer" setOrders={setOrders} CurrentLanguage = {CurrentLanguage} />
 * @param {OrderClass[]} OrderList - list of ordered items
 * @param {ReactElement} setOrder - Updater function for OrderList
 * @param {String} CurrentLanguage - Used to tell the translator what the current language is
 * @param {String} mode - Used to manipulate Translation api usage
 * @returns {JSX.Element} - Rendered Component
 */
function Cart({OrderList , setOrders, CurrentLanguage,mode }) {
   
    const [isCheckout,setCheckoutPopup] = useState(false);


    //Get total price
    function getTotal(){
        let total = 0;
        for(let i = 0; i < OrderList.length; i++){
            total += OrderList[i].Price;
        }
        total += total * 0.0825;
        console.log(total);
        return(parseFloat(total.toFixed(2)));
    }

    function clearCart(setOrders_){
        const empty = [];
        setOrders_(empty);
        ClearSoundCue.currentTime = 0;
        ClearSoundCue.play();
    }

    function Checkout(setOrders_){
        if(OrderList.length >0){
            setCheckoutPopup(true)
            CheckoutCue.currentTime = 0;
            CheckoutCue.play();
            console.log(getTotal());
            DB.SendOrder(OrderList,getTotal());
            const empty = [];
            setOrders_(empty);
        }

    }

    function deleteButton(item){
        const orderarray = OrderList.filter(OrderList => OrderList.id !== item.id);
       
        RemoveSoundCue.currentTime = 0;
        RemoveSoundCue.play();
        setOrders(orderarray);
    }

    let map = new Map();

    for (let i = 0; i < OrderList.length; i++) {
        const order = OrderList[i];
        let found = false;

        for (let existingOrder of map.keys()) {
            if (existingOrder.equals(order)) {
                map.set(existingOrder, map.get(existingOrder) + 1);
                found = true;
                break;
            }
        }

        if (!found) {
            map.set(order, 1);
        }
    }


    const orderlist = Array.from(map.keys()).map((item) => (
        <li key={item.id}>
            <div className="OrderItem">
                <span className="listItem">
                    <Translator  text={item.Type} language={CurrentLanguage} />
                    <button className="DeleteButton" onClick={() => deleteButton(item)}>Remove</button>
                </span>
                {orderItemList(item,CurrentLanguage)}
                <Translator  text="Price" language={CurrentLanguage} />: ${item.Price.toFixed(2)} <br />
                <Translator  text="Amount" language={CurrentLanguage} />: {map.get(item)}
            </div>
        </li>
    ));

    const clearCartButton = (<button className="ClearButton" onClick={() => clearCart(setOrders)}>
        <Translator  text="Clear" language={CurrentLanguage}/>
        </button>);
    const checkoutButton = (<button className="CheckoutButton" onClick={() => Checkout(setOrders)}>
        <Translator  text="Checkout" language={CurrentLanguage}/>
        </button>);
   

    return (
        <>
            <div className="Cart">
                <div className="CartList"> {orderlist} </div>
                <div className="TotalBar"><Translator  text="Total" language={CurrentLanguage} />: ${getTotal().toFixed(2)}</div>
                <div className="ButtonsContainer">
                    <span className="ClearButton">{clearCartButton}</span>
                    <span className="CheckoutButton">{checkoutButton}</span>
                </div>
            </div>
            <Popup open = {isCheckout}
          modal 
          closeOnDocumentClick 
          onClose={() => setCheckoutPopup(false)}>
            <div className='combo-popup-content'>
              <h1>Order Confirmed please Pay at front</h1>
              <button onClick={() => setCheckoutPopup(false)}> Close </button>
            </div>
          </Popup>
        </>
    );
}

export default Cart;