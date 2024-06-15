import type { Viewer } from "@photo-sphere-viewer/core";
import PanoramaConstructor from "./PanoramaConstructor.svelte";
import PanoramaClientMenu from "./PanoramaClientMenu.svelte";
import PanoramaCurrentElement from "./PanoramaCurrentElement.svelte";
import PanoramaElement from "./PanoramaElement.svelte";
import PanoramaElementSettings from "./PanoramaElementSettings.svelte";
import PanoramaUploader from "./PanoramaUploader.svelte";
import Root from "./Panorama.svelte";
import type { Marker } from "@photo-sphere-viewer/markers-plugin";
import type { IPanorama } from "$lib/services/PanoramaService";
import type { IMarkerWithPlace } from "$lib/db/schema";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";

class PanoramaController {
  marker: IMarkerWithPlace | null = $state(null);
  currentMarkerElement: Marker | null = $state(null);
  current: IPanorama | null = $state(null);
  panoramas: IPanorama[] = $state([]);
  moveEnd: boolean = true;

  constructor(private viewerInstance: () => Viewer, panoramas: IPanorama[]) {
    if (panoramas.length) {
      this.panoramas = panoramas;
      this.current = panoramas[0];
    }
  }

  get hasViewer() {
    return!!this.viewerInstance();
  }

  setCurrent(panorama_id: number) {
    this.current = this.panoramas.find((panorama) => panorama.id == panorama_id)!;
    this.viewer.setPanorama(this.current.image, { showLoader: false, zoom: 1 });
  }

  get currentMarker() {
    return this.marker;
  }

  getMarkerById(id: number) {
    return this.current!.markers?.find((marker) => marker.id == id) || null;
  }

  removeMarkerById(id: number) {
    this.current!.markers = this.current!.markers?.filter((marker) => marker.id != id) || [];
  }

  set currentMarker(marker) {
    this.marker = marker;

    if (!marker) {
      this.currentMarkerElement = null;
      return;
    }

    this.currentMarkerElement = this.markersPlugin.getMarker({
      id: marker.id.toString(),
    });
  }

  get viewer() {
    return this.viewerInstance();
  }

  removeMarker(id?: string) {
    if (!id && !this.currentMarker) {
      console.error("No marker to remove");
      return;
    }
    this.currentMarker = null;
    this.markersPlugin.removeMarker(id || this.currentMarker!.id.toString());
  }

  get markersPlugin() {
    return this.viewer.getPlugin<MarkersPlugin>(MarkersPlugin);
  }
}

export {
  Root,
  Root as Panorama,
  PanoramaConstructor as Constructor,
  PanoramaClientMenu as ClientMenu,
  PanoramaElementSettings as ElementSettings,
  PanoramaCurrentElement as CurrentElement,
  PanoramaElement as Element,
  PanoramaUploader as Uploader,
  PanoramaController,
};
