"use client"



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
    
    return (
        <div>
            <div>
                {/* <div ref={mapContainer} className="map"/> */}
                {/* <MapContainer center={[4.79029, -75.69003]} zoom={zoom} scrollWheelZoom={false}>
                    <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[4.79029, -75.69003]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                    </Marker>
                </MapContainer> */}
            </div>
            <div></div>
        </div>
    )
}

export default MapComponent;