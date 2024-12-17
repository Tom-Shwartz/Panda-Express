import React, { useEffect, useRef, useState } from "react";
import PostgresFetcher from "../Classes/PosgresFetcher";
import "./CSS/ManagerReports.css"
const DB = new PostgresFetcher();


async function GetCurrentTime(){
    return await DB.CustomSQL("SELECT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS') as Today","today")
}

/**
 * Creates the jsx content for the Reports which includes the x and z reports along wiht their respective buttons
 * @component
 * @example
 *  </Reports>
 * @param {}  - no input parameters
 * @returns {JSX.Element} - Returns the jsx for Reports
 */
function Reports(){

    const [ZReportState,SetZreportState] = useState(false)
    const [Zreport,setZreport] = useState(["Click Zreport to generate Zreport"]);

    const [XReportState,SetXreportState] = useState(false)
    const [Xreport,setXreport] = useState(["Click Xreport Button to Generate Xreport"]);
    const [LastRunDate, setLastRunDate] = useState(() => { const storedDate = localStorage.getItem("LastRunDate");  return (storedDate)?storedDate:"2024-12-2 19:15:08"});
    
    //handles the xreport generation
    useEffect(() => {
        if(!XReportState){return;}

        async function GetReportData() {
            var Hours = await DB.CustomSQL(`SELECT date_trunc('hour', hourslist) as HoursSequence FROM generate_series( '${LastRunDate}'::timestamp, CURRENT_TIMESTAMP::timestamp, '1 hour'::interval) hourslist  ORDER BY HoursSequence DESC;`,"hourssequence")
            const numSales = await DB.CustomSQL(`SELECT COUNT( DISTINCT orderid) as NumberOfSales, DATE_TRUNC('hour', orderdate::timestamp ) as HourDate FROM order_history WHERE orderdate::timestamp <=  CURRENT_TIMESTAMP and orderdate::timestamp >= '${LastRunDate}' GROUP BY HourDate ORDER BY HourDate DESC;`,"numberofsales");
            var SalesHours = await DB.CustomSQL( `SELECT COUNT( DISTINCT orderid) as NumberOfSales, DATE_TRUNC('hour', orderdate::timestamp ) as HourDate FROM order_history WHERE orderdate::timestamp <=  CURRENT_TIMESTAMP and orderdate::timestamp >= '${LastRunDate}' GROUP BY HourDate ORDER BY HourDate DESC;`,"hourdate");
           
            Hours = Hours.map(str => str.slice(0,10)+" "+str.slice(11,19));
            SalesHours = SalesHours.map(str => str.slice(0,10)+" "+str.slice(11,19));

            //needed since we need to combine series of hours and sales information
            for (let i = 0; i < Hours.length; i++) {
                let ismatch = false;
               for(let j = 0; j < Hours.length; j++){
                    if( Hours[i] == SalesHours[j]){
                        Hours[i] = SalesHours[j] + " ............ Sales: " + numSales[j];
                        ismatch = true;
                    }
               }
                if(!(ismatch)){
                    Hours[i] += " ............ Sales: 0"
                }
            }

            setXreport(Hours);
            SetXreportState(false);
        }
    
        GetReportData(); 
    },[XReportState]);

    

    //handles the zreport generation
    useEffect(() => {
        
        if(!ZReportState){return;}
        
        async function GetZreport() {
           const Total = parseInt(await  DB.CustomSQL(`SELECT SUM(unique_orders.total_order_cost) AS GrossTotal FROM (SELECT orderid, SUM(totalcost) AS total_order_cost FROM order_history WHERE orderdate::timestamp >= '${LastRunDate}'::timestamp AND orderdate::timestamp <= NOW() GROUP BY orderid) AS unique_orders;`,"grosstotal"));
           const TaxAmount = (Total/1.0825) * 0.0825
           const NetTotal = Total+TaxAmount;
           const CurrentTime = await GetCurrentTime();
           const ZreportList = ["Date: "+ (CurrentTime),"Net Total: ",NetTotal.toFixed(2),"Total Tax Paid: ",TaxAmount.toFixed(2),"Gross Total: ",Total.toFixed(2)]

            

            setLastRunDate(CurrentTime);
            localStorage.setItem("LastRunDate",CurrentTime);
            SetZreportState(false);
            setZreport(ZreportList);
        }
        
        GetZreport();
        
    },[ZReportState]);
    

    return(
        <div className="ReportContents">
            <div className="XreportContents">
                <button className="Xreport-Button" onClick={()=>{SetXreportState(true)}}> Xreport </button>
                <ul className="Xreport-List">
                <li className="Xreport-List-header"> sales per hour </li>
                    {Xreport.map(sales => (
                        <li className="Xreport-List-items"> {sales} </li> 
                    ))}
                </ul>
            </div>

            <div className="ZreportContents">
                <button className="Zreport-Button" onClick={() => {SetZreportState(true)}}> Zreport </button>
                <ul className="Zreport-list">
                {Zreport.map(sales => (
                        <li className="Zreport-List-items"> {sales} </li> 
                    ))}
                </ul>
            </div>
        </div>
    )

}


export default Reports