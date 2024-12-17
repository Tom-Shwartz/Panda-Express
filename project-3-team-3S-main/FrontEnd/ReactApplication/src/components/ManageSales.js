import React, { useState, useEffect } from 'react';
import './CSS/ManageSales.css';
import PostgresFetcher from '../Classes/PosgresFetcher';
import Popup from 'reactjs-popup';
import PricingMenu from './PricingMenu';


const DB = new PostgresFetcher();

/**
 * React component that manages and displays sales data including the most popular
 * and least popular items based on order history. Provides a button to access a
 * pricing menu for changing item pricing.
 *
 * @component
 * @returns {JSX.Element} The rendered ManageSales component.
 */
function ManageSales() {
    const [asccounts, setascCounts] = useState([]);
    const [ascitemNames, setascitemNames] = useState(["Loading....."]);
    const [desccounts, setdescCounts] = useState([]);
    const [descitemNames, setdescitemNames] = useState(["Loading...."]);
    const [PricingState,SetPricingState] = useState(false);

    useEffect (() => {
        /**
         * Fetches sales data from the database of the most and least popular item and updates component state.
         * @async
         */
        async function waitonitemList() {
            const itemcountlist = await DB.CustomSQL("select count(item_name) , cb.item_name from order_history join order_items as oi on oi.orderid = order_history.orderid join combo_items as cb on cb.comboid = oi.item group by cb.item_name order by count ASC;",'count');
            const itemnamelist = await DB.CustomSQL("select count(item_name) , cb.item_name from order_history join order_items as oi on oi.orderid = order_history.orderid join combo_items as cb on cb.comboid = oi.item group by cb.item_name order by count ASC;",'item_name');
            const descitemcountlist = await DB.CustomSQL("select count(item_name) , cb.item_name from order_history join order_items as oi on oi.orderid = order_history.orderid join combo_items as cb on cb.comboid = oi.item group by cb.item_name order by count DESC;",'count');
            const descitemnamelist = await DB.CustomSQL("select count(item_name) , cb.item_name from order_history join order_items as oi on oi.orderid = order_history.orderid join combo_items as cb on cb.comboid = oi.item group by cb.item_name order by count DESC;",'item_name');

            setascCounts(itemcountlist);
            setascitemNames(itemnamelist.map(str => {return str.split(',')[0]}));
            setdescCounts(descitemcountlist);
            setdescitemNames(descitemnamelist.map(str => {return str.split(',')[0]}));
        }
        waitonitemList();

    }, [])


    
    return (
        <div className="manage-sales-container">
            <h1 className="title">Sales</h1>
            <div className="sales-grid">
                <div className="list most-popular">
                <h3>Most Popular Items</h3>
                <ul>
                    {asccounts.map((item, index) => (
                    <li key={index}>
                        {descitemNames[index]}
                    </li>
                    ))}
                </ul>
                </div>

                <div className="list least-popular">
                <h3>Least Popular Items</h3>
                <ul>
                    {desccounts.map((item, index) => (
                    <li key={index}>
                        {ascitemNames[index]}
                    </li>
                    ))}
                </ul>
                </div>

                <Popup  contentStyle={{ background: 'transparent', border:'none',width:'75vw'}} open={PricingState} onClose={() => SetPricingState(false)}> 
                        <PricingMenu></PricingMenu>
                </Popup>
                <div className="pricing-container">
                <button className="change-pricing-btn" onClick={() =>{SetPricingState(true)}}>Change Pricing</button>
                </div>
            </div>
        </div>
    );
}


export default ManageSales;

