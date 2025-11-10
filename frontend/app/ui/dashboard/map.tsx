"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
import { TileWMS } from 'ol/source';
import { GEOSERVER_BASE_URL } from '@/app/lib/constants';
import clsx from 'clsx';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { ObservationRow } from '@/app/lib/definitions';
import { ObservationItem } from './observation';
import { lusitana } from '../fonts';
import { getPointData, searchFamilyNames } from '@/app/lib/client_actions';


const MapComponent = () => {

    const [showDetails, setShowDetails] = useState(false);
    const [pointDetails, setPointDetails] = useState([] as Array<ObservationRow>);
    const [dropdowVisibility, toggleDropdowVisibility] = useState(false);
    const [startYear, setStartYear] = useState(2015);
    const [endYear, setEndYear] = useState(2025);
    const [currentFamilyName, setCurrentFamilyName] = useState("");
    const [familyNames, setFamilyNames] = useState<Array<string>>([]);
    const searchInput = useRef<HTMLInputElement>(null);
    const startYearInput = useRef<HTMLInputElement>(null);
    const endYearInput = useRef<HTMLInputElement>(null);

    const max = 3000;
    function normalize(value:any) { // eslint-disable-line
        return ['/', value, max];
    }

    // const red = normalize(['band', 1]);
    // const green = normalize(['band', 2]);
    // const blue = normalize(['band', 3]);
    // const nir = normalize(['band', 4]);

    // const trueColor = {
    //     color: ['array', red, green, blue, 0.2],
    //     gamma: 1.1,
    // };


    const updateSearch = (evt: any) => { // eslint-disable-line
        const familyName = evt.target.getAttribute("value");
        setCurrentFamilyName(familyName);
        toggleDropdowVisibility(false);
        if(searchInput.current){
            searchInput.current.value = familyName;
        }
    }

    const searchFamilyData = (evt: any) => { // eslint-disable-line
        searchFamilyNames( evt.target.value).then((families) => {
            setFamilyNames(families);
            toggleDropdowVisibility(true);
        })
    }


    useEffect(() => {

        // const osmLayer = new TileLayer({
        //     preload: Infinity,
        //     source: new OSM(),
        // })

        const osmLayer = new TileLayer({
            // extent: [-13884991, 2870341, -7455066, 6338219],
            source: new TileWMS({
                url: GEOSERVER_BASE_URL+'/wms',
                params: {'LAYERS': 'ne:countries'},// {'LAYERS': 'ne:observations'},
                serverType: 'geoserver',
                // Countries have transparency, so do not fade tiles:
                transition: 0,
                projection: "EPSG:4326",
            }),
        })

        const pointLayer = new TileLayer({
            // extent: [-13884991, 2870341, -7455066, 6338219],
            source: new TileWMS({
                url: GEOSERVER_BASE_URL+'/wms',
                params: {'LAYERS': 'ne:bee_plant_data'},// {'LAYERS': 'ne:observations'},
                serverType: 'geoserver',
                // Countries have transparency, so do not fade tiles:
                transition: 0,
                projection: "EPSG:4326",
            }),
        })

        const params = pointLayer?.getSource()?.getParams();
        params.CQL_FILTER = `year > ${startYear} and year < ${endYear} and continent ilike '%africa%'`;
        // console.log(params)

        if(searchInput.current){
            setCurrentFamilyName(searchInput.current?.value);
            params.CQL_FILTER += ` and family_name ilike '%${searchInput.current?.value}%'`;
        }

        const map = new Map({
            target: "map",
            layers: [osmLayer, pointLayer],
            view: new View({
                center: [0, 0],
                zoom: 3.5,
            }),
        });

        map.on('singleclick', function (evt) {
            const viewResolution = map.getView().getResolution() as number;
            const url = pointLayer.getSource()?.getFeatureInfoUrl(
                evt.coordinate,
                viewResolution,
                'EPSG:3857',
                {'INFO_FORMAT': 'application/json'},
            )
            console.log(url)
            if (url) {
              fetch(url)
                .then((response) => response.json())
                .then((res) => {
                    const ids = [];
                    const cleanRes = []
                    if(res){
                       for(let i=0; i<res.features.length; i++){
                        const point = res.features[i].properties;
                        ids.push(parseInt(res.features[i].id.split(".")[1]));
                        cleanRes.push(point as ObservationRow);
                       } 
                    }
                    console.log(ids);
                    setPointDetails(cleanRes);
                    getPointData( ids).then((ress)=>{
                        // console.log('server response')
                        // console.log(ress);
                        if(ress){
                            setPointDetails(ress);
                        }
                    })
                });
            }
            setShowDetails(true);
        });
      return () => map.setTarget()
    }, [currentFamilyName, startYear, endYear]);

    const toggleDetails = () => {
        setShowDetails((showDetails) => !showDetails);
    };

    const onStartYearChange = (evt: any) => {// eslint-disable-line
        setStartYear(evt.target.value);
    }

    const onEndYearChange = (evt: any) => {// eslint-disable-line
        setEndYear(evt.target.value);
    }

    // const createMarkup = (code: string) => {
    //     return {__html: `${code}`};
    // }
    
    return (
        <div className={`${lusitana.className}`}>
            <div className="card mb-2 bg-yellow-600 rounded flex md:flex-row sm:flex-col gap-2 p-2 align-middle justify-start" >
                <div className="relative">
                    <span>Select Countries</span><br/>
                    <select
                        id="country"
                        name="country_id"
                        defaultValue=""
                        className="block w-full cursor-pointer rounded-md border py-2 border-gray-200 bg-white text-sm outline-2 placeholder:text-gray-500"
                        >
                        <option value="" disabled={true}>
                            Select Country
                        </option>
                        {/* other options */}
                    </select>
                </div>
                <div className={`${lusitana.className} relative  border-left`}>
                    <div className="">
                        <span>Select plant species family</span><br/>
                        <input type="text" placeholder="Provide family name ..." 
                            onKeyUp={searchFamilyData} defaultValue={currentFamilyName} ref={searchInput}
                            className="p-1 py-2 rounded text-sm"/>
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
            <div className='content grid gap-0 sm:grid-cols-1 md:grid-cols-12'>
                <div className={clsx("map-container",{
                    "md:col-span-9": showDetails,
                    "md:col-span-12": !showDetails
                })}>
                    <div id="map" className='map'></div>
                </div>
                <div className={clsx("map-details bg-white",{
                    "md:col-span-3": showDetails,
                    "d-none": !showDetails
                })}>
                    <div className='flex flex-row justify-between items-center p-2 bg-yellow-600'>
                        <b>Details</b>
                        <XMarkIcon onClick={toggleDetails} className='text-black text-xs size-6'></XMarkIcon>
                    </div>
                    {/* <div dangerouslySetInnerHTML={createMarkup(pointDetails)}></div> */}
                    <div className='p-2'>
                        {Array.isArray(pointDetails) && pointDetails?.map(function(item){
                            return (<ObservationItem key={pointDetails.indexOf(item)} obs={item}/>)
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MapComponent;