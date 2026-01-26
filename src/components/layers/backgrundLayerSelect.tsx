import { Layer } from "ol/layer.js";
import { useEffect, useState } from "react";
import TileLayer from "ol/layer/Tile.js";
import { OSM, StadiaMaps, WMTS } from "ol/source.js";
import { WMTSCapabilities } from "ol/format.js";
import { optionsFromCapabilities } from "ol/source/WMTS.js";
import { register } from "ol/proj/proj4.js";

const osmLayer = new TileLayer({ source: new OSM() });

const stadiaLayer = new TileLayer({
  source: new StadiaMaps({
    layer: "alidade_smooth",
  }),
});

const kartverketLayer = new TileLayer();
fetch("https://cache.kartverket.no/v1/wmts/1.0.0/WMTSCapabilities.xml").then(
  async (res) => {
    const parser = new WMTSCapabilities();
    const capabilities = parser.read(await res.text());
    kartverketLayer.setSource(
      new WMTS(
        optionsFromCapabilities(capabilities, {
          layer: "toporaster",
          matrixSet: "webmercator",
        })!,
      ),
    );
  },
);

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
    } else if (backgroundLayerValue === "kartverket") {
      setBackroundLayer(kartverketLayer);
    }
  }, [backgroundLayerValue]);

  return (
    <select
      value={backgroundLayerValue}
      onChange={(event) => setBackgroundLayerValue(event.target.value)}
    >
      <option value={"osm"}>OpenStreetMap bakgrunn</option>
      <option value={"stadia"}>Stadia bakgrunnskart</option>
      <option value={"kartverket"}>Kartverket bakgrunnskart</option>
      <option value={"flyfoto"}>Flyfoto</option>
    </select>
  );
}
