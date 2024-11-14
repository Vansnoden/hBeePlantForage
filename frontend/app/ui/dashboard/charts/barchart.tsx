//@typescript-eslint/ban-ts-comment

"use client";
// import dynamic from 'next/dynamic';
import 'chart.js/auto';
import { CustomChartData } from '@/app/lib/definitions';
import { Bar } from 'react-chartjs-2';

// const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
//   ssr: false,
// });

const test_data={
  // Name of the variables on x-axies for each bar
  labels: ["1st bar", "2nd bar", "3rd bar", "4th bar"],
  datasets: [
      {
          // Label for bars
          label: "total count/value",
          // Data or value of your each variable
          data: [1552, 1319, 613, 1400],
          // Color of each bar
          backgroundColor: 
              ["aqua", "green", "red", "yellow"],
          // Border color of each bar
          borderColor: ["aqua", "green", "red", "yellow"],
          borderWidth: 0.5,
      },
  ],
}

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
    datasets: JSON.parse(JSON.stringify(converted_dataset))
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
