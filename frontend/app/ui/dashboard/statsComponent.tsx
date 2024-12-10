"use client"

import { searchFamilyNames, getPlantTopX, getRegionObsDistro, getYearlyObsDistro } from "@/app/lib/client_actions";
import { CustomChartData } from "@/app/lib/definitions";
import BarChart from "@/app/ui/dashboard/charts/barchart";
import MiniMapComponent from "@/app/ui/dashboard/mini_map";
import { lusitana } from "@/app/ui/fonts";
import { useState, useEffect, useRef } from 'react';
import clsx from "clsx";
import PieChart from "./charts/piechart";


// async function updateGeoJSON(olsdGeoJSON, formData) {
//     return previousState + 1;
// }


export default function StatsComponent(props:{token: string}){

    const [currentFamilyName, setCurrentFamilyName] = useState("");
    const [familyNames, setFamilyNames] = useState<Array<string>>([]);
    const [dropdowVisibility, toggleDropdowVisibility] = useState(false);
    const [mapVisibility, toggleMapVisibility] = useState(false);
    const searchInput = useRef<HTMLInputElement>(null);
    const focusZoneSelect = useRef<HTMLSelectElement>(null);
    const [plantTop, setPlantTop] = useState<CustomChartData>();
    const [yearDistro, setYearDistro] = useState<CustomChartData>();
    const [yearDistroGlobal, setYearDistroGlobal] = useState<CustomChartData>();
    const [regionObsDistroGlobal, setRegionObsDistroGlobal] = useState<CustomChartData>();
    const startYear = 2015;
    const endYear = 2025

    // useEffect(() => {
    //     console.log(familyNames);
    // }, [familyNames])

    const updateSearch = (evt: any) => { // eslint-disable-line
        const familyName = evt.target.getAttribute("value");
        if(searchInput.current){
            searchInput.current.value = familyName;
            setCurrentFamilyName(familyName);
            const fetchData = async () => { 
                setPlantTop(await getPlantTopX(props.token, currentFamilyName, 20));
                const data = await searchFamilyNames(props.token, currentFamilyName)
                setFamilyNames(data);
            }
            fetchData().then(() => {
                toggleDropdowVisibility(false);
                toggleMapVisibility(true);
            })
            .catch(console.error);
        }
    }

    const searchFamilyData = (evt: any) => { // eslint-disable-line
        setCurrentFamilyName(evt.target.value);
        const fetchData = async () => {
            const data = await searchFamilyNames(props.token, evt.target.value)
            setFamilyNames(data);
        }
        fetchData().then(() => {
            toggleDropdowVisibility(true);
        }).catch(console.error);
    }


    const zoneOnChangeHandler = () => {
        const refreshData = async ()=> {
            setRegionObsDistroGlobal(await getRegionObsDistro(props.token, focusZoneSelect.current?.value || ''));
            setYearDistroGlobal(await getYearlyObsDistro(props.token, '', startYear, endYear));
            if(focusZoneSelect.current){
                setYearDistro(await getYearlyObsDistro(props.token, focusZoneSelect.current?.value, startYear, endYear))
            }
        }
        refreshData()
        .catch(console.error)
    }

    useEffect(() => {
        if(searchInput.current){
            setCurrentFamilyName(searchInput.current?.value);
        }
        const refreshData = async ()=> {
            setRegionObsDistroGlobal(await getRegionObsDistro(props.token, ''));
            setYearDistroGlobal(await getYearlyObsDistro(props.token, '', startYear, endYear));
            if(focusZoneSelect.current){
                setYearDistro(await getYearlyObsDistro(props.token, focusZoneSelect.current?.value, startYear, endYear))
            }
            setPlantTop(await getPlantTopX(props.token, currentFamilyName, 20));
        }
        refreshData()
        .catch(console.error)
    }, [searchInput, focusZoneSelect, currentFamilyName])

    
    return (
        <div>
            <div className="">
                <div className="card mb-2 bg-yellow-600 rounded flex gap-2 p-2">
                    <div className={`${lusitana.className} relative`}>
                        <span>Country distribution of plant specie family</span><br/>
                        <div className="flex flex-row justify-between align-middle">
                            <input type="text" placeholder="Start typing family name here" 
                                onChange={searchFamilyData} defaultValue={currentFamilyName} ref={searchInput}
                                className="p-1 rounded text-sm"/>
                            {/* <button className="bg-orange-200 rounded shadow flex flex-row justify-between align-middle p-1"
                                onClick={refreshData}>
                                <MagnifyingGlassIcon className="h-5 w-5"/>
                                <span className="ml-2">Search</span>
                            </button> */}
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
                    <div className={`${lusitana.className} ml-2 relative`}>
                        <span>Select Zone of interest</span>
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
                            <option key={1} value="Africa">
                                Africa    
                            </option>
                            <option key={2} value="Europe">
                                Europe    
                            </option>
                            <option key={3} value="Asia">
                                Asia    
                            </option>
                        </select>
                    </div>
                </div>
                { mapVisibility && <div>
                    <span className={`${lusitana.className} mb-2`}>Distribution per country of plants of the {currentFamilyName} family</span>
                    <MiniMapComponent familyName={currentFamilyName} token={props.token}/>
                </div> }
            </div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                { mapVisibility && <BarChart data={plantTop} show_labels={true}/>}
                { mapVisibility && <BarChart data={yearDistro} show_labels={true}/>}
                <BarChart data={yearDistroGlobal} show_labels={true}/>
                <div>
                    <h4 className={`${lusitana.className} mb-4 text-xl`}>Distribution of observations per region</h4>
                    <PieChart data={regionObsDistroGlobal} show_labels={true} />
                </div>
            </div>
        </div>
    )
}