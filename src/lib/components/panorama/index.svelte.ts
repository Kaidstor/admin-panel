import type { Marker } from "@photo-sphere-viewer/markers-plugin";
import type { Viewer } from "@photo-sphere-viewer/core";
import PanoramaConstructor from "./PanoramaConstructor.svelte";
import Root from "./Panorama.svelte";

export type MarkerItem = { yaw: number; pitch: number; id: string };

class PanoramaController {
  currentMarker: Marker | null = $state(null);
  markers: MarkerItem[] = $state([]);
  moveEnd: boolean = true;
  
  constructor(
    private viewerInstance: () => Viewer,
    markers?: MarkerItem[]
  ) {
    markers && (this.markers = markers);
  }

  get viewer(): Viewer {
    return this.viewerInstance();
  }
}

export {
  Root,
  //
  Root as Panorama,
  PanoramaConstructor as Constructor,
  PanoramaController
};
