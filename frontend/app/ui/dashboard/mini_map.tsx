"use client"

import React, { useActionState, useEffect, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import {Fill, Stroke, Style} from 'ol/style';
import { lusitana } from '../fonts';
import { getFamilyData } from '@/app/lib/client_actions';


const MiniMapComponent = (props: {familyName: any, max:number, token:string, update:boolean}) => { // eslint-disable-line

    const [map, refreshMap] = useState<Map>();
    const [geojsonObject, setGeojsonObject] = useState({});

    useEffect(() => {
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        })
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

        const getGeoJSON = async () => {
            const data = await getFamilyData(props.token, props.familyName);
            setGeojsonObject(data);
        };
        let vectorSource = null;
        getGeoJSON().then(()=>{
            console.log("DATA GOT, UPDATING MAp");
            if(Object.keys(geojsonObject).length !== 0){
                console.log("map refresh now. now test")
                vectorSource = new VectorSource({
                    features: new GeoJSON().readFeatures(geojsonObject, {featureProjection: 'EPSG:3857'}),
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
            }
            console.log("MAP UPDATED");
        }).catch(console.error);
        console.log("Map UI refresh");
        console.log("VectorSource:");
        console.log(vectorSource);
        if(!vectorSource){
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
    }, [props.update, props.familyName]);
    
    return (
        <div className={`${lusitana.className}`}>
            <div className='content grid gap-0 sm:grid-cols-1 md:grid-cols-12'>
                <div className="mini-map-container md:col-span-12">
                    <div id="map" className='map'></div>
                </div>
            </div>
            {props.familyName}
        </div>
    )
}

export default MiniMapComponent;