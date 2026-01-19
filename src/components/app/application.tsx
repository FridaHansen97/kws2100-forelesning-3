import React, { useEffect, useRef, useState } from "react";
import { Feature, Map, MapBrowserEvent, View } from "ol";
import TileLayer from "ol/layer/Tile.js";
import { OSM } from "ol/source.js";
import { useGeographic } from "ol/proj.js";

import "ol/ol.css";
import "./application.css";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import { GeoJSON } from "ol/format.js";

useGeographic();

const fylkeSource = new VectorSource({
  url: "/kws2100-forelesning-3/geojson/fylker.geojson",
  format: new GeoJSON(),
});
const fylkeLayer = new VectorLayer({
  source: fylkeSource,
});

const layers = [new TileLayer({ source: new OSM() }), fylkeLayer];

const map = new Map({
  layers,
  view: new View({ zoom: 9, center: [10, 59.6] }),
});

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [activeFylke, setActiveFylke] = useState<Feature>();

  function handlePointerMove(e: MapBrowserEvent) {
    let fylkeUnderPointer = fylkeSource.getFeaturesAtCoordinate(e.coordinate);
    setActiveFylke(
      fylkeUnderPointer.length > 0 ? fylkeUnderPointer[0] : undefined,
    );
  }

  useEffect(() => {
    map.setTarget(mapRef.current!);
    map.on("pointermove", handlePointerMove);
  }, []);

  return (
    <>
      <h1>
        {activeFylke
          ? activeFylke.getProperties()["fylkesnavn"]
          : "Kart over administrative områder i Norge"}
      </h1>
      <div ref={mapRef}></div>
    </>
  );
}
