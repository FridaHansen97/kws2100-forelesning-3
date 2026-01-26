import VectorLayer from "ol/layer/Vector.js";
import { Fill, Stroke, Style, Text } from "ol/style.js";
import VectorSource from "ol/source/Vector.js";
import { GeoJSON } from "ol/format.js";
import { Layer } from "ol/layer.js";
import React, { useEffect, useState } from "react";
import { Feature, Map, MapBrowserEvent } from "ol";

const fylkeSource = new VectorSource({
  url: "/kws2100-forelesning-3/geojson/fylker.geojson",
  format: new GeoJSON(),
});
export const fylkeLayer = new VectorLayer({
  source: fylkeSource,
  style: new Style({
    stroke: new Stroke({ color: "green", width: 2 }),
    fill: new Fill({ color: "#ff000025" }),
  }),
});

export function FylkesLayerCheckbox({
  setFylkesLayers,
  map,
}: {
  setFylkesLayers: (value: Layer[]) => void;
  map: Map;
}) {
  function handlePointerMove(e: MapBrowserEvent) {
    const fylkeUnderPointer = fylkeSource.getFeaturesAtCoordinate(e.coordinate);
    setActiveFylke(
      fylkeUnderPointer.length > 0 ? fylkeUnderPointer[0] : undefined,
    );
  }

  const [activeFylke, setActiveFylke] = useState<Feature>();
  const [showFylkeLayer, setShowFylkeLayer] = useState(false);
  useEffect(() => {
    setFylkesLayers(showFylkeLayer ? [fylkeLayer] : []);
    if (showFylkeLayer) map.on("pointermove", handlePointerMove);
    return () => {
      map.un("pointermove", handlePointerMove);
    };
  }, [showFylkeLayer]);

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
  return (
    <button onClick={() => setShowFylkeLayer((b) => !b)} tabIndex={-1}>
      <input type={"checkbox"} checked={showFylkeLayer} />
      Vis fylker
    </button>
  );
}
