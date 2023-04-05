import React, { useState, useEffect, useRef } from "react";
import ReactApexChart from 'react-apexcharts';
import { SpanishLocale } from '../../utils/apexChartLocales';
import './styles.scss';

const BarChart = ({title, series, categories}) =>{
    const chartInstance = useRef();

    var colors = [
        '#FF4560',
        '#FEB019',
        '#00E396',
        '#008FFB',
      ]

    const [state, setState] = useState({
          
        series: [{
            name:'',
          data: [21, 22, 10, 28]
        }],
        options: {
          chart: {
            height: 350,
            type: 'bar',
            events: {
              click: function(chart, w, e) {
                // console.log(chart, w, e)
              }
            },
            locales: [SpanishLocale],
            defaultLocale: "es"
          },
          title: {
            text: "Su nivel DISC",
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
          colors: colors,
          plotOptions: {
            bar: {
              columnWidth: '45%',
              distributed: true,
            }
          },
          dataLabels: {
            enabled: false
          },
          legend: {
            show: false
          },
          xaxis: {
            categories: [
              'D',
              'I',
              'S',
              'C'
            ],
            labels: {
              style: {
                colors: colors,
                fontSize: '12px'
              }
            }
          }
        },
      
      
      })

      useEffect(()=>{
        if (chartInstance.current){
         //chartInstance.current.chart.setLocale('es')
         exportToBase64();
        }
      }, [chartInstance.current])

      const exportToBase64 = async () => {
        await chartInstance.current.chart.dataURI().then(data =>{
          console.log(data)
        })
        const paper = chartInstance.current.chart.w.globals.dom.Paper;
        const svg = paper.svg()
        console.log(svg)
      }

    return (
        <>
            <ReactApexChart
                ref={chartInstance}
                options={state.options}
                series={state.series}
                type="bar"
                height={350}
          />
        </>
    )
}

export default BarChart;