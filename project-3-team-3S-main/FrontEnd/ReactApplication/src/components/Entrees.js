import './CSS/Entrees.css';
import OrderClass from '../Classes/Orders';
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import PostgresFetcher from '../Classes/PosgresFetcher';
import Translator from './Translator';

const DB = new PostgresFetcher();
const addToCartSound = new Audio('Coins_13.WAV');
addToCartSound.volume = 1.0;

/**
 * Entrees component for displaying and managing entree items in a food ordering system.
 * This component fetches entree data from a database, displays the entrees as buttons, and
 * allows users to select sizes, quantities, and add items to a cart.
 *@component
 * Props:
 * @param {Function} onSelect - Callback function triggered when an entree is selected.
 * @param {boolean} fromCombos - Flag to determine if the component is used as part of combos.
 * @param {boolean} isAccessibilityMode - Flag to toggle accessibility-specific styles.
 * @param {Function} onUpdateOrders - Function to update the cart with the current order.
 * @param {Function} onUpdateCheckout - Function to update the checkout process in cashier mode.
 * @param {string} mode - Current mode of the application (e.g., 'cashier').
 * @param {string} CurrentLanguage - Language for translation using the Translator component.
 * @returns {JSX.Element} - The rendered Entrees component.
 */
function Entrees(props) {
  const { onSelect, fromCombos, isAccessibilityMode } = props;
  const [selectEntree, setEntree] = useState(null);
  const [entrees_list, setEntreesList] = useState([]);
  const [pricing_list, setPricingList] = useState([]);
  const [selectedImageSrc, setSelectedImageSrc] = useState('');
  const [numItems, setNumItems] = useState(1);
  const [isCartOpen, setCartPopup] = useState(false);

  /**
   * Fetches entree data from the database.
   * @returns {Promise<OrderClass[]>} An array of OrderClass instances representing entrees.
   */
  async function GetEntreesFromDatabase() {
    const EntreeNamesList = await DB.CustomSQL("Select * from menu_items where food_type = 'entree' ", 'food_name');
    return Array.from({ length: EntreeNamesList.length }, (_, i) =>
      new OrderClass("Entree", 10.0, [EntreeNamesList[i]])
    );
  }

  /**
   * Fetches entree and pricing data from the database and updates the state.
   */
  useEffect(() => {
    async function WaitOnEntrees() {
      const RetrievedEntrees = await GetEntreesFromDatabase();
      const RetrievedPrices = await DB.CustomSQL(
        "select * from combo_type_enum where type similar to '%Entree%';",
        'base_price'
      );
      setEntreesList(RetrievedEntrees);
      setPricingList(RetrievedPrices);
    }
    WaitOnEntrees();
  }, []);

  /**
   * Updates the cart or checkout state with the provided order.
   * @param {OrderClass} CurrentOrder - The current order to be added.
   * @param {string} Type - The size/type of the entree.
   * @param {number} Price - The price of the entree.
   * @returns {void}
   */
  function UpdateCart(CurrentOrder, Type, Price) {
    Price = parseFloat(Price);
    const OrderInstance = new OrderClass(CurrentOrder.Type + Type, Price, CurrentOrder.EntreeList, CurrentOrder.SideList, CurrentOrder.Extra, CurrentOrder.Drink);

    if (props.mode === 'cashier') {
      props.onUpdateCheckout((prevOrder) => [...prevOrder, OrderInstance]);
    } else {
      props.onUpdateOrders((prevOrder) => [...prevOrder, OrderInstance]);
      setCartPopup(true);
    }
  }

  /**
   * Decreases the number of items in the order, ensuring it remains at least 1.
   * @returns {void}
   */
  const decreaseItems = () => {
    if (numItems > 1) {
      setNumItems((prevNumItems) => prevNumItems - 1);
    }
  };

  /**
   * Increases the number of items in the order.
   * @returns {void}
   */
  const increaseItems = () => {
    setNumItems((prevNumItems) => prevNumItems + 1);
  };

  /**
   * Adds multiple items to the cart based on the selected size and quantity.
   * @param {OrderClass} order - The order to add.
   * @param {string} size - The size of the entree (e.g., 'Small', 'Medium', 'Large').
   * @param {number} price - The price of the entree.
   * @returns {void}
   */
  function addMultipleItems(order, size, price) {
    addToCartSound.currentTime = 0;
    addToCartSound.play();

    if (size === " Small") {
      order.EntreeList = [order.EntreeList[0]];
    } else if (size === " Medium") {
      order.EntreeList = [order.EntreeList[0], order.EntreeList[0]];
    } else if (size === " Large") {
      order.EntreeList = [
        order.EntreeList[0],
        order.EntreeList[0],
        order.EntreeList[0]
      ];
    }

    for (let i = 0; i < numItems; i++) {
      UpdateCart(order, size, price);
    }
  }
 


  return (
          <div className = {props.mode} >
            {fromCombos && entrees_list.map((order, index)=> (
              <button key={index} className="combo-entree-button" onClick={() => onSelect(order.EntreeList[0])}>
               <img alt= {""+ order.EntreeList[0]} src={`${order.EntreeList[0]}.png`}/> <Translator  text={order.EntreeList[0]} language={props.CurrentLanguage} mode = {props.mode}/>
              </button>
            ))}
          {!fromCombos && entrees_list.map((order, index) => ( 

            <Popup
            trigger={
              <button key={index} className={isAccessibilityMode ? 'accessibility-button-entrees' : 'entrees-button'}>
                <img src={`${order.EntreeList[0]}.png`} className={isAccessibilityMode ? 'accessibility-image-entrees' : 'entrees-image'}/>
                <span> <Translator  text={order.EntreeList[0]} language={props.CurrentLanguage} mode = {props.mode}/> </span>
              </button>
            }
            modal
            closeOnDocumentClick
            onOpen={() => {
              setEntree(order.EntreeList[0]);
              setSelectedImageSrc(`${order.EntreeList[0]}.png`); 
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
            {(close) => (
              <div className="my-popup-content">
                <h> <Translator  text={"Select size for " + selectEntree} language={props.CurrentLanguage} mode = {props.mode}/></h>
        
                <img
                  id="dynamicImage"
                  alt="Side Image"
                  width="450"
                  height="300"
                  src={selectedImageSrc}
                />

                <div className="size-buttons">
                  <button className= "IncreaseButton" onClick={decreaseItems}>-</button>
                  <output className='AmountValue'>{numItems}</output>
                  <button className= "DecreaseButton" onClick={increaseItems}>+</button>
                </div>

                <div className="size-buttons">
                  <button className="popup-button" onClick={() => {addMultipleItems(order, " Small", pricing_list[2]); close();}}>
                  <Translator  text="Small" language={props.CurrentLanguage} mode = {props.mode}/> <br /> ${pricing_list[2]}
                  </button> 
                  
                  <button className="popup-button" onClick={() => {addMultipleItems(order, " Medium", pricing_list[1]); close();}}>
                  <Translator  text="Medium" language={props.CurrentLanguage} mode = {props.mode}/> <br /> ${pricing_list[1]}
                  </button> 

                  <button className="popup-button" onClick={() => {addMultipleItems(order, " Large", pricing_list[0]); close();} }>
                  <Translator  text="Large" language={props.CurrentLanguage} mode = {props.mode}/> <br /> ${pricing_list[0]}
                  </button>
                </div>
              </div>
            )}
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
        
  );

  
}

export default Entrees;
