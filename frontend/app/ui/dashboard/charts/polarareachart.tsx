"use client";
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import { lusitana } from '../../fonts';
const PolarArea = dynamic(() => import('react-chartjs-2').then((mod) => mod.PolarArea), {
  ssr: false,
});

const data = {
    labels: [
    'Red',
    'Green',
    'Yellow',
    'Grey',
    'Blue'
    ],
    datasets: [{
    label: 'My First Dataset',
    data: [11, 16, 7, 3, 14],
    backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(75, 192, 192)',
        'rgb(255, 205, 86)',
        'rgb(201, 203, 207)',
        'rgb(54, 162, 235)'
    ]
    }]
};

const PolarAreaChart = () => {
    return (
    <div style={{ width: '400px', height: '400px' }} className={`${lusitana.className}`}>
        <h1>Distribution Polar Area Chart</h1>
        <PolarArea data={data} />
    </div>
    );
};
export default PolarAreaChart;
