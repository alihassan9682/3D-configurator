import React, { useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from 'three';
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
const LoadingIndicator = () => {
  return (
    <mesh visible position={[0, 0, 0]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="orange" transparent opacity={0.1} roughness={1} metalness={1} />
    </mesh>
  );
};

const Level = ({ url, position, scale }) => {
  const { scene } = useGLTF(url);
  const clonedScene = scene.clone();

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

const ModelViewer = ({ scale,levels,dispatch }) => {
  const sceneRef = useRef(new THREE.Scene());
  const exportModel = () => {
    if (!sceneRef.current) return;

    const exporter = new GLTFExporter();
    exporter.parse(
      sceneRef.current,
      (result) => {
        const blob = new Blob([JSON.stringify(result)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        // setModel(url); 
        dispatch({ type: "SET_MODEL", payload: url });
    },
      { binary: true }
    );
  };

  useEffect(() => {
    if (levels.length > 0) {
      exportModel();
    }
  }, [levels]);

  return (
    <div className="flex-1 w-screen flex-wrap p-4 md:p-6 flex flex-col items-center justify-center">
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
            sceneRef.current = scene;
            exportModel()
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
