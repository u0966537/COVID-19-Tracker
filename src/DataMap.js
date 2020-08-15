import React from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import "./styles/DataMap.css";
import { showDataOnMap } from "./utils";

function DataMap({ countries, casesType, center, zoom }) {
  return (
    <div className="dataMap">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {showDataOnMap(countries, casesType)}
      </LeafletMap>
    </div>
  );
}

export default DataMap;
