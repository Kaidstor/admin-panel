import type { IPanorama } from "$lib/services/PanoramaService";
import { s_fetch } from ".";

export async function newPanorama(
  event: Event & {
    currentTarget: EventTarget & HTMLInputElement;
  }
) {
  const target = event.currentTarget! as HTMLInputElement;
  if (target.files) {
    const file = target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const response = await s_fetch<IPanorama>("?/newPanorama", {
      body: formData,
    });

    return response?.data;
  }
}
