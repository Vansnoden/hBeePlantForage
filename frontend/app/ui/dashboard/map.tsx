"use client"

import React, { useRef, useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import dynamic from "next/dynamic";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import { GEOSERVER_BASE_URL } from '../../lib/constants.ts';

// const MaptilerLayer = dynamic(() => import("@maptiler/leaflet-maptilersdk"), { ssr:false })

const MapComponent = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const center = { lng: 13.338414, lat: 52.507932 };
    const [zoom] = useState(12);

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
    
        map.current = new L.Map(mapContainer.current, {
        center: L.latLng(center.lat, center.lng),
        zoom: zoom
        });
    
        // Create a MapTiler Layer inside Leaflet
        const mtLayer = new MaptilerLayer({
            // Get your free API key at https://cloud.maptiler.com
            apiKey: "jcHTtwiHXeEVJwuIKYDm",
        }).addTo(map.current);

        const occurrence_layer = L.tileLayer.wms(GEOSERVER_BASE_URL+'/ne/wms', {
            layers: 'sites',
            projection: 'EPSG:4326',
            format: 'image/png',
            transparent: true,
        }).addTo(map.current);
    
    }, [center.lng, center.lat, zoom]);
    
    return (
        <div>
            <div ref={mapContainer} className="map"/>
        </div>
    )
}

export default MapComponent;