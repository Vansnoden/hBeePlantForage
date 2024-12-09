"use client"

import { getAllFamilyNames, getDashboardData, getFamilyData, getFamilyDataMax } from "@/app/lib/client_actions";
import { DashboardData } from "@/app/lib/definitions";
import BarChart from "@/app/ui/dashboard/charts/barchart";
import MiniMapComponent from "@/app/ui/dashboard/mini_map";
import { lusitana } from "@/app/ui/fonts";
import { useState, useEffect, useActionState, startTransition } from 'react'


// async function updateGeoJSON(olsdGeoJSON, formData) {
//     return previousState + 1;
// }


export default function StatsComponent(props:{token: string}){

    const [currentFamilyName, setCurrentFamilyName] = useState("");
    const [dashData, setDashData] = useState<DashboardData>();
    const [geojsonObject, setGeojsonObject] = useActionState(async () => {
        const data = await getFamilyData(props.token, currentFamilyName)
        return data;
    }, {});
    const [familyMax, setFamilyMax] = useState(0);
    const [familyNames, setFamilyNames] = useState<Array<string>>([]);

    const onChangeHandler = (evt:any) => {
        let familyName = evt.target.value;
        const fetchData = async (familyName: string) => {
            setCurrentFamilyName(familyName);
            setDashData(await getDashboardData(props.token, familyName));   
            setFamilyMax(await getFamilyDataMax(props.token, familyName));
            setFamilyNames(await getAllFamilyNames(props.token));
            startTransition(() => {
                setGeojsonObject();
            });
        }
        fetchData(familyName)
        .catch(console.error);
    };

    const zoneOnChangeHandler = (evt: any) => {
        console.log("zone changed");
    }

    useEffect(() => {
        const fetchData = async () => {
            setDashData(await getDashboardData(props.token, currentFamilyName));   
            startTransition(() => {
                setGeojsonObject();
            });
            setFamilyMax(await getFamilyDataMax(props.token, currentFamilyName));
            setFamilyNames(await getAllFamilyNames(props.token));
        }
        fetchData()
        .catch(console.error);
    }, [])

    
    return (
        <div>
            <div className="">
                <div className="card mb-2 bg-yellow-600 rounded flex gap-2 p-2">
                    <div className={`${lusitana.className} relative`}>
                        <span>Country distribution of plant specie family</span>
                        <select
                            id="family"
                            name="family_id"
                            defaultValue=""
                            onChange={onChangeHandler} 
                            className="block w-full cursor-pointer rounded-md border py-2 border-gray-200 bg-white text-sm outline-2 placeholder:text-gray-500"
                            >
                            <option key={-1} value="">
                                -- select plant family --
                            </option>
                            {familyNames.map((item:string, index:number) =>
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            )}
                        </select>
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
                            <option key={1} value="Globe">
                                Africa    
                            </option>
                            <option key={2} value="Globe">
                                Europe    
                            </option>
                            <option key={3} value="Globe">
                                Asia    
                            </option>
                        </select>
                    </div>
                </div>
                { Object.keys(geojsonObject).length !== 0 && <MiniMapComponent geojsonObject={geojsonObject} max={familyMax}/>}
            </div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {/* <BarChart data={dashData?.sites_per_country} show_labels={true}/> */}
                { currentFamilyName && <BarChart data={dashData?.top_20_plants} show_labels={true}/>}
                {/* <BarChart data={dashData?.obs_montly_distro} show_labels={true}/> */}
                { currentFamilyName && <BarChart data={dashData?.obs_10_year_overview} show_labels={true}/>}
                {/* <PieChart data={dashData?.obs_per_region} show_labels={true} /> */}
            </div>
        </div>
    )
}