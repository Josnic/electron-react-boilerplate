import React, { useState, useEffect, useRef } from "react";
import ReactApexChart from 'react-apexcharts';
import './styles.scss';

const RadarChart = ({title, series, categories}) =>{
    const chartInstance = useRef();

    const [state, setState] = useState({  
        series: [{
          name: 'Series 1',
          data: [80, 50, 30, 40, 100, 20],
        }],
        options: {
          chart: {
            height: 350,
            type: 'radar',
            toolbar: {
              export: {
                csv: undefined
              }
            },
            locales: [{
              name: "es",
              options: {
              months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
              shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
              shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              toolbar: {
                    exportToSVG: "Descargar SVG",
                    exportToPNG: "Descargar PNG",
                    menu: "Menu",
                    selection: "Selection",
                    selectionZoom: "Selection Zoom",
                    zoomIn: "Zoom In",
                    zoomOut: "Zoom Out",
                    pan: "Panning",
                    reset: "Reset Zoom"
                }
              }
            }],
            defaultLocale: "es"
          },
          title: {
            text: 'Basic'
          },
          xaxis: {
            categories: ['January', 'February', 'March', 'April', 'May', 'June']
          }
        },
      })

      useEffect(()=>{
        if (chartInstance.current){
         chartInstance.current.chart.setLocale('es')
        }
      }, [chartInstance.current])

    return (
        <>
        <ReactApexChart
            ref={chartInstance}
            options={state.options}
            series={state.series}
            type="radar"
            height={350}
          />
        </>
    )
}

export default RadarChart;