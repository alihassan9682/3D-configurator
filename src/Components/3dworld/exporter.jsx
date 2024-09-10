import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from 'three';
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter"; // Import GLTFExporter

const LoadingIndicator = () => {
  return (
    <mesh visible position={[0, 0, 0]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="orange" transparent opacity={0.1} roughness={1} metalness={1} />
    </mesh>
  );
};

// Component to render the 3D model
const Level = ({ url, position, scale }) => {
  const { scene } = useGLTF(url);
  
  // Clone the scene to ensure each level is a separate entity
  const clonedScene = scene.clone();

  // Traverse through the nodes in the cloned scene
  clonedScene.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;

      if (node.material) {
        node.material.roughness = 0.5;
        node.material.metalness = 0.5;
      }
    }
  });

  return <primitive object={clonedScene} position={position} scale={scale} />;
};

const ModelViewer = ({ scale, levels }) => {
  const sceneRef = useRef(new THREE.Scene()); // Create a reference to a new scene

  const exportModel = () => {
    if (!sceneRef.current) return;

    const exporter = new GLTFExporter();
    exporter.parse(
      sceneRef.current,
      (result) => {
        const output = JSON.stringify(result, null, 2);
        const blob = new Blob([output], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'model.glb'; // Corrected file extension
        link.click();
      },
      { binary: true } // Export as binary GLTF
    );
  };

  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center">
      <button onClick={exportModel} className="mb-4 p-2 bg-blue-500 text-white rounded">
        Export Model
      </button>
      {levels.length === 0 ? (
        <div className="text-gray-600 text-center">
          <p className="text-xl font-semibold mb-4">Add Levels and Configure Your Personalized Model</p>
          <p>Please use the controls on the side to add levels to your model.</p>
        </div>
      ) : (
        <Canvas
          shadows
          style={{ width: "100%", height: "100%" }}
          camera={{ position: [0, 0, 5], fov: 75 }}
          onCreated={({ scene }) => {
            sceneRef.current = scene; // Set the scene reference when the Canvas is created
          }}
        >
          <Suspense fallback={<LoadingIndicator />}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
            {levels.map((level, index) => (
              <Level
                key={`${level.url}-${index}-${Math.random()}`} 
                url={level.url}
                position={level.position}
                scale={[scale, scale, scale]}
              />
            ))}
            <OrbitControls />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

export default ModelViewer;
