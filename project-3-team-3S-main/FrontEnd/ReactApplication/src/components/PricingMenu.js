import React, { useState,useEffect } from "react";
import PostgresFetcher from "../Classes/PosgresFetcher";

import  "./CSS/PricingMenu.css"

const DB = new PostgresFetcher();


function FormatPricingItems(ItemNames,Prices,setSelectedItem,SetNewPrice){
        
    const FormattedItemList = ItemNames.map((ItemName,index) => (
               <div id={index} className="PricingRow" onClick={() => {setSelectedItem([ItemName,Prices[index]]);}}> 
                    <li id={ItemName} className="MenuNames"> {ItemName} </li>
                    <li id={Prices[index]} className="MenuPrices">${Prices[index]}</li>   
                </div>
            ));
            
            
            
            
            
       
    return FormattedItemList;

}
function addtoNewprice(inputInteger,SetNewPrice,NewPrice){
    SetNewPrice(NewPrice+inputInteger);
}
function removefromNewprice(SetNewPrice,NewPrice){
    SetNewPrice(NewPrice.slice(0,-1));
}
function UpdatePrice(SetNewPrice,NewPrice,SetSelectedItem,SelectedItem){
    try {
        DB.CustomSQL(`UPDATE combo_type_enum SET base_price = '${parseFloat(NewPrice)}' where type = '${SelectedItem[0]}'`); 
        SetSelectedItem([SelectedItem[0],parseFloat(NewPrice)]);
        SetNewPrice("");
    } catch (error) {
        alert("Not a valid number for newprice try again");
    }
    
}

 /**
 * Used to generate the Pricing Menu Jsx that allows the updating of prices dynamically
 * @component
 * @example
 * <PricingMenu setPricingState = {SetPricingState}></PricingMenu>
 * @param {Function} setPricingState - updates the state of popup that contains the pricing menu content
 * @returns {JSX.Element} - Returns the jsx for the Pricing Menu 
 */
function PricingMenu({setPricingState}) {

const [MenuItemList,SetMenuItemList] = useState([]); 
const [MenuPrices,SetMenuPrices] = useState([]);
const [NewPrice, SetNewPrice] = useState("");
const [SelectedItem,setSelectedItem] = useState(["",0.00]);
    

    useEffect(()=>{
    async function GetItemNamesAndPricing(){
        
        const ListofItems = await DB.GetColumn("combo_type_enum","type");
        const ListofPrices = await DB.GetColumn("combo_type_enum","base_price");
        //get column returns arrays instead of the array of objects TODO: fix fetcher to do this for the user 
        SetMenuItemList( (await ListofItems).map(items => (items.type)));
        SetMenuPrices( (await  ListofPrices).map(items => (items.base_price)));
    } 

        GetItemNamesAndPricing();
    },[NewPrice,SelectedItem]);



    return(
        <div className="PricingContent">
            <div className="PricingListContainer">
                <ul className="PricingItemsList"> 
                <div className="PricingHeadContainer"> <label> MENU  </label></div>    
                {FormatPricingItems(MenuItemList,MenuPrices,setSelectedItem,SetNewPrice)}
                </ul>
            </div>

            <div className="NewPriceContainer">
                <label className="PricingSelectedItem"> {(SelectedItem[0] === "")? "choose an item to change price": "Selected: "+SelectedItem[0]}  </label>
                <div className="PricesFields">
                    <label> {(SelectedItem[0] === "")? "": "Old Price: $" + (SelectedItem[1])} </label>
                    <br></br>
                    <br></br>
                    <label>NewPrice: $: {NewPrice}</label>
                </div>
                <div className="PricingInputContainer">
                    <div className='Pricing-numpad'>
                        <div className="numpad-group">    
                            <button onClick = {() => addtoNewprice("1",SetNewPrice,NewPrice)}>1</button>
                            <button onClick = {() => addtoNewprice("2",SetNewPrice,NewPrice)}>2</button>
                            <button onClick = {() => addtoNewprice("3",SetNewPrice,NewPrice)} >3</button>
                        </div>

                        <div className="numpad-group" >
                            <button onClick = {() => addtoNewprice("4",SetNewPrice,NewPrice)} >4</button>
                            <button onClick = {() => addtoNewprice("5",SetNewPrice,NewPrice)} >5</button>
                            <button onClick = {() => addtoNewprice("6",SetNewPrice,NewPrice)}  >6</button>
                        </div>

                        <div className="numpad-group">
                            <button onClick = {() => addtoNewprice("7",SetNewPrice,NewPrice)} >7</button>
                            <button onClick = {() => addtoNewprice("8",SetNewPrice,NewPrice)} >8</button>
                            <button onClick = {() => addtoNewprice("9",SetNewPrice,NewPrice)} >9</button>
                        </div>

                        <div className="numpad-group">
                            <button onClick= {() => removefromNewprice(SetNewPrice,NewPrice)} > Back</button>
                            <button onClick = {() => addtoNewprice("0",SetNewPrice,NewPrice)} >0</button>
                            <button onClick = {() => addtoNewprice(".",SetNewPrice,NewPrice)} >.</button>
                        </div>

                        <button className="Confirm-Price" onClick={() => {UpdatePrice(SetNewPrice,NewPrice,setSelectedItem,SelectedItem)}}> Update Price</button>
                 </div>
                </div>
            </div>

        </div>
    );
}

export default PricingMenu