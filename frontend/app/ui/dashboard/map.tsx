"use client"

import React, { useRef, useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import dynamic from "next/dynamic";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import { GEOSERVER_BASE_URL } from '../../lib/constants';

// const MaptilerLayer = dynamic(() => import("@maptiler/leaflet-maptilersdk"), { ssr:false })

const MapComponent = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const center = { lat:0.002777763, lng:32.13444449 };
    const [zoom] = useState(5);
    

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once

        map.current = new L.Map(mapContainer.current, {
            center: L.latLng(center.lat, center.lng),
            zoom: zoom
        });

        const mtLayer = new MaptilerLayer({
            apiKey: "jcHTtwiHXeEVJwuIKYDm",
        }).addTo(map.current);

        const occurrence_layer = L.tileLayer.wms(GEOSERVER_BASE_URL+'/ne/wms', {
            layers: 'sites',
            format: 'image/png',
            transparent: true,
        }).addTo(map.current);
        
        map.current.on('click', (e) => {
            alert("You clicked the map at " + e.latlng);
        });
    
    }, [center.lng, center.lat, zoom]);
    
    return (
        <div>
            <div>
                <div ref={mapContainer} className="map"/>
            </div>
            <div>

            </div>
        </div>
    )
}

export default MapComponent;