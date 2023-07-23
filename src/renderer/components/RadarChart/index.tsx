import React, { useState, useEffect, useRef } from "react";
import ReactApexChart from 'react-apexcharts';
import { SpanishLocale } from '../../utils/apexChartLocales';
import './styles.scss';

const RadarChart = ({title, series, categories}) =>{
    const chartInstance = useRef();
    console.log(title, series, categories)
    const state = {  
        series: series,
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
            text: title,
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
            categories: categories
          }
        },
      }

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
            width={700}
            height={500}
          />
        </>
    )
}

export default RadarChart;