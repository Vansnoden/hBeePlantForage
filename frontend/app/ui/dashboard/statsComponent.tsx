"use client"

import { getAllFamilyNames, getDashboardData, getFamilyData, getFamilyDataMax } from "@/app/lib/client_actions";
import { DashboardData } from "@/app/lib/definitions";
import BarChart from "@/app/ui/dashboard/charts/barchart";
// import LineChart from "@/app/ui/dashboard/charts/linechart";
import PieChart from "@/app/ui/dashboard/charts/piechart";
import MiniMapComponent from "@/app/ui/dashboard/mini_map";
import { lusitana } from "@/app/ui/fonts";
import { useState, useEffect } from 'react'

// import PolarAreaChart from "@/app/ui/dashboard/charts/polarareachart";

export default function StatsComponent(props:{token: string}){

    const [currentFamilyName, setCurrentFamilyName] = useState("");
    const [dashData, setDashData] = useState<DashboardData>();
    const [geojsonObject, setGeojsonObject] = useState({});
    const [familyMax, setFamilyMax] = useState(0);
    const [familyNames, setFamilyNames] = useState<Array<string>>([]);

    useEffect(() => {
        setCurrentFamilyName("Acanthaceae");
        setDashData(getDashboardData(props.token, currentFamilyName));   
        setGeojsonObject(getFamilyData(props.token, currentFamilyName));
        setFamilyMax(getFamilyDataMax(props.token, currentFamilyName));
        setFamilyNames(getAllFamilyNames(props.token, ));
    }, [currentFamilyName])

    const onChangeHandler = (evt: any) => {
        console.log(evt.target.value);
    }
    

    return (
        <div>
            <div className="">
                <div className="card mb-2 bg-yellow-600 rounded flex gap-2 p-2">
                    <div className={`${lusitana.className} relative`}>
                        <span>Country distribution of plant specie family</span>
                        <select
                            id="family"
                            name="family_id"
                            defaultValue={currentFamilyName}
                            onChange={onChangeHandler} 
                            className="block w-full cursor-pointer rounded-md border py-2 border-gray-200 bg-white text-sm outline-2 placeholder:text-gray-500"
                            >
                            {familyNames.map((item:string, index:number) =>
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            )}
                        </select>
                    </div>
                </div>
                <MiniMapComponent geojsonObject={geojsonObject} max={familyMax}/>
            </div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {/* <BarChart data={dashData?.sites_per_country} show_labels={true}/> */}
                <BarChart data={dashData?.top_20_plants} show_labels={true}/>
                {/* <BarChart data={dashData?.obs_montly_distro} show_labels={true}/> */}
                <BarChart data={dashData?.obs_10_year_overview} show_labels={true}/>
                {/* <PieChart data={dashData?.obs_per_region} show_labels={true} /> */}
            </div>
        </div>
    )
}