// ModelViewer.js
import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import base from "../../assets/GLBs/Shelfs glb/Shelf1.glb";

const LoadingIndicator = () => {
  return (
    <mesh visible position={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[1, 16, 16]} />
      <meshStandardMaterial
        attach="material"
        color="orange"
        transparent
        opacity={0.1}
        roughness={1}
        metalness={1}
      />
    </mesh>
  );
};

// Component to render the 3D model
const Model = ({ color, scale }) => {
  const { scene } = useGLTF(base);

  scene.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;

      if (node.material) {
        node.material.color.set(color);
        node.material.needsUpdate = true;
        node.material.roughness = 0.5;
        node.material.metalness = 0.5;
      }

      node.scale.set(scale, scale, scale);
    }
  });

  return <primitive object={scene} />;
};

// Component to render the levels
const Level = ({ url, position, color, scale }) => {
  const { scene } = useGLTF(url);

  scene.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;

      if (node.material) {
        node.material.color.set(color);
        node.material.needsUpdate = true;
        node.material.roughness = 0.5;
        node.material.metalness = 0.5;
      }

      node.scale.set(scale, scale, scale);
    }
  });

  return <primitive object={scene} position={position} />;
};

// ModelViewer Component
const ModelViewer = ({ modelColor, scale, levels }) => {
  return (
    <div className="flex-1 p-4 md:p-6">
      <Canvas
        shadows
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 5], fov: 75 }}
      >
        <Suspense fallback={<LoadingIndicator />}>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 10]}
            intensity={10}
            castShadow
          />
          <Model color={modelColor} scale={scale} />
          {levels.map((level, index) => (
            <Level
              key={index}
              url={level.url}
              position={level.position}
              color={modelColor}
              scale={scale}
            />
          ))}
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ModelViewer;
