"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import {Fill, Stroke, Style} from 'ol/style';
import { lusitana } from '../fonts';
import { TileWMS } from 'ol/source';
import { GEOSERVER_BASE_URL } from '@/app/lib/constants';


const MiniMapComponent = (props: {familyName: any, geojsonData: any, max:number, token:string}) => { // eslint-disable-line

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const baseLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        });

        // const baseLayer = new TileLayer({
        //     // extent: [-13884991, 2870341, -7455066, 6338219],
        //     source: new TileWMS({
        //         url: GEOSERVER_BASE_URL+'/wms',
        //         params: {'LAYERS': 'ne:Africa_Countries'},
        //         serverType: 'geoserver',
        //         // Countries have transparency, so do not fade tiles:
        //         transition: 0,
        //         projection: "EPSG:3857",
        //     }),
        // })
    
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
            return styles(feature.getProperties().count / props.max*0.6)[feature.getGeometry().getType()]; // eslint-disable-line
        }; // eslint-disable-line

        if(props.geojsonData){
            if(Object.keys(props.geojsonData).length !== 0){
                setLoading(true);
                const vectorSource = new VectorSource({
                    features: new GeoJSON().readFeatures(props.geojsonData, {featureProjection: 'EPSG:3857'}),
                });
                const vectorLayer = new VectorLayer({
                    source: vectorSource,
                    style: styleFunction,
                });
                const map = new Map({
                    target: "map",
                    layers: [baseLayer, vectorLayer],
                    view: new View({
                        center: [0, 0],
                        zoom: 0,
                    }),
                })
                setLoading(false);
                return () => map.setTarget();
            }else{
                setLoading(true);
                const map = new Map({
                    target: "map",
                    layers: [baseLayer],
                    view: new View({
                        center: [0, 0],
                        zoom: 0,
                    }),
                })
                setLoading(false);
                return () => map.setTarget();
            }
        }else{
            setLoading(true);
            const map = new Map({
                target: "map",
                layers: [baseLayer],
                view: new View({
                    center: [0, 0],
                    zoom: 0,
                }),
            })
            setLoading(false);
            return () => map.setTarget()
        }
    }, [props.familyName, props.geojsonData]); //props.familyName
    
    return (
        <div className={`${lusitana.className}`}>
            <div className='content grid gap-0 sm:grid-cols-1 md:grid-cols-12'>
                <div className="mini-map-container md:col-span-12">
                    <div id="map" className='map'></div>
                </div>
            </div>
            { isLoading && <span> ... Loading </span> }
        </div>
    )
}

export default MiniMapComponent;