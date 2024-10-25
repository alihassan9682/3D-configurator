import React from "react";
import IMG from "./targets.mind";

const ARComponent = ({ modal }) => {
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
                <a-asset-item id="model-0" src="${modal}" />
              </a-assets>

              <!-- Lighting -->
              <a-light type="ambient" color="#ffffff" intensity="1"></a-light>
              <a-light type="directional" color="#ffffff" intensity="1" position="1 2 3"></a-light>

              <!-- Camera -->
              <a-camera position="0 0 5" look-controls="enabled: True"></a-camera>

              <!-- Model -->
              <a-entity mindar-image-target="targetIndex: 0">
                <a-gltf-model 
                  src="#model-0" 
                  position="0 0 0" 
                  scale="0.5 0.5 0.5" 
                  rotation="0 0 0">
                </a-gltf-model>
              </a-entity>

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
