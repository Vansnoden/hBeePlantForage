"use client";

import 'chart.js/auto';
import { lusitana } from '../../fonts';
import { useEffect, createRef } from 'react';
import * as d3 from 'd3';


const SunburstChart = (props: { data: any, width:number, height:number , show_labels: boolean})  => { // eslint-disable-line
    const chartCtnRef = createRef();
    const data = props.data;

    useEffect(() => {
        drawChart()
    })

    const drawChart = () => {
        // Specify the chart’s dimensions.
        const width = props.width;
        const height = props.height;
        const radius = width / 7;
  
        // Create the color scale.
        const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
  
        // Compute the layout.
        const hierarchy = d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a: any, b: any) => { // eslint-disable-line
                if(b && a){
                    return b - a;
                }else {
                    return 0
                }
            });
        const root = d3.partition()
            .size([2 * Math.PI, hierarchy.height + 1])(hierarchy);
        root.each(d => (d as any).current = d);// eslint-disable-line
  
        // Create the arc generator.
        const arc = d3.arc()
            .startAngle(d => (d as any).x0)// eslint-disable-line
            .endAngle(d => (d as any).x1)// eslint-disable-line
            .padAngle(d => Math.min(((d as any).x1 - (d as any).x0) / 2, 0.005))// eslint-disable-line
            .padRadius(radius * 1.5)
            .innerRadius(d => (d as any).y0 * radius)// eslint-disable-line
            .outerRadius(d => Math.max((d as any).y0 * radius, (d as any).y1 * radius - 1))// eslint-disable-line
  
        // Create the SVG container.
        const svg = d3.select((chartCtnRef as any).current) // eslint-disable-line
        svg.selectAll('*').remove()
        svg.attr("viewBox", [-width / 2, -height / 2, width, width])
            .style("font", "10px sans-serif");
  
        // Append the arcs.
        const path = svg.append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .join("path")
            .attr("fill", d => { while (d.depth > 1) (d as any) = d.parent; return color((d as any).data.name); })// eslint-disable-line
            .attr("fill-opacity", d => arcVisible((d as any).current) ? (d.children ? 0.6 : 0.4) : 0)// eslint-disable-line
            .attr("pointer-events", d => arcVisible((d as any).current) ? "auto" : "none")// eslint-disable-line
    
            .attr("d", d => arc((d as any).current));// eslint-disable-line
  
        // Make them clickable if they have children.
        path.filter(d => (d as any).children)// eslint-disable-line
            .style("cursor", "pointer")
            .on("click", clicked);
  
        const format = d3.format(",d");
        path.append("title")
            .text(d => `${d.ancestors().map(d => (d as any).data.name).reverse().join("/")}\n${format((d as any).value)}`);// eslint-disable-line
    
        const label = svg.append("g")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .join("text")
            .attr("dy", "0.35em")
            .attr("fill-opacity", d => +labelVisible((d as any).current))// eslint-disable-line
            .attr("transform", d => labelTransform((d as any).current))// eslint-disable-line
            .text(d => (d as any).data.name);// eslint-disable-line
    
        const parent = svg.append("circle")
            .datum(root)
            .attr("r", radius)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("click", clicked);
    
        // Handle zoom on click.
        function clicked(event: any, p: any) {// eslint-disable-line
            parent.datum(p.parent || root);
        
            root.each(d => (d as any).target = {// eslint-disable-line
                x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                y0: Math.max(0, d.y0 - p.depth),
                y1: Math.max(0, d.y1 - p.depth)
            });
        
            const t = svg.transition().duration(event.altKey ? 7500 : 750);
        
            // Transition the data on all arcs, even the ones that aren’t visible,
            // so that if this transition is interrupted, entering arcs will start
            // the next transition from the desired position.
            path.transition(t)
                .tween("data", d => {// eslint-disable-line
                    const i = d3.interpolate((d as any).current, (d as any).target);// eslint-disable-line
                    return t => (d as any).current = i(t);// eslint-disable-line
                })
                .filter( (d:any) => { // eslint-disable-line
                    return + this.getAttribute("fill-opacity") || arcVisible((d as any).target);// eslint-disable-line
                })
                .attr("fill-opacity", d => arcVisible((d as any).target) ? (d.children ? 0.6 : 0.4) : 0)// eslint-disable-line
                .attr("pointer-events", d => arcVisible((d as any).target) ? "auto" : "none")
                .attrTween("d", d => () => arc((d as any).current));// eslint-disable-line
        
            label.filter((d:any) => {// eslint-disable-line
                return + this.getAttribute("fill-opacity") || labelVisible(d.target);// eslint-disable-line
                }).transition(t)
                .attr("fill-opacity", d => +labelVisible((d as any).target))// eslint-disable-line
                .attrTween("transform", d => () => labelTransform((d as any).current));// eslint-disable-line
        }
        
        function arcVisible(d:any) {// eslint-disable-line
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
        }
    
        function labelVisible(d:any) {// eslint-disable-line
            return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
        }
    
        function labelTransform(d:any) {// eslint-disable-line
            const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
            const y = (d.y0 + d.y1) / 2 * radius;
            return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        }
    
        return svg.node();
    }

    return(
        <div style={{ width: '100%', height: '400px', padding:'0px' }} className={`${lusitana.className}`}>
            <h4><center>Regional distribution of observations</center></h4>
            <svg ref={chartCtnRef}></svg>
        </div>
    )
};
export default SunburstChart;