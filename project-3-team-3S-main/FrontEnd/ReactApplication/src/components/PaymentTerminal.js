import { useState } from "react";
import './CSS/PaymentTerminal.css'
import PostgresFetcher from "../Classes/PosgresFetcher";

const DB = new PostgresFetcher();
var CheckoutCue = new Audio('Special_Powerup_01.WAV');
/**
 * Used to generate the content for the payment terminal that will be displayed by a popup
 * @component
 * @example
 * <PaymentTerminal InitalTotal = {InitalTotal} setTotal={setTotal} Total={OrderTotal} SetPopupStatus = {SetPaymentStatus} OrderList ={orders}  setOrders = {setOrders}/>
 * 
 * @param {number} InitalTotal - A float for the inital total before updating values 
 * @param {number} Total - A float for current Total value
 * @param {Function} SetTotal  - updates the current total value 
 * @param {Array} OrderList - list of orders to be checked out
 * @param {Function} setOrders - updates the OrderList
 * @param {Function} SetPopupStatus - updates the boolean related to displaying the popup for Payment Terminal
 * @returns {JSX.Element} - Returns the jsx for the Payment terminal
 */
function PaymentTerminal({InitalTotal,Total,setTotal,OrderList,setOrders,SetPopupStatus}) {
  
       const [PaymentAmount,SetPaymentAmount] = useState("")
       const [Change,setChange] = useState(0.00)
        function AddtoPayment(number) {
           return SetPaymentAmount(PaymentAmount + number);
           
        }

        function Checkout(setOrders_){
            if(Total == 0 || Total < 0.01){
                CheckoutCue.currentTime = 0;
                CheckoutCue.play();
                console.log(InitalTotal);
                DB.SendOrder(OrderList,InitalTotal);
                setOrders([]); 
                SetPopupStatus(false);
            }
            else{
              alert("There is still a balance remaining");  
            }



        }

        function deductfromTotal(CurrentAmount) {
            //error checking just in case unexpected behavior occurs
            try {
                //to avoid nan being displayed
                if(CurrentAmount == ""){
                    CurrentAmount = 0.00;
                }
                if(Total-parseFloat(CurrentAmount) < 0){
                    setTotal(0.00);
                    setChange(-(Total-parseFloat(CurrentAmount)));
                }
                else{
                    setTotal((Total) => (Total - parseFloat(CurrentAmount)));
                    setChange(0.00);
                }
            } 
            catch (error) {
                alert(CurrentAmount + " is an invalid entry");
            }   
            
            //sets payment back to "" just incase it was used as the current amount
            SetPaymentAmount("");
        }

        return(
            
            <div className='PaymentInterface'>
                <div className="PaymentTotals">
                <div> Total: ${Total.toFixed(2)}</div>
                <div> Payment: ${PaymentAmount}</div>
                <div> Change: ${Change.toFixed(2)}</div>
                </div>


            <div className='Numpad'>
                <div className="btn-group">    
                    <button onClick = {() => AddtoPayment(1)}>1</button>
                    <button onClick = {() => AddtoPayment(2)}>2</button>
                    <button onClick = {() => AddtoPayment(3)} >3</button>
                </div>

                <div className="btn-group" >
                    <button onClick = {() => AddtoPayment(4)} >4</button>
                    <button onClick = {() => AddtoPayment(5)} >5</button>
                    <button onClick = {() => AddtoPayment(6)}  >6</button>
                </div>

                <div className="btn-group">
                    <button onClick = {() => AddtoPayment("7")} >7</button>
                    <button onClick = {() => AddtoPayment("8")} >8</button>
                    <button onClick = {() => AddtoPayment("9")} >9</button>
                </div>

                <div className="btn-group">
                    <button onClick= {() => deductfromTotal(PaymentAmount)} > Deduct from Total</button>
                    <button onClick = {() => AddtoPayment("0")} >0</button>
                    <button onClick = {() => AddtoPayment(".")} >.</button>
                </div>

                <button className="Confirm-Order" onClick={() => {Checkout(setOrders)}}> Confirm Order</button>
            </div>
        </div>
    
        )
}

export default PaymentTerminal