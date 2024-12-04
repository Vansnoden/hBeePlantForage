"use client"

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
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';


const geojsonObject = {"type":"FeatureCollection","features":[{"type":"Feature","id":"DZA","properties":{"name":"Algeria","count":4},"geometry":{"type":"Polygon","coordinates":[[[11.999506,23.471668],[11.560669,24.097909],[10.771364,24.562532],[10.303847,24.379313],[9.948261,24.936954],[9.910693,25.365455],[9.319411,26.094325],[9.716286,26.512206],[9.629056,27.140953],[9.756128,27.688259],[9.683885,28.144174],[9.859998,28.95999],[9.805634,29.424638],[9.48214,30.307556],[9.055603,32.102692],[8.439103,32.506285],[8.430473,32.748337],[7.612642,33.344115],[7.524482,34.097376],[8.140981,34.655146],[8.376368,35.479876],[8.217824,36.433177],[8.420964,36.946427],[7.737078,36.885708],[7.330385,37.118381],[6.26182,37.110655],[5.32012,36.716519],[4.815758,36.865037],[3.161699,36.783905],[1.466919,36.605647],[0.503877,36.301273],[-0.127454,35.888662],[-1.208603,35.714849],[-2.169914,35.168396],[-1.792986,34.527919],[-1.733455,33.919713],[-1.388049,32.864015],[-1.124551,32.651522],[-1.307899,32.262889],[-2.616605,32.094346],[-3.06898,31.724498],[-3.647498,31.637294],[-3.690441,30.896952],[-4.859646,30.501188],[-5.242129,30.000443],[-6.060632,29.7317],[-7.059228,29.579228],[-8.674116,28.841289],[-8.66559,27.656426],[-8.665124,27.589479],[-8.6844,27.395744],[-4.923337,24.974574],[-1.550055,22.792666],[1.823228,20.610809],[2.060991,20.142233],[2.683588,19.85623],[3.146661,19.693579],[3.158133,19.057364],[4.267419,19.155265],[5.677566,19.601207],[8.572893,21.565661],[11.999506,23.471668]]]}}]}

const MiniMapComponent = () => {

    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        })

        const image = new CircleStyle({
            radius: 5,
            fill: null,
            stroke: new Stroke({color: 'red', width: 1}),
          });
          
        const styles = {
            'Point': new Style({
                image: image,
            }),
            'LineString': new Style({
                stroke: new Stroke({
                    color: 'green',
                    width: 1,
                }),
            }),
            'MultiLineString': new Style({
                stroke: new Stroke({
                    color: 'green',
                    width: 1,
                }),
            }),
            'MultiPoint': new Style({
                image: image,
            }),
            'MultiPolygon': new Style({
                stroke: new Stroke({
                    color: 'yellow',
                    width: 1,
                }),
                fill: new Fill({
                    color: 'rgba(255, 255, 0, 0.1)',
                }),
            }),
            'Polygon': new Style({
                stroke: new Stroke({
                    color: 'blue',
                    lineDash: [4],
                    width: 3,
                }),
                fill: new Fill({
                    color: 'rgba(0, 0, 255, 0.1)',
                }),
            }),
            'GeometryCollection': new Style({
                stroke: new Stroke({
                    color: 'magenta',
                    width: 2,
                }),
                fill: new Fill({
                    color: 'magenta',
                }),
                image: new CircleStyle({
                    radius: 10,
                    fill: null,
                    stroke: new Stroke({
                    color: 'magenta',
                    }),
                }),
            }),
            'Circle': new Style({
                stroke: new Stroke({
                    color: 'red',
                    width: 2,
                }),
                fill: new Fill({
                    color: 'rgba(255,0,0,0.2)',
                }),
            }),
          };
          
        const styleFunction = function (feature) {
            return styles[feature.getGeometry().getType()];
        };

        const vectorSource = new VectorSource({
            features: new GeoJSON().readFeatures(geojsonObject, {featureProjection: 'EPSG:3857'}),
        });

        console.log(vectorSource)

        const vectorLayer = new VectorLayer({
            source: vectorSource,
            // style: styleFunction,
            // projection: "EPSG:4326"
            // dataProjection: 'EPSG:4326',
            // featureProjection: 'EPSG:3857'
        });

        // const geojson_data = new TileLayer({

        // })

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

    const toggleDetails = () => {
        setShowDetails((showDetails) => !showDetails);
    };

    // const createMarkup = (code: string) => {
    //     return {__html: `${code}`};
    // }
    
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
                <div className={clsx("map-container",{
                    "md:col-span-9": showDetails,
                    "md:col-span-12": !showDetails
                })}>
                    <div id="map" className='map'></div>
                </div>
            </div>
        </div>
    )
}

export default MiniMapComponent;