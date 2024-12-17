
import React, { useEffect, useRef, useState } from "react";
import PostgresFetcher from "../Classes/PosgresFetcher";
import "./CSS/ManagerOrder.css"
import LineChart from "./ManagerCharts";
const DB = new PostgresFetcher();


function FormatOrders(RawOrderObjects){
   const OrdersList = RawOrderObjects.map((order) => (
    <div className="orderlist-row">
    <li key={order.orderid}>  {order.orderid}   </li>
    <li key={order.orderid}>${order.totalcost}</li>
    <li key={order.orderid}>{order.orderdate}</li>
    </div>
))
    
   return OrdersList;
    
}
/**
 * Creates the Orders content which is made up of a list of recent orders and graph of orders over time
 * @component
 * @example
 * <Orders/>;
 * @param {} - no parameters are needed 
 * @returns {JSX.Element} - Returns the jsx for Orders 
 */
function Orders(){
    
    const [orderperweeksdata_Y,setOrderYdata] = useState([]);
    const [orderperweeksdata_X,setOrderXdata] = useState([]);
    const [RecentOrders,setRecentOrders] = useState([]);
    
    const [timeframe,setTimeframe] = useState("weeks");
 
     useEffect(() => {
         async function GetOrderDataPerweek() {
             const ordersPerweek = await DB.CustomSQL(`select DATE_Trunc('${timeframe}',orderdate::timestamp)::date as OrderTime, Count(orderid) AS TotalOrders from order_history group by Date_trunc('${timeframe}',orderdate::timestamp) Order by OrderTime asc;`,"totalorders");
             const orderX = await DB.CustomSQL(`select DATE_Trunc('${timeframe}',orderdate::timestamp)::date as OrderTime, Count(orderid) AS TotalOrders from order_history group by Date_trunc('${timeframe}',orderdate::timestamp) Order by OrderTime asc;`,"ordertime");
             const ImportedOrders = await DB.CustomSQL("select * from order_history group by orderid order by orderid desc limit 1000;");
            
             console.log(RecentOrders);
             setOrderYdata( ordersPerweek.map(str => parseInt(str)));
             //handles weird data type remenants when improting dates from postgres
             setOrderXdata(orderX.map(str => str.slice(0,10)));
             setRecentOrders(ImportedOrders);
          }
         GetOrderDataPerweek();
     },[]);
 
     return(
        <div className="ManagerOrder-Content">
            <div className="Orders-Chart-Container">
                <LineChart className='SalesChart' Xdata={orderperweeksdata_X} Ydata={orderperweeksdata_Y} Ylabel={"Order Per " + timeframe} ></LineChart>
            </div>
            <div className="Order-History-Container">
                <label className="Orderlist-title"> Recent Order History </label>
                <ul className="RecentOrdersList">
                    <div className="orderlist-row">
                        <li key={1}> ORDER ID:</li>
                        <li key={1}> OrderCost:</li>
                        <li key={1}>DATE:</li>
                    </div>
                    {FormatOrders(RecentOrders)}
                </ul>
            </div>

        </div>
     )    
 }
 export default Orders;