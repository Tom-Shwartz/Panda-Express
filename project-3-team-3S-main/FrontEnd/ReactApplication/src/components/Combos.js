import React, { useEffect, useState } from 'react';
import './CSS/Combos.css';
import Entrees from './Entrees';
import Sides from './Sides';
import Extras from './Extras';
import OrderClass from '../Classes/Orders';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import PostgresFetcher from '../Classes/PosgresFetcher';
import Translator from './Translator';

const DB = new PostgresFetcher();
const addToCartSound = new Audio('Coins_13.WAV');
const selectsound = new Audio('SelectNoise.mp3');
addToCartSound.volume = 1.0;

/**
 * React component for selecting and managing meal combos in a kiosk or cashier system.
 * Allows users to choose a combo type (e.g., Bowl, Plate, Larger Plate), select entrees, sides,
 * and optionally extras, and then add the order to the cart.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.isAccessibilityMode - Enables accessibility mode for the interface.
 * @param {string} props.mode - The mode of operation ('cashier' or other modes).
 * @param {function} props.onUpdateCheckout - Callback to update checkout orders when in cashier mode.
 * @param {function} props.onUpdateOrders - Callback to update orders in other modes.
 * @param {string} props.CurrentLanguage - The language to be used for translations.
 * @returns {JSX.Element} The rendered Combos component.
 */
function Combos(props) {
  const {isAccessibilityMode} = props;
  const buttonLabels = ['Bowl', 'Plate', 'Larger Plate'];
  const [Combolist, setCombolist] = useState([]);
  const [selectCombo, setCombo] = useState("");
  const [selectEntree, setEntree] = useState([]);
  const [selectSides, setSides] = useState([]);
  const [selectExtra, setExtra] = useState([]);
  const [isEntreeOpen,setEntreePopup] = useState(false);
  const [isSidesOpen,setSidesPopup] = useState(false);
  const [isExtraOpen,setExtraPopup] = useState(false);
  const [isCartOpen,setCartPopup] = useState(false);
  const [Comboentreetimes,setComboentreetimes] = useState([]);
  const [Combosidetimes,setCombosidetimes] = useState([]);
  const [priceList,setPrice] = useState([]);
  const [priceListt,setPricee] = useState(0); 
  const [entreeClickCount, setEntreeClickCount] = useState(0);


   /**
   * Fetches combo data from the database.
   *
   * @async
   * @returns {Promise<Array<OrderClass>>} A list of combo orders fetched from the database.
   */
  async function GetCombosFromDatabase(){ 

    const ComboNamesList = await DB.CustomSQL("SELECT * FROM combo_type_enum WHERE type = ANY('{Bowl,Plate,Larger Plate}') ORDER BY CASE type WHEN 'Bowl' THEN 1 WHEN 'Plate' THEN 2 WHEN 'Larger Plate' THEN 3 END;",'type');

    return Array.from({ length: ComboNamesList.length }, (_, i) => 
      new OrderClass([ComboNamesList[i]])
    
    );
  }
  useEffect(()=>{
    async function WaitOnCombos() {
      //gets and sets the Combos for the buttons 
      const RetrievedCombos = await GetCombosFromDatabase();
      setCombolist(RetrievedCombos);

      //gets and sets how many entrees and sides for each combo for the button and for when they are selecting entree and side
      const entreetimes = await DB.CustomSQL("Select * from combo_type_enum where type = ANY('{Bowl,Plate,Larger Plate}') ORDER BY CASE type WHEN 'Bowl' THEN 1 WHEN 'Plate' THEN 2 WHEN 'Larger Plate' THEN 3 END;","entreenumber");
      const sidetimes = await DB.CustomSQL("Select * from combo_type_enum where type = ANY('{Bowl,Plate,Larger Plate}') ORDER BY CASE type WHEN 'Bowl' THEN 1 WHEN 'Plate' THEN 2 WHEN 'Larger Plate' THEN 3 END;","sidenumber");
      setComboentreetimes(entreetimes);
      setCombosidetimes(sidetimes);

      //gets and sets the price for each combo so they can be added to the button.
      const RetrivePrice = await DB.CustomSQL("SELECT * FROM combo_type_enum WHERE type = ANY('{Bowl,Plate,Larger Plate}') ORDER BY CASE type WHEN 'Bowl' THEN 1 WHEN 'Plate' THEN 2 WHEN 'Larger Plate' THEN 3 END;",'base_price');
      setPrice(RetrivePrice);
    }
    WaitOnCombos();
  },[])

  /**
   * Handles the selection of an entree for a the specific combo selected.
   * 
   * @param {string} entree - This saves the selected entree to be added to Entree array.
   * 
   */
  const handleEntree = (entree)  => {    
    addToCartSound.currentTime=0; 
    addToCartSound.play();

    setEntree([...selectEntree,entree]);
    setEntreeClickCount(entreeClickCount + 1);
    // I can set it like im indexing any array to get it to work all i need to do is figure out how to differentiate which combos it is
    if(selectCombo.toString() === buttonLabels[0]) { 
      if(entreeClickCount + 1 === Comboentreetimes[0]) {
        setEntreePopup(false);
        setSidesPopup(true);
        setEntreeClickCount(0);
      }
    } else if(selectCombo.toString() === buttonLabels[1]) {
      if(entreeClickCount + 1 === Comboentreetimes[1]) {
        setEntreePopup(false);
        setSidesPopup(true);
        setEntreeClickCount(0);
      }
    } else {
      if(entreeClickCount + 1 === Comboentreetimes[2]) {
        setEntreePopup(false);
        setSidesPopup(true);
        setEntreeClickCount(0);
      }
    }
  }

  /**
   * Handles the selection of an sides for a the specific combo selected.
   * 
   * @param {string} sides - This saves the selected sides to be added to Sides array.
   * 
   */
  const handleSides = (sides) => {
    addToCartSound.currentTime=0; 
    addToCartSound.play();
    setSides([...selectSides,sides]);
    setEntreeClickCount(entreeClickCount + 1);
    if(selectCombo.toString() === buttonLabels[0]) { 
      if(entreeClickCount + 1 === Combosidetimes[0]) {
        setSidesPopup(false);
        setExtraPopup(true);
        setEntreeClickCount(0);
      }
    } else if(selectCombo.toString() === buttonLabels[1]) {
      if(entreeClickCount + 1 === Combosidetimes[1]) {
        setSidesPopup(false);
        setExtraPopup(true);
        setEntreeClickCount(0);
      }
    } else {
      if(entreeClickCount + 1 === Combosidetimes[2]) {
        setSidesPopup(false);
        setExtraPopup(true);
        setEntreeClickCount(0);
      }
    }
  }

  /**
   * Handles the selection of an extras for a the specific combo selected.
   * 
   * @param {string} extras - This saves the selected extras to be added to extras array.
   * 
   */
  const handleExtra = (extras) => {
    addToCartSound.currentTime=0; 
    addToCartSound.play();
    setExtra(extras);
    setExtraPopup(false);
    setCartPopup(true);
    addToCartSound.currentTime = 0;
    addToCartSound.play();
  }

  /**
   * Skips the selection of extras for a combo if they do not want one.
   * 
   */
  const handleExtraSkip = () => {
    setExtra([]); 
    setExtraPopup(false);
    setCartPopup(true);
    if(selectCombo.toString() == buttonLabels[0]) {
      UpdateCart(priceList[0]);
    } else if(selectCombo.toString() == buttonLabels[1]) {
      UpdateCart(priceList[1]);
    } else {
      UpdateCart(priceList[2]);
    }
    selectsound.currentTime = 0;
    selectsound.play();
  }
  // so i can call cart when side is set
  useEffect(() => {
    if (selectExtra.length > 0) {  
       if(selectCombo.toString() == buttonLabels[0]) {
         UpdateCart(priceList[0]);
       } else if(selectCombo.toString() == buttonLabels[1]) {
         UpdateCart(priceList[1]);
       } else {
        UpdateCart(priceList[2]);
    }
    }
  }, [selectExtra]); 




  /**
   * Updates the cart with the selected combo and its details of entree sides and any extras.
   * @param {number} Price - The price of the selected combo.
   */
  function UpdateCart(Price){
    Price = parseFloat(Price);
    //have to create new instance to avoid multiple items being linked together 
   
      const entreejoin = selectEntree.join(", ");
      const sidejoin = selectSides.join(", ");
      const OrderInstance = new OrderClass(selectCombo, Price, [entreejoin], [sidejoin], [selectExtra], "");
    
    
      if(props.mode === 'cashier'){
        props.onUpdateCheckout(prevOrder => [...prevOrder,OrderInstance]);
      }
      else{
        props.onUpdateOrders(prevOrder => [...prevOrder,OrderInstance]);
      }
  }

  return (
    <div className= {props.mode}>
    <div className={isAccessibilityMode ? 'accessibility-container-combos' : 'combos-container'}>
      
      { Combolist.map((label, index) => (
        <Popup id = "combo"  trigger={<button key={index} className={isAccessibilityMode ? 'accessibility-button-combos' : 'combos-button'} > 
        {props.mode !== "cashier" ? (<img alt='icon showing combos' src={`${label.Type}.png`} className={isAccessibilityMode ? 'accessibility-image-combos' : 'combo-image'} />) : null}

        <br/> <Translator  text={label.Type}  language={props.CurrentLanguage} mode = {props.mode}/> 
        <br/> <Translator  text= "Price" language={props.CurrentLanguage} mode = {props.mode}/>: ${priceList[index]} 
        <br/> {Comboentreetimes[index]} <Translator  text="Entree and" language={props.CurrentLanguage} mode = {props.mode}/> {Combosidetimes[index]}  <Translator  text="Side" language={props.CurrentLanguage} mode = {props.mode}/>
        </button>} 

          modal
          closeOnDocumentClick 
          onOpen={() => {setCombo(label.Type); setEntree([]); setSides([]); setEntreeClickCount(0);}}>
            {(close) =>  ( 
            <div> <h> select Entree for {selectCombo}</h>
            <Entrees onSelect={(entree) => {handleEntree(entree);}} fromCombos = {true} {...props} />
              <button  className='ComboCloseBtn' onClick={close}>Close</button>
            </div> )}
      </Popup>
      ))}
      <Popup id = "SidesCombo" open={isSidesOpen} className='SidesPopup'
      modal 
      closeOnDocumentClick 
      onClose={() => setSidesPopup(false)}>
        <div>
          <h>Select Sides for {selectCombo}</h>
          <Sides onSelect={(sides) => {handleSides(sides); }} fromCombos = {true} {...props}/>
          <button className='ComboCloseBtn' onClick={() => setSidesPopup(false)}>Close</button>
        </div>
      </Popup>

      <Popup id = "ExtrasCombo" open={isExtraOpen} className='ExtrasPopup'
      modal 
      closeOnDocumentClick 
      onClose={() => setExtraPopup(false)}>
        <div>
          <h>Select Extra or skip for {selectCombo}</h>
          <Extras onSelect={(extras) => handleExtra(extras)} fromCombos = {true} {...props}/>
            <button className='SkipBtn' onClick={() => handleExtraSkip()}>Skip Extra</button>
          <button className='ComboCloseBtn' onClick={() => setExtraPopup(false)}>Close</button>
        </div>
      </Popup>

      <Popup  id = "ExtrasCombo" open = {isCartOpen&&(props.mode !== 'cashier')}  className='EntreePopup'
      modal 
      closeOnDocumentClick 
      onClose={() => setCartPopup(false)}>
        <div className='combo-popup-content'>
          <h1>Order has been sent to Cart</h1>
          <button className='ConfrimCloseBtn' onClick={() => setCartPopup(false)}> Close </button>
        </div>

      </Popup>
    </div>
    </div>
  );
}

export default Combos;