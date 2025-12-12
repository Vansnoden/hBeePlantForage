"use client"

import { searchFamilyNames, getPlantTopX, getYearlyObsDistro, getFamilyData, getFamilyDataMax } from "@/app/lib/client_actions";
import { CustomChartData } from "../../lib/definitions";
import BarChart from "../../ui/dashboard/charts/barchart";
import MiniMapComponent from "../../ui/dashboard/mini_map";
import { lusitana } from "../../ui/fonts";
import { useState, useEffect, useRef } from 'react';
import clsx from "clsx";
// import SunburstChart from "./charts/sunburst";
// getYearAggregate


export default function StatsComponent(){

    const [currentFamilyName, setCurrentFamilyName] = useState("");
    const [currentFocusZone, setcurrentFocusZone] = useState("");
    const [familyNames, setFamilyNames] = useState<Array<string>>([]);
    const [dropdowVisibility, toggleDropdowVisibility] = useState(false);
    const [mapVisibility, toggleMapVisibility] = useState(false); // eslint-disable-line
    const searchInput = useRef<HTMLInputElement>(null);
    const startYearInput = useRef<HTMLInputElement>(null);
    const endYearInput = useRef<HTMLInputElement>(null);
    const focusZoneSelect = useRef<HTMLSelectElement>(null);
    const [plantTop, setPlantTop] = useState<CustomChartData>();
    const [yearDistro, setYearDistro] = useState<CustomChartData>();
    const [yearDistroGlobal, setYearDistroGlobal] = useState<CustomChartData>(); // eslint-disable-line
    const [regionObsDistroGlobal, setRegionObsDistroGlobal] = useState<CustomChartData>(); // eslint-disable-line
    const [startYear, setStartYear] = useState(2005);
    const [endYear, setEndYear] = useState(2025);
    const [geojsonData, setGeojsonData] = useState({});
    const [familyMax, setFamilyMax] = useState(0);
    const [isLoading, setLoading] = useState(false); // eslint-disable-line
    const testData = {
        name: "root",
        children: [
            {
                name:'level 1',
                children: [
                    {
                        name:'level 1.1',
                        value: 4
                    },
                    {
                        name:'level 1.2',
                        value: 1
                    },
                    {
                        name:'level 1.3',
                        value: 5
                    }
                ]
            },
            {
                name:'level 2',
                children: [
                    {
                        name:'level 2.1',
                        value: 10
                    },
                    {
                        name:'level 2.2',
                        value: 3
                    }
                ]
            },
            {
                name:'level 3',
                children: [
                    {
                        name:'level 3.1',
                        value: 4
                    },
                    {
                        name:'level 3.2',
                        value: 3
                    },
                    {
                        name:'level 3.3',
                        value: 3
                    },
                    {
                        name:'level 3.4',
                        value: 3
                    },
                ]
            }
        ]
    }
    const [yearAgg, setYearAgg] = useState(testData); // eslint-disable-line

    const updateSearch = (evt: any) => { // eslint-disable-line
        const familyName = evt.target.getAttribute("value");
        setCurrentFamilyName(familyName);
        toggleDropdowVisibility(false);
        if(searchInput.current){
            searchInput.current.value = familyName;
        }
        const getData = async ()=>{
            const familyData = await getFamilyData(familyName).then((geojsonD) => { // eslint-disable-line
                setGeojsonData(geojsonD);
            });
            const top20 = await getPlantTopX(familyName, currentFocusZone, 20);
            const max = await getFamilyDataMax(familyName);
            setPlantTop(top20);
            setFamilyMax(max);
        }
        getData().catch(console.error);
    }

    const onStartYearChange = (evt: any) => {// eslint-disable-line
        setStartYear(evt.target.value);
    }

    const onEndYearChange = (evt: any) => {// eslint-disable-line
        setEndYear(evt.target.value);
    }

    const searchFamilyData = (evt: any) => { // eslint-disable-line
        searchFamilyNames(evt.target.value).then((families) => {
            setFamilyNames(families);
            toggleDropdowVisibility(true);
        })
    }

    const zoneOnChangeHandler = () => {
        const refreshData = async ()=> {
            setYearDistroGlobal(await getYearlyObsDistro('', '', startYear, endYear));
            if(focusZoneSelect.current && searchInput.current){
                setcurrentFocusZone(focusZoneSelect.current?.value);
                // setRegionObsDistroGlobal(await getRegionObsDistro(focusZoneSelect.current?.value || '', searchInput.current?.value, startYear, endYear));
                setYearDistro(await getYearlyObsDistro(focusZoneSelect.current?.value, searchInput.current?.value, startYear, endYear))
                // setYearAgg(await getYearAggregate(focusZoneSelect.current?.value, searchInput.current?.value, startYear, endYear))
                setPlantTop(await getPlantTopX(searchInput.current?.value, focusZoneSelect.current?.value, 20));
            }
        }
        refreshData()
        .catch(console.error)
    }

    useEffect(() => {
        setLoading(true);
        if(searchInput.current){
            setCurrentFamilyName(searchInput.current?.value);
        }
        const refreshData = async ()=> {
            setYearDistroGlobal(await getYearlyObsDistro('', '', startYear, endYear));
            if(focusZoneSelect.current && searchInput.current){
                // setRegionObsDistroGlobal(await getRegionObsDistro(focusZoneSelect.current?.value, searchInput.current?.value, startYear, endYear));
                setYearDistro(await getYearlyObsDistro(focusZoneSelect.current?.value, searchInput.current?.value, startYear, endYear))
                // setYearAgg(await getYearAggregate(focusZoneSelect.current?.value, searchInput.current?.value, startYear, endYear))
            }
            setPlantTop(await getPlantTopX(currentFamilyName, currentFocusZone, 20));
            setGeojsonData(await getFamilyData(currentFamilyName));
        }
        refreshData().then(()=>{
            setLoading(false);
        })
        .catch(console.error)
    }, [currentFamilyName, startYear, endYear])


    // if (isLoading) return <p>Loading data...</p>

    return (
        <div>
            <div className="">
                <div className="card mb-2 bg-yellow-600 rounded flex gap-2 p-2">
                    <div className={`${lusitana.className} relative`}>
                        <span>Country distribution of plant species family</span><br/>
                        <div className="flex flex-row justify-between align-middle">
                            <input type="text" placeholder="Start typing family name here" 
                                onKeyUp={searchFamilyData} defaultValue={currentFamilyName} ref={searchInput}
                                className="p-1 rounded text-sm"/>
                        </div>
                        <ul className={clsx("bg-gray-50 drop-shadow mdropdown rounded",
                            {
                                'hidden': dropdowVisibility === false,
                                'block': dropdowVisibility === true,
                            }
                        )}>
                            {/* search results go here */}
                            {familyNames.map((item:string, index:number) =>
                                <li key={index} value={item} onClick={updateSearch} className="bg-white hover:bg-yellow-500 bottom-1">
                                    {item}
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className={`${lusitana.className} ml-2 relative border-left`}>
                        <span>Select Zone of interest</span><br/>
                        <select
                            id="zone"
                            name="zone_id"
                            defaultValue="Global"
                            ref={focusZoneSelect}
                            onChange={zoneOnChangeHandler} 
                            className="px-2 block w-full cursor-pointer rounded-md border py-1 border-gray-200 bg-white text-sm outline-2 placeholder:text-gray-500"
                            >
                            <option key={0} value="">
                                Global   
                            </option>
                            <option key={1} value="America">
                                America    
                            </option>
                            <option key={2} value="Africa">
                                Africa    
                            </option>
                            <option key={3} value="Europe">
                                Europe    
                            </option>
                            <option key={4} value="Asia">
                                Asia    
                            </option>
                            <option key={5} value="Oceania">
                                Oceania    
                            </option>
                        </select>
                    </div>
                    <div className={`${lusitana.className} ml-2 relative border-left`}>
                        <span>Start year</span><br/>
                        <input type="number" placeholder="Start year" 
                                onBlur={onStartYearChange} defaultValue={startYear} ref={startYearInput}
                                className="p-1 rounded text-sm"/>
                    </div>
                    <div className={`${lusitana.className} ml-2 relative border-left`}>
                        <span>End year</span><br/>
                        <input type="number" placeholder="End year" 
                                onBlur={onEndYearChange} defaultValue={endYear} ref={endYearInput}
                                className="p-1 rounded text-sm"/>
                    </div>
                </div>
                <div>
                    <span className={`${lusitana.className} mb-2`}>Distribution per country of plants of the {currentFamilyName} family</span>
                    <MiniMapComponent familyName={currentFamilyName} geojsonData={geojsonData} max={familyMax}/>
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                <BarChart data={plantTop} show_labels={true}/>
                <BarChart data={yearDistro} show_labels={true}/>
                {/* <BarChart data={yearDistroGlobal} show_labels={true}/> */}
                {/* <PieChart data={regionObsDistroGlobal} width={700} show_labels={true}/> */}
                { !plantTop && <p>Loading regional distribution of reported plants ...</p> }
                {/* { plantTop &&  <SunburstChart data={yearAgg} width={700} height={700} show_labels={true}/>} */}
            </div>
        </div>
    )
}