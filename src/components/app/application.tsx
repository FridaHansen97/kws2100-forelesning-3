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
import { Fill, Stroke, Style, Text } from "ol/style.js";

useGeographic();

const fylkeSource = new VectorSource({
  url: "/kws2100-forelesning-3/geojson/fylker.geojson",
  format: new GeoJSON(),
});
const fylkeLayer = new VectorLayer({
  source: fylkeSource,
  style: new Style({
    stroke: new Stroke({ color: "green", width: 2 }),
    fill: new Fill({ color: "#ff000025" }),
  }),
});

const kommuneSource = new VectorSource({
  url: "kws2100-forelesning-3/geojson/kommuner.geojson",
  format: new GeoJSON(),
});
const kommuneLayer = new VectorLayer({ source: kommuneSource });

const layers = [new TileLayer({ source: new OSM() }), fylkeLayer, kommuneLayer];

const view = new View({ zoom: 9, center: [10, 59.5] });
const map = new Map({ layers, view });

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [activeFylke, setActiveFylke] = useState<Feature>();
  const [alleKommuner, setAlleKommuner] = useState<Feature[]>([]);

  function handlePointerMove(e: MapBrowserEvent) {
    let fylkeUnderPointer = fylkeSource.getFeaturesAtCoordinate(e.coordinate);
    setActiveFylke(
      fylkeUnderPointer.length > 0 ? fylkeUnderPointer[0] : undefined,
    );
  }
  useEffect(() => {
    activeFylke?.setStyle(
      (feature) =>
        new Style({
          stroke: new Stroke({ color: "green", width: 4 }),
          text: new Text({
            text: feature.getProperties()["fylkesnavn"],
          }),
        }),
    );
    //returnerer stylen for fylket når musepeker ikke er over den..
    return () => activeFylke?.setStyle(undefined);
  }, [activeFylke]);

  const [selectedKommune, setSelectedKommune] = useState<Feature>();
  function handleMapClick(e: MapBrowserEvent) {
    const clickedKommune = kommuneSource.getFeaturesAtCoordinate(e.coordinate);
    setSelectedKommune(
      clickedKommune.length > 0 ? clickedKommune[0] : undefined,
    );
  }

  useEffect(() => {
    map.setTarget(mapRef.current!);
    map.on("pointermove", handlePointerMove);
    map.on("click", handleMapClick);
    kommuneSource.on("change", () =>
      setAlleKommuner(kommuneSource.getFeatures()),
    );
  }, []);

  return (
    <>
      <h1>
        {selectedKommune
          ? selectedKommune.getProperties()["kommunenavn"]
          : "Kart over administrative områder i Norge"}
      </h1>
      <div ref={mapRef}></div>
    </>
  );
}
