<script lang="ts">
  import { cn } from "$lib/utils";
   import { Viewer } from "@photo-sphere-viewer/core";
   import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
 
   let container = $state<HTMLDivElement>();
 
   const {...props} = $props<{class: string}>();

   $effect(() => {
     if (!container) return;
     const viewer = new Viewer({
       navbar: false,
       container: container,
       panorama: "/panorama_1.jpg",
       plugins: [
         [
           MarkersPlugin,
           {
             markers: [],
           },
         ],
       ],
     });
 
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
           // image: '/img.png',
           // size: { width: 32, height: 32 },
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
       
       const viewerRect = container!.getBoundingClientRect();
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

   export {className as class};
 </script>
 
 <svelte:head>
   <link
     rel="stylesheet"
     href="https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core/index.min.css"
   />
   <link
     rel="stylesheet"
     href="https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/markers-plugin/index.min.css"
   />
 </svelte:head>
 <!-- the viewer container must have a defined size -->
 <div bind:this={container} class={cn("w-full aspect-video rounded-lg overflow-hidden", props.class)}></div>
 