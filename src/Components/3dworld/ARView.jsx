import React, { useEffect, useRef } from "react";
import IMG from "./targets.mind";

const ARView = ({ model }) => {
  const iframeRef = useRef(null);

  const debugHTML = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"></script>
        <style>
          #debug-panel {
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            z-index: 9999;
            max-width: 400px;
          }
          #debug-panel div { margin: 5px 0; word-wrap: break-word; }
          .error-text { color: #ff6b6b; }
          .success-text { color: #69db7c; }
        </style>
      </head>
      <body style="margin: 0; overflow: hidden;">
        <div id="debug-panel">
          <div id="model-status">Model Status: Initializing...</div>
          <div id="device-info">Device Info: Checking...</div>
          <div id="load-attempts">Load Attempts: 0/3</div>
          <div id="error-details">Error Details: None</div>
          <div id="webgl-info">WebGL: Checking...</div>
        </div>

        <a-scene
          mindar-image="imageTargetSrc:${IMG};"
          vr-mode-ui="enabled: false"
          device-orientation-permission-ui="enabled: false"
          renderer="antialias: true; colorManagement: true; physicallyCorrectLights: true;"
          style="width: 100vw; height: 100vh;"
          embedded
        >
          <a-assets timeout="30000">
            <a-asset-item id="model-0" src="${model}" response-type="arraybuffer"></a-asset-item>
          </a-assets>

          <a-light type="ambient" color="#ffffff" intensity="1"></a-light>
          <a-light type="directional" color="#ffffff" intensity="1" position="1 2 3"></a-light>
          
          <a-camera position="0 0 5" look-controls="enabled: true">
            <a-entity
              position="0 0 -1"
              geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
              material="color: white; shader: flat"
              cursor="fuse: false"
            ></a-entity>
          </a-camera>

          <a-entity mindar-image-target="targetIndex: 0">
            <a-gltf-model
              id="ar-model"
              src="#model-0"
              position="0 0 0"
              scale="0.5 0.5 0.5"
              rotation="0 0 0"
            ></a-gltf-model>
          </a-entity>
        </a-scene>

        <script>
          // Constants
          const MAX_LOAD_ATTEMPTS = 3;
          const RETRY_DELAY = 2000;
          const MAX_MODEL_DIMENSION = 2;
          const MIN_MODEL_DIMENSION = 0.1;

          // Debug Panel Elements
          const statusElement = document.getElementById('model-status');
          const sizeElement = document.getElementById('model-size');
          const deviceInfoElement = document.getElementById('device-info');
          const attemptsElement = document.getElementById('load-attempts');
          const errorElement = document.getElementById('error-details');
          const webglInfoElement = document.getElementById('webgl-info');

          // Check WebGL Support
          function checkWebGLSupport() {
            try {
              const canvas = document.createElement('canvas');
              const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
              const renderer = gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL);
              webglInfoElement.textContent = 'WebGL: Supported - ' + renderer;
            } catch(e) {
              webglInfoElement.textContent = 'WebGL: Not Supported';
            }
          }

          // Display Device Info
          deviceInfoElement.textContent = 
            'Device: ' + navigator.platform + ' | Browser: ' + navigator.vendor;

          // Load Attempts Update
          let loadAttempts = 0;
          function updateLoadAttempts() {
            attemptsElement.textContent = \`Load Attempts: \${loadAttempts}/\${MAX_LOAD_ATTEMPTS}\`;
          }

          function handleModelError(error) {
            loadAttempts++;
            updateLoadAttempts();
            errorElement.textContent = 'Error Details: ' + (error.message || error.type || 'Unknown error');
            statusElement.textContent = \`Model Status: Failed - Attempt \${loadAttempts}\`;

            if (loadAttempts < MAX_LOAD_ATTEMPTS) {
              setTimeout(() => {
                const modelEntity = document.querySelector('#ar-model');
                modelEntity.setAttribute('src', '#model-0');
              }, RETRY_DELAY);
            } else {
              statusElement.textContent = 'Model Status: Load Failed after max attempts';
            }
          }

          function handleModelLoad(evt) {
            const model = evt.detail.model;
            statusElement.textContent = 'Model Status: Loaded';
            sizeElement.textContent = 'Model Size: Calculated';

            const scale = 0.5;
            document.querySelector('#ar-model').setAttribute('scale', \`\${scale} \${scale} \${scale}\`);
          }

          // Add Event Listeners
          const modelEntity = document.querySelector('#ar-model');
          modelEntity.addEventListener('model-loaded', handleModelLoad);
          modelEntity.addEventListener('model-error', handleModelError);

          // Initial Setup
          updateLoadAttempts();
          checkWebGLSupport();
           // Add this to the script section to handle the WebGL context loss
  window.addEventListener('webglcontextlost', function (event) {
    event.preventDefault();
    console.log('WebGL Context Lost');
    // You can attempt to restore the context here, or reload the page
  }, false);

  window.addEventListener('webglcontextrestored', function () {
    console.log('WebGL Context Restored');
    // You may want to reload your scene or reinitialize resources after restoration
  }, false);
        </script>
 


      </body>
    </html>
  `;

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.addEventListener('load', () => console.log('iframe loaded'));
      iframe.srcdoc = debugHTML;  // Directly inject HTML into iframe
    }
  }, [debugHTML]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <iframe ref={iframeRef} title="AR View" style={{ width: "100%", height: "100%", border: "none" }} />
    </div>
  );
};

export default ARView;
