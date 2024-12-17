import React, { useState } from "react";
import orderItemList from "./OrderItemlist";
import "./CSS/CashierCheckout.css"

var RemoveSoundCue = new Audio('Flick_Switch_04.WAV');
var ClearSoundCue = new Audio('ClearSound.mp3');
ClearSoundCue.volume = 0.3;

/**
 * Used to generate the checkout tab and handle the logic related to total cost of orders and sending them to the payment terminal
 * @component
 * @example
 * <CashierCheckout setOrders = {setOrders} OrderList= {orders} SetPaymentStatus = {SetPaymentStatus} SetTotal= {setTotal} setInitalTotal ={setInitalTotal}/>
 * @param {Array} OrderList - list of orders in the cart that have been selected
 * @param {Function} setorders - function that updates order lists 
 * @param {Function} SetPaymentStatus - function that updates the condition for the payment terminal popup
 * @param {Function} SetTotal - updates the Total for the current order
 * @param {Function} setInitalTotal - updates the total before deducting payment 
 * @param
 * @returns {JSX.Element} - Returns the jsx for a cashier checkout tab with all features
 */
function CashierCheckout({OrderList , setOrders, SetPaymentStatus, SetTotal,setInitalTotal }){


    function GetSubTotal() {
            let total = 0;
            for(let i = 0; i < OrderList.length; i++){
                total += OrderList[i].Price;
            }
            return(parseFloat(total.toFixed(2)));
        }
    
    
    function deleteButton(item){
        RemoveSoundCue.currentTime = 0;
        RemoveSoundCue.play();
        const orderarray = OrderList.filter(OrderList => OrderList.id != item.id);
        setOrders(orderarray);
    }

    function clearItems(setOrders_){
        ClearSoundCue.currentTime = 0;
        ClearSoundCue.play();
        const empty = [];
        setOrders_(empty);
    }

    function Checkout() {
        SetPaymentStatus(true); 
            setInitalTotal((GetSubTotal() + GetSubTotal() * 0.0825));
            SetTotal((GetSubTotal() + GetSubTotal() * 0.0825));
        
    }

    // List out each order item
    const orderlist = OrderList.map(item => <li key={item.id}>
        <div className="OrderItem"> 
            <span className="listItem">{item.Type}
         
            <button className="DeleteButton" onClick={() => deleteButton(item)}> X </button>
            </span>
            <br></br>
            ${item.Price}
            {orderItemList(item,"en","cashier")}
            
        </div>
    </li>);

    

    return(

        <div className="Checkout">
            <div className="TotalBar">
                <div className="SubTotal"> SubTotal: ${GetSubTotal()} </div>
                <div className="TaxTotal"> Tax: ${(GetSubTotal()*0.0825).toFixed(2)}</div>
                <div className="Total"> Total: ${(GetSubTotal() + GetSubTotal() * 0.0825).toFixed(2)} </div>
                <div className="CheckoutButtons">
                    <button className="ClearBtn" onClick={() => {clearItems(setOrders); SetPaymentStatus(false)}}> Clear </button>
                    <button className = "CheckoutBtn"  onClick={ () => Checkout()}> Checkout </button>
                </div>
             
            </div>
                
            <div className = 'CheckoutList'> {orderlist} </div>

        </div>
    )



}

export default CashierCheckout