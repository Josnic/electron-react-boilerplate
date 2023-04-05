import React, { useState, useEffect, useRef } from "react";
import ReactApexChart from 'react-apexcharts';
import { SpanishLocale } from '../../utils/apexChartLocales';
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
            locales: [SpanishLocale],
            defaultLocale: "es"
          },
          title: {
            text: "Mapa situacional",
            align: 'center',
            margin: 10,
            offsetX: 0,
            offsetY: 0,
            floating: false,
            style: {
              fontSize:  '20px',
              fontWeight:  'bold',
              fontFamily:  undefined,
              color:  '#263238'
            },
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

      const exportToBase64 = async () => {
        await chartInstance.current.chart.dataURI().then(data =>{
          console.log(data)
        })
      }

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