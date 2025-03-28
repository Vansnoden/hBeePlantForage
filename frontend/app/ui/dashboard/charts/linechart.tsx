// page.js this is the entry point of application

"use client";
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import { lusitana } from '../../fonts';
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});
const data = {
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'GeeksforGeeks Line Chart',
      data: [65, 59, 80, 81, 56],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
  ],
};
const LineChart = () => {
  return (
    <div style={{ width: '700px', height: '400px' }} className={`${lusitana.className}`}>
      <h1>Distribution line chart</h1>
      <Line data={data} />
    </div>
  );
};
export default LineChart;
