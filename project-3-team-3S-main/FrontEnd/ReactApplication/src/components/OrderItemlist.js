    // List each attribute of the order item
import React from "react";
import Translator from "./Translator";

/**
 * Used to output what is in an ordered item
 * @param {string} item - item being added
 * @param {String} CurrentLanguage - Used to specify what language to translate to
 * @param {String} mode - Used to manipulate Translation api usage 
 * @returns {JSX.Element} - Rendered component
 */
function orderItemList(item,CurrentLanguage,mode){

    let listDrink = <></>;
    let listExtra = <></>;
    const listEntrees = item.EntreeList.map((foodItem, index) => <li className="listItem" key={index}>
    <Translator  text="Entrees" language={CurrentLanguage}/>: {foodItem} </li>);

    const listSides = item.SideList.map((foodItem, index) => <li className="listItem" key={index}>
    Side: {foodItem} </li>);

    if(item.Drink !== ""){
        listDrink = <li className="listItem"> 
        <Translator  text="Drink" language={CurrentLanguage}/>: <Translator  text={item.Appetizer} language={CurrentLanguage} mode = {mode}/>:  <Translator  text={item.Drink} language={CurrentLanguage} mode = {mode}/>:<Translator  text={item.Appetizer} language={CurrentLanguage} mode = {mode}/> </li>;
    }

    if(item.Appetizer != ""){
        listExtra = <li className="listItem"> 
        <Translator  text="Extras" language={CurrentLanguage}/>: <Translator  text={item.Appetizer} language={CurrentLanguage} mode = {mode}/> </li>;
    }

    return(
        <ul>
            {listEntrees} 
            {listSides}
            {listDrink}
            {listExtra}
        </ul>
        
    );
}

export default orderItemList;