import React from "react";
import Model from "../../assets/GLBs/Shelfrevised.glb";
import IMG from "./targets.mind";

const ARComponent = () => {
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
            <meta name="viewport" content="width=device-width, initial-scale=50" />
            <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"></script>
          </head>
          <body style="margin: 0; overflow: hidden;">
            <a-scene mindar-image="imageTargetSrc:${IMG};" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false" style="width: 100vw; height: 100vh;">
              <a-assets>
                <img id="card" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.png" />
                <a-asset-item id="avatarModel" src="${Model}" />
              </a-assets>

              <!-- Lighting -->
              <a-light type="ambient" color="#ffffff" intensity="50"></a-light>
              <a-light type="directional" color="#ffffff" intensity="50" position="1 2 3"></a-light>
              <a-light type="point" color="#ffffff" intensity="50" position="0 3 5" distance="10"></a-light>
              <a-light type="spot" color="#ffffff" intensity="40" position="0 5 10" angle="45" penumbra="1" distance="10"></a-light>

              <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
              <a-entity mindar-image-target="targetIndex: 0">
                <a-gltf-model rotation="90 -90 -90" position="0 0 0" scale="1 1 1" src="#avatarModel" animation="property: position; to: 0 0 0; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate"></a-gltf-model>
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
