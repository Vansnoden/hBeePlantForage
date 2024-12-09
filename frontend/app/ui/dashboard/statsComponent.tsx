"use client"

import { searchFamilyNames, getDashboardData, getFamilyData, getFamilyDataMax } from "@/app/lib/client_actions";
import { DashboardData } from "@/app/lib/definitions";
import BarChart from "@/app/ui/dashboard/charts/barchart";
import MiniMapComponent from "@/app/ui/dashboard/mini_map";
import { lusitana } from "@/app/ui/fonts";
import { useState, useEffect, useActionState, startTransition, useRef } from 'react';
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";


// async function updateGeoJSON(olsdGeoJSON, formData) {
//     return previousState + 1;
// }


export default function StatsComponent(props:{token: string}){

    const [currentFamilyName, setCurrentFamilyName] = useState("");
    const [dashData, setDashData] = useState<DashboardData>();
    const [familyNames, setFamilyNames] = useState<Array<string>>([]);
    const [dropdowVisibility, toggleDropdowVisibility] = useState(false);
    const [mapVisibility, toggleMapVisibility] = useState(false);
    const searchInput = useRef<HTMLInputElement>(null);


    const updateSearch = (evt: any) => {
        let familyName = evt.target.getAttribute("value");
        if(searchInput.current!=null){
            searchInput.current.value = familyName;
        }
        setCurrentFamilyName(familyName);
        toggleDropdowVisibility(!dropdowVisibility);
    }

    const searchFamilyData = (evt: any) => {
        setCurrentFamilyName(evt.target.value);
        const fetchData = async () => {
            setFamilyNames(await searchFamilyNames(props.token, evt.target.value));
        }
        fetchData().then(() => {
            toggleDropdowVisibility(true);
        }).catch(console.error);
    }

    const refreshData = () => {
        if(searchInput.current){
            setCurrentFamilyName(searchInput.current.value);
        }
        const fetchData = async () => {
            setDashData(await getDashboardData(props.token, currentFamilyName));   
        }
        fetchData()
        .catch(console.error);
        toggleDropdowVisibility(false);
        toggleMapVisibility(true);
    }


    const zoneOnChangeHandler = (evt: any) => {
        console.log("zone changed");
    }

    
    return (
        <div>
            <div className="">
                <div className="card mb-2 bg-yellow-600 rounded flex gap-2 p-2">
                    <div className={`${lusitana.className} relative`}>
                        <span>Country distribution of plant specie family</span><br/>
                        <div className="flex flex-row justify-between align-middle">
                            <input type="text" placeholder="Start typing family name here" 
                                onKeyUp={searchFamilyData} defaultValue={currentFamilyName} ref={searchInput}/>
                            <button className="bg-orange-200 rounded shadow flex flex-row justify-between align-middle p-1"
                                onClick={refreshData}>
                                <MagnifyingGlassIcon className="h-5 w-5"/>
                                <span className="ml-2">Search</span>
                            </button>
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
                            defaultValue="Globe"
                            disabled={true}
                            onChange={zoneOnChangeHandler} 
                            className="block w-full cursor-pointer rounded-md border py-2 border-gray-200 bg-white text-sm outline-2 placeholder:text-gray-500"
                            >
                            <option key={-1} value="">
                                -- select zone of interest --
                            </option>
                            <option key={0} value="Globe">
                                Globe    
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
                { mapVisibility && <MiniMapComponent familyName={currentFamilyName} token={props.token}/> }
            </div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {/* <BarChart data={dashData?.sites_per_country} show_labels={true}/> */}
                { mapVisibility && <BarChart data={dashData?.top_20_plants} show_labels={true}/>}
                {/* <BarChart data={dashData?.obs_montly_distro} show_labels={true}/> */}
                { mapVisibility && <BarChart data={dashData?.obs_10_year_overview} show_labels={true}/>}
                {/* <PieChart data={dashData?.obs_per_region} show_labels={true} /> */}
            </div>
        </div>
    )
}