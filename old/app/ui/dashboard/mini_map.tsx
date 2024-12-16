"use client"

import React, { useEffect, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import {Fill, Stroke, Style} from 'ol/style';
import { lusitana } from '../fonts';
import { getFamilyData, getFamilyDataMax } from '@/app/lib/client_actions';


const MiniMapComponent = (props: {familyName: any, geojsonData: any, max:number, token:string}) => { // eslint-disable-line

    const [map, refreshMap] = useState<Map>();

    const osmLayer = new TileLayer({
        preload: Infinity,
        source: new OSM(),
    });

    const styles = (opacity:number) => {
        return {
            'Polygon': new Style({
                stroke: new Stroke({
                    color: 'blue',
                    width: 1,
                }),
                fill: new Fill({
                    color: `rgba(0, 0, 255, ${opacity})`,
                }),
            }),
        }
    };

    const styleFunction = function (feature: any) { // eslint-disable-line
        // feature.getGeometry().getType() // eslint-disable-line
        return styles(feature.getProperties().count / props.max)[feature.getGeometry().getType()]; // eslint-disable-line
    }; // eslint-disable-line


    useEffect(() => {
        if(props.geojsonData){
            if(Object.keys(props.geojsonData).length !== 0){
                const vectorSource = new VectorSource({
                    features: new GeoJSON().readFeatures(props.geojsonData, {featureProjection: 'EPSG:3857'}),
                });
                const vectorLayer = new VectorLayer({
                    source: vectorSource,
                    style: styleFunction,
                });
                refreshMap(new Map({
                    target: "map",
                    layers: [osmLayer, vectorLayer],
                    view: new View({
                        center: [0, 0],
                        zoom: 0,
                    }),
                }))
            }else{
                refreshMap(new Map({
                    target: "map",
                    layers: [osmLayer],
                    view: new View({
                        center: [0, 0],
                        zoom: 0,
                    }),
                }))
            }
        }else{
            refreshMap(new Map({
                target: "map",
                layers: [osmLayer],
                view: new View({
                    center: [0, 0],
                    zoom: 0,
                }),
            }))
        }
        return () => map?.setTarget()
    }, []); //props.familyName
    
    return (
        <div className={`${lusitana.className}`}>
            <div className='content grid gap-0 sm:grid-cols-1 md:grid-cols-12'>
                <div className="mini-map-container md:col-span-12">
                    <div id="map" className='map'></div>
                </div>
            </div>
            {/* {props.familyName} */}
        </div>
    )
}

export default MiniMapComponent;