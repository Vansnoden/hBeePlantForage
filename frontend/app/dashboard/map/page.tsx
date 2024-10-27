"use client"
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("../../ui/dashboard/map.tsx"), { ssr:false });

export default function Map(){
    return (
        <div>
            <MapComponent/>
        </div>
    )
}