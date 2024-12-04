"use client";

import 'chart.js/auto';
import { CustomChartData } from '@/app/lib/definitions';
import { Pie } from 'react-chartjs-2';


const PieChart = (props: { data: CustomChartData , show_labels: boolean})  => {
    const title = props.data?.datasets.label;
    const converted_dataset = props.data?.datasets;
    const converted_data = {
        labels: props.data?.labels,
        datasets: JSON.stringify(converted_dataset)?JSON.parse(JSON.stringify(converted_dataset)):[]
    }
    return (
    <div style={{ width: '100%', height: '100%' }}>
        <h1>{title}</h1>
        <Pie options={{
            plugins: {
                legend: {
                    display: props.show_labels,
                    position: "right",
                },
            }
        }} data={converted_data} />
    </div>
    );
};
export default PieChart;