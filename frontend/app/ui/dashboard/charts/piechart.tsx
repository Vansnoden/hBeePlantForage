"use client";

import 'chart.js/auto';
import { CustomChartData } from '@/app/lib/definitions';
import { Pie } from 'react-chartjs-2';
import { lusitana } from '../../fonts';
import { useEffect } from 'react';
// import * as d3 from 'd3';



const PieChart = (props: { data: CustomChartData | undefined, width: number, show_labels: boolean})  => {
    const title = props.data? props.data.datasets[0].label: 'no title';
    const converted_dataset = props.data?.datasets;
    const converted_data = {
        labels: props.data?.labels,
        datasets: JSON.stringify(converted_dataset)?JSON.parse(JSON.stringify(converted_dataset)):[]
    }

    // const chartCtnRef = createRef();
    // const data = props.data;

    useEffect(() => {
        // drawChart()
    })

    // const drawChart = () => {
    //     // Specify the chart’s dimensions.
    //     const width = props.width;
    //     const height = Math.min(width, 500);

    //     // Create the color scale.
    //     const color = d3.scaleOrdinal()
    //         .domain(data?.map(d => d.label))
    //         .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data?.length).reverse())

    //     // Create the pie layout and arc generator.
    //     const pie = d3.pie()
    //         .sort(null)
    //         .value(d => d.value);

    //     const arc = d3.arc()
    //         .innerRadius(0)
    //         .outerRadius(Math.min(width, height) / 2 - 1);

    //     const labelRadius = arc.outerRadius()() * 0.8;

    //     // A separate arc generator for labels.
    //     const arcLabel = d3.arc()
    //         .innerRadius(labelRadius)
    //         .outerRadius(labelRadius);

    //     const arcs = pie(data);

    //     // Create the SVG container.
    //     const svg = d3.select(chartCtnRef.current) 
    //     svg.selectAll('*').remove()
    //     svg.attr("width", width)
    //         .attr("height", height)
    //         .attr("viewBox", [-width / 2, -height / 2, width, height])
    //         .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    //     // Add a sector path for each value.
    //     svg.append("g")
    //         .attr("stroke", "white")
    //         .selectAll()
    //         .data(arcs)
    //         .join("path")
    //         .attr("fill", d => color(d.data.label))
    //         .attr("d", arc)
    //         .append("title")
    //         .text(d => `${d.data.label}: ${d.data.value.toLocaleString("en-US")}`);

    //     // Create a new arc generator to place a label close to the edge.
    //     // The label shows the value if there is enough room.
    //     svg.append("g")
    //         .attr("text-anchor", "middle")
    //         .selectAll()
    //         .data(arcs)
    //         .join("text")
    //         .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
    //         // .call(text => text.append("tspan")
    //         //     .attr("y", "-0.4em")
    //         //     .attr("font-weight", "bold")
    //         //     .text(d => d.data.label))
    //         // .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
    //         //     .attr("x", 0)
    //         //     .attr("y", "0.7em")
    //         //     .attr("fill-opacity", 0.7)
    //         //     .text(d => d.data.value.toLocaleString("en-US")));

    //     return svg.node();
    // }

    return (
    <div style={{ width: '100%', height: '100%', padding:'0px' }} className={`${lusitana.className}`}>
        <Pie options={{
            plugins: {
                legend: {
                    display: props.show_labels,
                    position: "right",
                },
                title: {
                    display: true,
                    text: title
                }
            }
        }} data={converted_data} />
        {/* <svg ref={chartCtnRef}></svg> */}
    </div>
    );
};
export default PieChart;