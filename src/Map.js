import React from 'react'
import { MapContainer, TileLayer, useMap} from 'react-leaflet'
import './Map.css'
import { showMapData } from './util'

function Map({center, zoom, casesType, countries}) {

    function ChangeView({ center, zoom }) {
        const map = useMap();
        map.setView(center, zoom);
        return null;
      }

    return (
        <div className="map">
            <MapContainer
            casesType={casesType}
            scrollWheelZoom={false}
            center={center}
            zoom={zoom}
            scrollWheelZoom={false}>
            <ChangeView center={center} zoom={zoom} />    
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {showMapData(countries,casesType)}
            </MapContainer>
        </div>
    )
}

export default Map
