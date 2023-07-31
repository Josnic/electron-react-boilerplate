import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import ReactApexChart from 'react-apexcharts';
import { SpanishLocale } from '../../utils/apexChartLocales';
import './styles.scss';

const BarChart = forwardRef(({ title, series, categories }, ref) => {
  const chartInstance = useRef();

  var colors = ['#BD2230', '#F8B237', '#138F38', '#0F70B7'];

  const state = {
    series: series,
    options: {
      chart: {
        height: 350,
        type: 'bar',
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          },
        },
        locales: [SpanishLocale],
        defaultLocale: 'es',
      },
      title: {
        text: title,
        align: 'center',
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          fontFamily: undefined,
          color: '#263238',
        },
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: colors,
            fontSize: '12px',
          },
        },
      },
    },
  };

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.chart.setLocale('es');
      //exportToBase64();
    }
  }, [chartInstance.current]);

  const exportToBase64 = async () => {
    await chartInstance.current.chart.dataURI().then((data) => {
      console.log(data);
    });
    const paper = chartInstance.current.chart.w.globals.dom.Paper;
    const svg = paper.svg();
    console.log(svg);
  };

  const getBase64Image = async () => {
    return await chartInstance.current.chart.dataURI();
  };

  React.useImperativeHandle(ref, () => ({
    getBase64Image: getBase64Image,
  }));

  return (
    <>
      <ReactApexChart
        ref={chartInstance}
        options={state.options}
        series={state.series}
        type="bar"
        width={500}
        height={400}
      />
    </>
  );
});

export default BarChart;
