"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';


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

        const map = new Map({
            target: "map",
            layers: [osmLayer],
            view: new View({
                center: [0, 0],
                zoom: 0,
              }),
          });
      return () => map.setTarget(null)
    }, []);
    
    return (
        <div>
            <div id="map" className='map'>
                
            </div>
            <div></div>
        </div>
    )
}

export default MapComponent;