import './CSS/Sides.css';
import OrderClass from '../Classes/Orders';
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Translator from './Translator';
import PostgresFetcher from '../Classes/PosgresFetcher';

const addToCartSound = new Audio('Coins_13.WAV');
addToCartSound.volume = 1.0;
const DB = new PostgresFetcher();

/**
 * Renders the Sides component, allowing users to select sides, customize quantities, and add items to the cart or combos.
 * Includes functionality for accessibility mode and multi-language support.
 * @param {function} onSelect - A callback function triggered when a side is selected.
 * @param {boolean} fromCombos - Indicates if the component is used in combo mode.
 * @param {boolean} isAccessibilityMode - Toggles the accessibility mode for styling.
 * @param {string} CurrentLanguage - The current language for translations.
 * @param {string} mode - The mode of operation, such as 'cashier' or 'customer.'
 * @returns {JSX.Element} - The rendered Sides component.
 */
function Sides(props) {
  const { onSelect, fromCombos, isAccessibilityMode} = props;
  const [selectSide, setSide] = useState(null);
  const [sides_list, setSidesList] = useState([]);
  const [pricing_list, setPricingList] = useState([]);
  const [selectedImageSrc, setSelectedImageSrc] = useState('');
  const [numItems, setNumItems] = useState(1);
  const [isCartOpen,setCartPopup] = useState(false);


  /**
   * Fetches the list of available sides from the database.
   * Creates an array of OrderClass objects for each side.
   * @returns {Promise<OrderClass[]>} - A promise that resolves to an array of OrderClass objects representing sides.
   */
  async function GetSidesFromDatabase() {
    
    const SideNamesList = await DB.CustomSQL("select * from menu_items where food_type = 'side' ",'food_name');
    console.log(SideNamesList[0]);
    
    return Array.from({ length: SideNamesList.length }, (_, i) => 
      new OrderClass("Side", 10.00,[],[SideNamesList[i]])
    
    );

  }

  /**
   * Initializes the sides list and pricing information by fetching data from the database on component mount.
   */
  useEffect(() => {
    async function WaitOnSides() {
      const SideList = await GetSidesFromDatabase();
     const RetrievedPrices  = await DB.CustomSQL("select * from combo_type_enum where type similar to '%Side%';", 'base_price');
      setSidesList(SideList);
      setPricingList(RetrievedPrices);
    }
    WaitOnSides();
  },[])

  /**
   * Updates the cart or checkout with a new order.
   * Creates a new instance of the order to avoid linking multiple items.
   * @param {OrderClass} CurrentOrder - The current order to add to the cart or checkout.
   * @param {string} Type - The type or size of the side (e.g., 'Medium', 'Large').
   * @param {number} Price - The price of the side.
   * @returns {void}
   */
  function UpdateCart(CurrentOrder, Type, Price){

    Price = parseFloat(Price);
    //have to create new instance to avoid multiple items being linked together 
      const OrderInstance = new OrderClass(CurrentOrder.Type + Type, Price, CurrentOrder.EntreeList, CurrentOrder.SideList, CurrentOrder.Extra, CurrentOrder.Drink);
      
      if(props.mode === 'cashier'){
        props.onUpdateCheckout(prevOrder => [...prevOrder,OrderInstance]);
      }
      else{
        props.onUpdateOrders(prevOrder => [...prevOrder,OrderInstance]);  
      }
      
      
  }


  /**
   * Decreases the number of items to add, ensuring the count does not fall below 1.
   * @returns {void}
   */
  const decreaseItems = () => {
    if(numItems > 1){
      setNumItems(prevNumItems => prevNumItems - 1);
    }
  };

  /**
   * Increases the number of items to add.
   * @returns {void}
   */
  const increaseItems = () => {
    setNumItems(prevNumItems => prevNumItems + 1);
  };


  /**
   * Handles the addition of multiple items to the cart.
   * Plays a sound effect and triggers a cart popup when items are added.
   * Adjusts the order's side list based on size.
   * @param {OrderClass} order - The current order to add to the cart.
   * @param {string} size - The size of the side (e.g., 'Medium', 'Large').
   * @param {number} price - The price of the side.
   * @returns {void}
   */
  function addMultipleItems(order, size, price){
    addToCartSound.currentTime = 0;
    addToCartSound.play();
    setCartPopup(true);

    if(size === " Medium"){
      order.SideList = [order.SideList[0],order.SideList[0]];
    }
    else if(size === " Large"){
      order.SideList = [order.SideList[0],order.SideList[0],order.SideList[0]]
    }

    for(let i = 0; i < numItems; i++){
      UpdateCart(order, size, price);
    }
  }

    return (
      <div className={props.mode}>
        
        <div className="Combo-Sides-grid">
        {fromCombos && sides_list.map((order, index)=> (
              <button key={index} className="combo-sides-button" onClick={() => onSelect(order.SideList[0])}>
                <img src = {`${order.SideList[0]}.png`}/>
                <Translator  text={order.SideList[0]} language={props.CurrentLanguage} mode = {props.mode}/>
              </button>
              
            ))}
          </div>
       
      <div className='Sides-grid'>
      {!fromCombos && sides_list.map((order, index) => (
         <Popup
         trigger={
         
            <button key={index} className={isAccessibilityMode ? 'accessibility-button-sides' : 'sides-button'}>
              <img src={`${order.SideList[0]}.png`} className={isAccessibilityMode ? 'accessibility-image-sides' : 'sides-image'}/>
              <span><Translator  text={order.SideList[0]} language={props.CurrentLanguage} mode = {props.mode}/></span>
            </button>
         
        }
         modal
         closeOnDocumentClick
         onOpen={() => {
           setSide(order.SideList[0]);
           setSelectedImageSrc(`${order.SideList[0]}.png`); 
         }}
         contentStyle={{
          width: '450px',
          padding: '20px',
          maxWidth: '90%',
          boxSizing: 'border-box',
          borderRadius: '15px',
          overflow: 'hidden',
        }}
         > 
          {(close) => (<div className="my-popup-content">
            <h><Translator  text= {"Select size for " + selectSide} language={props.CurrentLanguage} mode = {props.mode}/></h>
    
            <img
              id="dynamicImage"
              alt="Side Image"
              width="400"
              height="300"
              src={selectedImageSrc}
            />

            <div className="size-buttons">
              <button className= "IncreaseButton" onClick={decreaseItems}>-</button>
              <output>{numItems}</output>
              <button className= "DecreaseButton" onClick={increaseItems}>+</button>
            </div>
    
            <div className="size-buttons">
              <button className="popup-button" onClick={() => {addMultipleItems(order, " Medium", pricing_list[0]); close()}}>
               <Translator  text="Medium" language={props.CurrentLanguage} mode = {props.mode}/> <br /> ${pricing_list[0]}
              </button> 

              <button className="popup-button" onClick={() =>{ addMultipleItems(order, " Large", pricing_list[1]); close()}}>
              <Translator  text="Large" language={props.CurrentLanguage} mode = {props.mode}/> <br /> ${pricing_list[1]}
              </button>
            </div>
          </div>)}
        </Popup>
        
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

export default Sides;