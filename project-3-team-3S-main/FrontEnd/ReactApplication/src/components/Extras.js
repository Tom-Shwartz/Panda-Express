import './CSS/Extras.css'
import React, { useEffect, useState } from 'react'
import OrderClass from '../Classes/Orders';
import PostgresFetcher from '../Classes/PosgresFetcher';
import Translator from './Translator';
import Popup from 'reactjs-popup';

const addToCartSound = new Audio('Coins_13.WAV');
addToCartSound.volume = 1.0;
const DB = new PostgresFetcher();

/**
 * @component
 * Renders the Extras component, allowing users to select extras or drinks and add them to cart or combos.
 * @param {function} onSelect - A callback function triggered when an extra or drink is selected.
 * @param {boolean} fromCombos - Indicates if the component is used in combo mode.
 * @param {boolean} isAccessibilityMode - Toggles the accessibility mode for styling.
 * @returns {JSX.Element} - The rendered Extras component.
 */
function Extras(props){
  const { onSelect, fromCombos, isAccessibilityMode} = props;
  const [extras_list,setExtrasList] = useState([]);
  const [isCartOpen,setCartPopup] = useState(false);

   /**
    * Fetches extras from the database, specifically appetizers, with their base prices.
    * @returns {Promise<OrderClass[]>} - A promise that resolves to an array of OrderClass objects representing extras.
    */
   async function GetExtrasFromDatabase(){
      //TODO: Get api call from data base to make the orders for each of the drinks
      const RetrievedExtras = await DB.CustomSQL("Select * from menu_items where food_type = 'Appetizer' ", 'food_name');
      const RetrievedPrices = await DB.CustomSQL("Select base_price from combo_type_enum where type = 'Appetizer' ",'base_price');
      return Array.from({ length: RetrievedExtras.length }, (_, i) => 
        new OrderClass("Appetizer", parseFloat(RetrievedPrices[0]),[],[],RetrievedExtras[i])
      );
    
    }

    /**
     * Fetches drink options from the database, including their sizes and corresponding prices.
     * @returns {Promise<OrderClass[]>} - A promise that resolves to an array of OrderClass objects representing drinks.
     */
    async function GetDrinksFromDatabase(){
      const RetrievedDrinks = await DB.CustomSQL("Select * from menu_items where food_type = 'Drink' ",'food_name');
      const LargeDrinkPrice = await DB.CustomSQL("Select base_price from combo_type_enum where type = 'Large Drink'",'base_price');
      const MediumDrinkPrice = await DB.CustomSQL("Select base_price from combo_type_enum where type = 'Medium Drink'",'base_price');
      const SmallDrinkPrice = await DB.CustomSQL("Select base_price from combo_type_enum where type = 'Small Drink'",'base_price');
      const DrinkPrices = [LargeDrinkPrice,MediumDrinkPrice,SmallDrinkPrice];
      
      return Array.from({ length: RetrievedDrinks.length }, (_, i) => 
        new OrderClass(RetrievedDrinks[i], parseFloat(DrinkPrices[i]),[],[],"",RetrievedDrinks[i])
      );
    }

    /**
     * Initializes the extras list by fetching data from the database on component mount.
     * Combines fetched extras and drinks into a single list.
     */
    useEffect(() =>{
      async function WaitOnExtras() {
        const RetrievedExtras = await GetExtrasFromDatabase();
        const Drinks = await  GetDrinksFromDatabase();
       
        console.log (RetrievedExtras.concat(Drinks));
        setExtrasList(RetrievedExtras.concat(Drinks));
      }
      WaitOnExtras();
    },[]);


   /**
    * Updates the cart or checkout by adding the selected item.
    * Plays a sound effect when an item is added.
    * @param {OrderClass} CurrentOrder - The current order to be added to the cart or checkout.
    * @returns {void}
    */
   function UpdateCartorCheckout(CurrentOrder){
    addToCartSound.currentTime = 0;
    addToCartSound.play();
    setCartPopup(true);
    //have to create new instance to avoid multiple items being linked together 
      const OrderInstance = new OrderClass(CurrentOrder.Type,CurrentOrder.Price, CurrentOrder.EntreeList, CurrentOrder.SideList, CurrentOrder.Appetizer, CurrentOrder.Drink, CurrentOrder.Count);
      
      if(props.mode === 'cashier'){
        props.onUpdateCheckout(prevOrder => [...prevOrder,OrderInstance]);
      }
      else{
        props.onUpdateOrders(prevOrder => [...prevOrder,OrderInstance]);
      }  
    }

    return (
        <div className= {props.mode}>
          <div className='Combo-Extras-grid'>
          {fromCombos && extras_list.map((order, index) => (
            //Handles sending to combos 
              <button key={index} onClick = { () => onSelect(order.getExtras())} className="combo-extras-button">
              <img src = {`${order.getExtras()}.png`} /> 
              <Translator  text={order.getExtras()} language={props.CurrentLanguage} mode = {props.mode}/>
              </button>
            
          ))}
          </div>
          <div className='Extras-grid'>
          {!props.fromCombos && extras_list.map((order, index) => (
           
           //Handles sending to cart 
              <button key={index} onClick = { () => UpdateCartorCheckout(order)} className={isAccessibilityMode ? 'accessibility-button-extras' : 'Extras-button'}>
                <img src={`${order.getExtras()}.png`} alt='Extras Items Icons' className={isAccessibilityMode ? 'accessibility-image-extras' : 'extras-image'}/>
                <span> <Translator  text={order.getExtras()} language={props.CurrentLanguage} mode = {props.mode}/> </span>
              </button>
          ))}
          <Popup open = {isCartOpen&&(props.mode !== 'cashier')}
          modal 
          closeOnDocumentClick 
          onClose={() => setCartPopup(false)}>
            <div className='combo-popup-content'>
              <h1>Order has been sent to Cart</h1>
              <button onClick={() => setCartPopup(false)}> Close </button>
            </div>
          </Popup>
        </div>
        </div>
      );

 }

 export default Extras;