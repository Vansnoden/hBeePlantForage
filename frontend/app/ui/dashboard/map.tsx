"use client"

import React, { useEffect } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { TileWMS } from 'ol/source';
import { GEOSERVER_BASE_URL } from '@/app/lib/constants';



// const MaptilerLayer = dynamic(() => import("@maptiler/leaflet-maptilersdk"), { ssr:false })

const MapComponent = () => {
    // const mapContainer = useRef(null);
    // const map = useRef(null);
    // const center = { lat:0.002777763, lng:32.13444449 };
    // const [zoom] = useState(5);
    // useEffect(() => {
    //     if (map.current) return; // stops map from intializing more than once

    //     map.current = new L.Map(mapContainer.current, {
    //         center: L.latLng(center.lat, center.lng),
    //         zoom: zoom
    //     });

        
    //     // const mtLayer = 
    //     // new MaptilerLayer({
    //     //     apiKey: "jcHTtwiHXeEVJwuIKYDm",
    //     // }).addTo(map.current);

    //     // const occurrence_layer = 
    //     L.tileLayer.wms(GEOSERVER_BASE_URL+'/ne/wms', {
    //         layers: 'sites',
    //         format: 'image/png',
    //         transparent: true,
    //     }).addTo(map.current);
        
    //     map.current.on('click', (e) => {
    //         alert("You clicked the map at " + e.latlng);
    //     });
    
    // }, [center.lng, center.lat, zoom]);

    useEffect(() => {
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        })

        const pointLayer = new TileLayer({
            // extent: [-13884991, 2870341, -7455066, 6338219],
            source: new TileWMS({
                url: GEOSERVER_BASE_URL+'/wms',
                params: {'LAYERS': 'ne:sites'},
                serverType: 'geoserver',
                // Countries have transparency, so do not fade tiles:
                transition: 0,
                projection: "EPSG:4326"
            }),
        })

        const map = new Map({
            target: "map",
            layers: [osmLayer, pointLayer],
            view: new View({
                center: [0, 0],
                zoom: 0,
              }),
          });
      return () => map.setTarget()
    }, []);
    
    return (
        <div>
            <div className="card mb-2 bg-gray-300 rounded-sm flex gap-2 p-2">
                <div className="relative">
                    <select
                        id="customer"
                        name="customerId"
                        className="peer block w-full cursor-pointer rounded-md border border-gray-200 bg-white py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        defaultValue=""
                        aria-describedby="customer-error"
                        >
                        <option value="" disabled={true}>
                            Select Country
                        </option>
                    </select>
                </div>
                <div className="relative">
                    <select
                        id="customer"
                        name="customerId"
                        className="peer block w-full cursor-pointer rounded-md border border-gray-200 bg-white py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        defaultValue=""
                        aria-describedby="customer-error"
                        >
                        <option value="" disabled={true}>
                            Select Family
                        </option>
                    </select>
                </div>
            </div>
            <div className='content'>
                <div id="map" className='map'></div>
                <div className='map-details bg-white'></div>
            </div>
        </div>
    )
}

export default MapComponent;