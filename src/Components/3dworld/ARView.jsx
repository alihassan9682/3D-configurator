import React, { useEffect, useRef } from "react";
import IMG from "./targets.mind";

const ARView = ({ model }) => {
  const iframeRef = useRef(null);
  console.log("Model", model)
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
            display: block;
          }
          #debug-panel div {
            margin: 5px 0;
            word-wrap: break-word;
          }
          .error-text {
            color: #ff6b6b;
          }
          .success-text {
            color: #69db7c;
          }
        </style>
      </head>
      <body style="margin: 0; overflow: hidden;">
        <div id="debug-panel">
          <div id="model-status">Model Status: Initializing...</div>
          <div id="model-size">Model Size: Waiting...</div>
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
          
          // Debug Elements
          const statusElement = document.getElementById('model-status');
          const sizeElement = document.getElementById('model-size');
          const deviceInfoElement = document.getElementById('device-info');
          const attemptsElement = document.getElementById('load-attempts');
          const errorElement = document.getElementById('error-details');
          const webglInfoElement = document.getElementById('webgl-info');

          // Display model URL

          // Check WebGL Support
          function checkWebGLSupport() {
            try {
              const canvas = document.createElement('canvas');
              const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
              const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
              const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
              webglInfoElement.textContent = 'WebGL: Supported - ' + renderer;
              return true;
            } catch(e) {
              webglInfoElement.textContent = 'WebGL: Not Supported';
              return false;
            }
          }

          // Device information
          const deviceInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            vendor: navigator.vendor,
            memory: navigator.deviceMemory || 'unknown',
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            webGL: checkWebGLSupport()
          };
          
          deviceInfoElement.textContent = 
            'Device: ' + deviceInfo.platform + ' | ' +
            'Browser: ' + deviceInfo.vendor;

          // Model loading and size calculation
          const modelEntity = document.querySelector('#ar-model');
          const assetItem = document.querySelector('#model-0');
          let loadAttempts = 0;
          let modelCheckInterval;

          function isModelReady(model) {
            if (!model) return false;
            let isReady = true;
            model.traverse((node) => {
              if (node.isMesh) {
                if (!node.geometry || !node.geometry.attributes.position) {
                  isReady = false;
                }
              }
            });
            return isReady;
          }

          function calculateModelSize(model) {
            if (!model) throw new Error('Model not available');

            model.updateMatrixWorld(true);
            
            let meshes = [];
            model.traverse((node) => {
              if (node.isMesh) {
                meshes.push(node);
              }
            });

            if (meshes.length === 0) {
              throw new Error('No meshes found in model');
            }

            const box = new THREE.Box3();
            meshes.forEach(mesh => {
              mesh.geometry.computeBoundingBox();
              const meshBox = mesh.geometry.boundingBox.clone();
              meshBox.applyMatrix4(mesh.matrixWorld);
              box.union(meshBox);
            });

            const size = new THREE.Vector3();
            box.getSize(size);

            return {
              box: box,
              size: size,
              meshCount: meshes.length
            };
          }

          function updateLoadAttempts() {
            attemptsElement.textContent = \`Load Attempts: \${loadAttempts}/\${MAX_LOAD_ATTEMPTS}\`;
          }

          function logError(error, type = 'error') {
            console.error('Detailed error:', error);
            errorElement.textContent = 'Error Details: ' + (error.message || error.type || 'Unknown error');
            errorElement.className = type === 'error' ? 'error-text' : '';
          }

          function handleModelLoad(evt) {
            try {
              const model = evt.detail.model;
              if (!model) throw new Error('Model details not available');

              const modelData = calculateModelSize(model);
              const size = modelData.size;

              if (size.x === 0 && size.y === 0 && size.z === 0) {
                throw new Error('Model dimensions are zero');
              }

              // Update UI
              statusElement.textContent = 'Model Status: Loaded Successfully';
              statusElement.className = 'success-text';
              sizeElement.textContent = \`Model Size: W: \${size.x.toFixed(2)} H: \${size.y.toFixed(2)} D: \${size.z.toFixed(2)}\`;

              // Log model details
              console.log('Model details:', {
                meshCount: modelData.meshCount,
                dimensions: {
                  width: size.x,
                  height: size.y,
                  depth: size.z
                },
                position: model.position,
                scale: model.scale
              });

              // Auto-scale model if needed
              const maxDimension = Math.max(size.x, size.y, size.z);
              if (maxDimension > MAX_MODEL_DIMENSION || maxDimension < MIN_MODEL_DIMENSION) {
                const targetSize = maxDimension > MAX_MODEL_DIMENSION ? MAX_MODEL_DIMENSION : 1;
                const scale = targetSize / maxDimension;
                modelEntity.setAttribute('scale', \`\${scale} \${scale} \${scale}\`);
                console.log('Model auto-scaled to:', scale);
              }

              // Add visual bounding box for debugging
              const boxHelper = new THREE.BoxHelper(model, 0xffff00);
              model.parent.add(boxHelper);

            } catch (error) {
              console.error('Size calculation error:', error);
              logError(error);
              statusElement.textContent = 'Model Status: Size Calculation Error';
              
              // Fallback to default scale
              const defaultScale = 0.5;
              modelEntity.setAttribute('scale', \`\${defaultScale} \${defaultScale} \${defaultScale}\`);
              sizeElement.textContent = 'Model Size: Using default scale (0.5)';
            }
          }

          async function handleModelError(evt) {
            loadAttempts++;
            updateLoadAttempts();
            
            const error = evt.detail.error || evt.detail;
            logError(error);
            
            statusElement.textContent = \`Model Status: Load Failed - Attempt \${loadAttempts}\`;
            
            if (loadAttempts < MAX_LOAD_ATTEMPTS) {
              console.log(\`Retrying model load... Attempt \${loadAttempts + 1}\`);
              
              // Full cleanup and retry
              setTimeout(() => {
                modelEntity.removeAttribute('src');
                modelEntity.removeAttribute('gltf-model');
                
                // Force a repaint
                void modelEntity.offsetHeight;
                
                setTimeout(() => {
                  modelEntity.setAttribute('src', '#model-0');
                }, RETRY_DELAY);
              }, RETRY_DELAY);
            } else {
              statusElement.textContent = \`Model Status: Failed after \${MAX_LOAD_ATTEMPTS} attempts\`;
              errorElement.textContent = 'Error Details: Max attempts reached. Try refreshing the page.';
            }
          }

          // Event Listeners
          modelEntity.addEventListener('model-loaded', (evt) => {
            // Clear any existing interval
            if (modelCheckInterval) clearInterval(modelCheckInterval);
            
            // Start checking for model readiness
            modelCheckInterval = setInterval(() => {
              const model = evt.detail.model;
              if (model && isModelReady(model)) {
                clearInterval(modelCheckInterval);
                handleModelLoad(evt);
              }
            }, 100);

            // Timeout after 5 seconds
            setTimeout(() => {
              if (modelCheckInterval) {
                clearInterval(modelCheckInterval);
                if (!isModelReady(evt.detail.model)) {
                  logError(new Error('Model failed to initialize properly'));
                  statusElement.textContent = 'Model Status: Failed to initialize';
                }
              }
            }, 5000);
          });

          modelEntity.addEventListener('model-error', handleModelError);
          
          // Asset loading error handling
          assetItem.addEventListener('error', (error) => {
            logError(error);
            errorElement.textContent = 'Error Details: Asset failed to load';
          });

          // Scene event handlers
          const scene = document.querySelector('a-scene');
          
          scene.addEventListener('renderstart', () => {
            console.log('AR Scene started rendering');
          });

          scene.addEventListener('camera-init', () => {
            console.log('Camera initialized');
            statusElement.textContent = 'Camera Status: Initialized';
          });

          scene.addEventListener('camera-error', (error) => {
            logError(error);
            statusElement.textContent = 'Camera Error: See Details';
          });

          // Initial setup
          updateLoadAttempts();
          checkWebGLSupport();
        </script>
      </body>
    </html>
  `;

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.addEventListener('load', () => {
        console.log('iframe loaded');
      });
    }
  }, []);

  return (
    <div style={{
      position: "relative",
      width: "100vw",
      height: "100vh",
      margin: 0,
      padding: 0,
    }}>
      <iframe
        ref={iframeRef}
        srcDoc={debugHTML}
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

export default ARView;