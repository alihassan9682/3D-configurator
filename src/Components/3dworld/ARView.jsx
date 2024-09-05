import React from "react";
import IMG from "./targets.mind";

const ARComponent = ({ layers }) => {
  const generateModels = () => {
    return layers?.map((layer, index) => `
      <a-entity mindar-image-target="targetIndex: 0">
        <a-gltf-model 
          src="#model-${index}" 
          position="${layer.position?.join(" ") || "0 0 0"}" 
          scale="${layer.scale?.join(" ") || "0.1 0.1 0.1"}" 
          rotation="${layer.rotation?.join(" ") || "0 0 0"}">
        </a-gltf-model>
      </a-entity>
    `).join("\n");
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
      }}
    >
      <iframe
        srcDoc={`<html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"></script>
          </head>
          <body style="margin: 0; overflow: hidden;">
            <a-scene 
              mindar-image="imageTargetSrc:${IMG};" 
              vr-mode-ui="enabled: false" 
              device-orientation-permission-ui="enabled: false" 
              style="width: 100vw; height: 100vh;"
            >
              <a-assets>
                ${layers?.map((layer, index) => `
                  <a-asset-item id="model-${index}" src="${layer.url}" />
                `).join("\n")}
              </a-assets>

              <!-- Lighting -->
              <a-light type="ambient" color="#ffffff" intensity="1"></a-light>
              <a-light type="directional" color="#ffffff" intensity="1" position="1 2 3"></a-light>

              <!-- Camera -->
              <a-camera position="0 0 5" look-controls="enabled: false"></a-camera>

              <!-- Models -->
              ${generateModels()}

            </a-scene>
          </body>
        </html>`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Augmented Reality Viewer"
      />
    </div>
  );
};

export default ARComponent;
