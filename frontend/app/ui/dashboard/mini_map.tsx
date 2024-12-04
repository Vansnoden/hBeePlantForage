"use client"

import React, { useEffect } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import {Fill, Stroke, Style} from 'ol/style';


const MiniMapComponent = (props: {geojsonObject: any}) => { // eslint-disable-line

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
            return styles(feature.getProperties().count / 4)[feature.getGeometry().getType()]; // eslint-disable-line
        }; // eslint-disable-line
        const vectorSource = new VectorSource({
            features: new GeoJSON().readFeatures(props.geojsonObject, {featureProjection: 'EPSG:3857'}),
        });
        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: styleFunction,
        });
        const map = new Map({
            target: "map",
            layers: [osmLayer, vectorLayer],
            view: new View({
                center: [0, 0],
                zoom: 0,
            }),
        });
      return () => map.setTarget()
    }, []);
    
    return (
        <div>
            <div className="card mb-2 bg-yellow-600 rounded flex gap-2 p-2">
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
            </div>
            <div className='content grid gap-0 sm:grid-cols-1 md:grid-cols-12'>
                <div className="mini-map-container md:col-span-12">
                    <div id="map" className='map'></div>
                </div>
            </div>
        </div>
    )
}

export default MiniMapComponent;