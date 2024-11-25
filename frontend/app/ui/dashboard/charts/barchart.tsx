//@typescript-eslint/ban-ts-comment

"use client";
// import dynamic from 'next/dynamic';
import 'chart.js/auto';
import { CustomChartData } from '@/app/lib/definitions';
import { Bar } from 'react-chartjs-2';

// const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
//   ssr: false,
// });

const options={
  scales:{
    x: {
        display: false ////this will remove all the x-axis grid lines
    }
  }
}

const BarChart = (props: { data: CustomChartData }) => {
  const converted_dataset = props.data?.datasets;
  const converted_data = {
    labels: props.data?.labels,
    datasets: JSON.stringify(converted_dataset)?JSON.parse(JSON.stringify(converted_dataset)):[]
  }


  return (
    <div style={{ width: '100%', height: '700px' }}>
      <h1>{props.data?.datasets.label}</h1>
      <Bar options={options} 
        data={converted_data}/>
    </div>
  );
};
export default BarChart;
