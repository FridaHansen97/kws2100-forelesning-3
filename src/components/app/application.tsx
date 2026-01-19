import React, { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile.js";
import { OSM } from "ol/source.js";

const map = new Map({
  layers: [new TileLayer({ source: new OSM() })],
  view: new View({ zoom: 7, center: [7, 59] }),
});

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    map.setTarget(mapRef.current!);
  }, []);

  return;
  <>
    <h1>Kart over administrative områder i Norge</h1>
    <div ref={mapRef}></div>
  </>;
}
