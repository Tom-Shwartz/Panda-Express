
import React, { useEffect, useState } from 'react';
import Entrees from './Entrees';
import Sides from './Sides';
import Extras from './Extras';
import Combos from './Combos';
import CashierCheckout from './CashierCheckout';
import './CSS/CashierInterface.css';
import './CSS/PaymentTerminal.css';
import Popup from 'reactjs-popup';
import PaymentTerminal from './PaymentTerminal';

/**
 * Used to generate the Interface of the cashier menu by combining all sub components such as CashierCheckout,Combos,Entrees,....
 * @component
 * @example
 * <CashierInterface />
 * @param {} - takes in no parameters
 * @returns {JSX.Element} - Returns the jsx for the cashier component and all it's subcomponents
 */
function CashierInterface() {

  const [PaymentStatus,SetPaymentStatus] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [OrderTotal, setTotal] = useState(0.00);
  const [InitalTotal, setInitalTotal] = useState(0.00);
  const [orders, setOrders] = useState(() => {
    //storing state for having backing just in case of refresh
    const orders = localStorage.getItem('CheckoutList');
      if(orders){
        return JSON.parse(orders)
      }
      else{
        return [];
      }
  });



  //will keep items present even after refresh/application crash
  useEffect(() => {
    localStorage.setItem('CheckoutList',JSON.stringify(orders))
  },[orders])

  const renderContent = () => {
    switch (activeComponent) {
        case 'Combos':
            return <Combos mode = "cashier" onUpdateCheckout = {setOrders}/>
        case 'Entrees':
            return <Entrees mode = "cashier" onUpdateCheckout = {setOrders}/> ;
          case 'Sides':
            return <Sides mode = "cashier" onUpdateCheckout = {setOrders}/>
        case 'Extras':
            return <Extras mode = "cashier" onUpdateCheckout = {setOrders}/>
        default:
            return <Entrees mode = "cashier" onUpdateCheckout = {setOrders}/>;
    }
};

  return (
    <main>
      <div className='cashier-interface'>

        <div className='navibar'>
          <div className='button-bar'>
            <button onClick = {() => setActiveComponent('Combos')}> Combos </button>
            <button onClick = {() => setActiveComponent('Entrees')} > Entrees </button>
            <button onClick = {() => setActiveComponent('Sides')}> Sides </button>
            <button onClick = {() => setActiveComponent('Extras')}> Extras  </button>
          </div>
        </div>
        <Popup id = "PaymentTerminal" className='PaymentTerminalPopup' contentStyle={{ background: 'transparent', border:'none'}} open = {PaymentStatus} onClose={() => {SetPaymentStatus(false)}}>
          <button className='CloseButton' onClick={() => SetPaymentStatus(false)}> X </button>
          <PaymentTerminal InitalTotal = {InitalTotal} setTotal={setTotal} Total={OrderTotal} SetPopupStatus = {SetPaymentStatus} OrderList ={orders}  setOrders = {setOrders}/>
        </Popup>


        <div className='main-content'>
          {renderContent()}
          
        </div>

        <aside className='checkout-tab'>
        <CashierCheckout setOrders = {setOrders} OrderList= {orders} SetPaymentStatus = {SetPaymentStatus} SetTotal= {setTotal} setInitalTotal ={setInitalTotal}/>
        </aside>

      </div>
    </main>
  );
}

export default CashierInterface;
