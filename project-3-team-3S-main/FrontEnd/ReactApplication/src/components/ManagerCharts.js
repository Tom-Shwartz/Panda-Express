import React, { useEffect, useRef } from "react";
import PostgresFetcher from "../Classes/PosgresFetcher";
import { Chart, registerables } from 'chart.js';
import { Line } from "react-chartjs-2";

/**
 * Component that is used to generate the chart for manager orders
 * @component
 * @example
 * <LineChart className='SalesChart' Xdata={orderperweeksdata_X} Ydata={orderperweeksdata_Y} Ylabel={"Order Per " + timeframe} ></LineChart>
 * @param {Array} Xdata - the xdata values for the chart
 * @param {Array} Ydata - the ydata values for the chart
 * @param {Array} Ylabel - the label used by the y data
 * @param {String} BackgroundColor - the color chart background in 'rgba(1,1,1,2)' format
 * @param {String} LineColor - the color for the line in 'rgba(1,1,1,2)' format
 * @returns {JSX.Element} - Returns the jsx for the created Chart 
 */
function LineChart({Xdata,Ydata,Ylabel,BackgroundColor="rgba(210, 0, 210,1)",LineColor ="rgba(0,0,0,1)"}){
    Chart.register(...registerables);

    const LineChartref = useRef(null);

    useEffect(() => {
        const contex = LineChartref.current.getContext('2d');
   

        const chart = new Chart(contex,{
            type: 'line', //DEBUG: available types (bar,line,pie)
            data: {
                labels : Xdata,
                datasets:[
                    {
                        label: Ylabel,
                        data: Ydata,
                        backgroundColor: BackgroundColor,
                        borderColor: LineColor,
                        borderWidth: 5,
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                layout: {
                   
                },
                scales: {
                    x: {
                        title: {
                            text: "Weeks",
                            display: true
                        }
                    },
                    y: {
                        title:{ 
                            text: "Total Number of Orders",
                            display: true
                        }
                    }
                }
            }
        });

        //used for cleanup
        return () =>{
            chart.destroy()
        }

    },[Xdata,Ydata,Ylabel,LineColor,BackgroundColor])



    return <canvas ref={LineChartref}/>
}
export default LineChart;