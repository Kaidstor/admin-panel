<script lang="ts">
  import type { Viewer } from "@photo-sphere-viewer/core";
  import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
  import { getContext } from "svelte";

  $effect(() => {
    const viewer = getContext<Viewer>("panorama_viewer");
    // Добавление обработчика клика на маркер
    const markersPlugin = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);
    let currentMarkerId: string | null = null;

    viewer.addEventListener("click", ({ data }) => {
      if (!data.rightclick) {
        const element = newInput();

        const markerId = "#" + Math.random().toString(36).substring(2, 15);

        markersPlugin.addMarker({
          id: markerId,
          position: { yaw: data.yaw, pitch: data.pitch },
          element,
          anchor: "center center",
          data: {
            generated: true,
          },
        });

        element.addEventListener(
          "mousedown",
          (e) => {
            element.focus();
            currentMarkerId = markerId;
            e.stopPropagation();
            e.preventDefault();
          },
          false
        );
      }
    });

    const newInput = () => {
      const div = document.createElement("div");
      div.contentEditable = "true";
      div.style.minWidth = "100px";
      div.style.height = "50px";
      div.style.lineHeight = "50px";
      div.style.backgroundColor = "#c0ff16a8";
      div.classList.add(
        "rounded-lg",
        "px-4",
        "text-black",
        "font-bold",
        "!flex",
        "justify-center",
        "items-center",
        "text-center",
        "draggable"
      );

      return div;
    };

    document.addEventListener("mousedown", (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.matches(".draggable")) {
        currentMarkerId = target.parentElement!.id; // Предполагается, что у маркера есть data-attribute с его ID
      }
    });

    viewer.container.addEventListener("mousemove", (e) => {
      if (!currentMarkerId) return; // Предполагается, что перемещение начинается только если есть выбранный маркер

      const viewerRect = viewer.container!.getBoundingClientRect();
      const relativeX = e.clientX - viewerRect.left;
      const relativeY = e.clientY - viewerRect.top;

      const pos = { x: relativeX, y: relativeY };
      const vector = viewer.dataHelper.viewerCoordsToVector3(pos);

      const sphericalCoords =
        viewer.dataHelper.vector3ToSphericalCoords(vector);

      const marker = markersPlugin.getMarker(
        "#" + currentMarkerId!.split("#")[1]!
      );

      markersPlugin.updateMarker({
        ...marker.config,
        position: sphericalCoords,
      });
    });

    document.addEventListener("mouseup", (e) => {
      currentMarkerId = null;
    });
  });
</script>
