// page.js this is the entry point of application

"use client";
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import { CustomChartData } from '@/app/lib/definitions';

const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
  ssr: false,
});

const options={
  scales:{
    x: {
        display: false ////this will remove all the x-axis grid lines
    }
  }
}

const BarChart = (props: { data: CustomChartData }) => {
  return (
    <div style={{ width: '100%', height: '700px' }}>
      <h1>{props.data?.datasets.label}</h1>
      <Bar options={options} data={props.data}/>
    </div>
  );
};
export default BarChart;
