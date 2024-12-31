"use client";

import React, { useEffect, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { TileWMS } from 'ol/source';
import { GEOSERVER_BASE_URL } from '@/app/lib/constants';
import clsx from 'clsx';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Observation } from '@/app/lib/definitions';
import { ObservationItem } from './observation';
import { lusitana } from '../fonts';
import { getPointData } from '@/app/lib/client_actions';


const MapComponent = (props:{token: string}) => {

    const [showDetails, setShowDetails] = useState(false);
    const [pointDetails, setPointDetails] = useState([] as Array<Observation>);
    const [startYear, setStartYear] = useState(2010);
    const [endYear, setEndYear] = useState(2025);
    const [currentEndYear, setCurrentEndYear] = useState(2020);

    useEffect(() => {
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        })

        const pointLayer = new TileLayer({
            // extent: [-13884991, 2870341, -7455066, 6338219],
            source: new TileWMS({
                url: GEOSERVER_BASE_URL+'/wms',
                params: {'LAYERS': 'ne:observations'},
                serverType: 'geoserver',
                // Countries have transparency, so do not fade tiles:
                transition: 0,
                projection: "EPSG:4326"
            }),
        })

        const params = pointLayer?.getSource()?.getParams();
        params.CQL_FILTER = `year > ${startYear} and year < ${currentEndYear}`;
        // console.log(params)

        const map = new Map({
            target: "map",
            layers: [osmLayer, pointLayer],
            view: new View({
                center: [0, 0],
                zoom: 0,
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
                    var ids = []
                    const cleanRes = []
                    if(res){
                       for(let i=0; i<res.features.length; i++){
                        const point = res.features[i].properties;
                        ids.push(parseInt(res.features[i].id.split(".")[1]));
                        cleanRes.push(point as Observation);
                       } 
                    }
                    console.log(ids);
                    setPointDetails(cleanRes);
                    getPointData(props.token, ids).then((ress)=>{
                        console.log('server response')
                        console.log(ress);
                    })
                });
            }
            setShowDetails(true);
        });
      return () => map.setTarget()
    }, [currentEndYear]);

    const toggleDetails = () => {
        setShowDetails((showDetails) => !showDetails);
    };

    const handleDateChange = (evt: any) => {
        setCurrentEndYear(evt.target.value)
    }

    // const createMarkup = (code: string) => {
    //     return {__html: `${code}`};
    // }
    
    return (
        <div className={`${lusitana.className}`}>
            <div className="card mb-2 bg-yellow-600 rounded flex gap-2 p-2" >
                <div className="relative">
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
                <div className="relative">
                    <select
                        id="family"
                        name="family_id"
                        defaultValue=""
                        className="block w-full cursor-pointer rounded-md border py-2 border-gray-200 bg-white text-sm outline-2 placeholder:text-gray-500"
                        >
                        <option value="" disabled={true}>
                            Select Family
                        </option>
                        {/* other options */}
                    </select>
                </div>
                <div className="relative">
                    <input
                        className="block w-full cursor-pointer rounded-md border py-2 pl-2 border-gray-200 bg-white text-sm outline-2 placeholder:text-gray-500"
                        id="startYear"
                        type="number"
                        name="startYear"
                        placeholder="Provide Start Year"
                        value={startYear}
                        onChange={(e) => setStartYear(parseInt(e.target.value))}
                    />
                </div>
                <div className="relative">
                    <input
                        className="block w-full cursor-pointer rounded-md border py-2 pl-2 border-gray-200 bg-white text-sm outline-2 placeholder:text-gray-500"
                        id="endYear"
                        type="number"
                        name="endYear"
                        placeholder="Provide End Year"
                        value={endYear}
                        onChange={(e) => setEndYear(parseInt(e.target.value))}
                    />
                </div>
                <div className="">
                    <span>{startYear}</span>
                    <input type="range" min={startYear} max={endYear} onChange={handleDateChange} className="slider" id="myRange"/>
                    <span>{currentEndYear}</span>
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
                        {pointDetails.map(function(item){
                            return (<ObservationItem key={pointDetails.indexOf(item)} obs={item}/>)
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MapComponent;