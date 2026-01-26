import { Layer } from "ol/layer.js";
import { useEffect, useState } from "react";
import TileLayer from "ol/layer/Tile.js";
import { OSM, StadiaMaps, WMTS } from "ol/source.js";

const osmLayer = new TileLayer({ source: new OSM() });

const stadiaLayer = new TileLayer({
  source: new StadiaMaps({
    layer: "alidade_smooth",
  }),
});

export function BackgrundLayerSelect({
  setBackroundLayer,
}: {
  setBackroundLayer: (value: Layer) => void;
}) {
  const [backgroundLayerValue, setBackgroundLayerValue] =
    useState<string>("osm");
  useEffect(() => {
    setBackroundLayer(osmLayer);
  }, []);
  useEffect(() => {
    console.log({ backgroundLayerValue });

    if (backgroundLayerValue === "stadia") {
      setBackroundLayer(stadiaLayer);
    } else if (backgroundLayerValue === "osm") {
      setBackroundLayer(osmLayer);
    }
  }, [backgroundLayerValue]);

  return (
    <select
      value={backgroundLayerValue}
      onChange={(event) => setBackgroundLayerValue(event.target.value)}
    >
      <option value={"osm"}>OpenStreetMap bakgrunn</option>
      <option value={"stadia"}>Stadia bakgrunnskart</option>
      <option></option>
      <option></option>
    </select>
  );
}
