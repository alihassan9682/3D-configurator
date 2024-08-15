/** @format */

import React, { Suspense, useState } from "react";
import { Canvas } from "react-three-fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import "react-responsive-modal/styles.css";
import base from "../../assets/GLBs/Shelfs glb/Shelf1.glb";
import level2 from "../../assets/GLBs/Shelfs glb/Shelf2.glb";
import level3 from "../../assets/GLBs/Shelfs glb/Shelf3.glb";
import level4 from "../../assets/GLBs/Shelfs glb/Shelf4.glb";

// Component to render dynamic cubes
const Cubes = ({ cubes, onRemoveCube }) => {
  return (
    <>
      {cubes.map((cube) => (
        <mesh
          key={cube.id}
          position={cube.position}
          onClick={() => onRemoveCube(cube.id)}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={cube.color} />
        </mesh>
      ))}
    </>
  );
};

// Component to render the 3D model
const Model = ({ color, scale}) => {
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

// Main App component
const App = () => {
  const [modelColor, setModelColor] = useState("#ffffff");
  const [scale, setScale] = useState(1);
  const [cubes, setCubes] = useState([]);
  const [cubeColor, setCubeColor] = useState("#ff0000");

  const addCube = () => {
    setCubes([
      ...cubes,
      {
        id: Date.now(),
        position: [
          Math.random() * 2 - 1,
          scale / 2 + 1,
          Math.random() * 2 - 1,
        ],
        color: cubeColor,
      },
    ]);
  };

  const removeCube = (id) => {
    setCubes(cubes.filter((cube) => cube.id !== id));
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar for Configuration */}
      <div
        style={{
          width: "300px",
          padding: "20px",
          background: "#f0f0f0",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Model Configurator</h2>
        <div>
          <label>
            Model Color:
            <input
              type="color"
              value={modelColor}
              onChange={(e) => setModelColor(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Scale:
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
            />
          </label>
        </div>
        <div>
          <label>
            Cube Color:
            <input
              type="color"
              value={cubeColor}
              onChange={(e) => setCubeColor(e.target.value)}
            />
          </label>
        </div>
        <button onClick={addCube}>Add Cube</button>
      </div>

      {/* 3D Model Viewer */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Canvas
          shadows
          style={{ width: "100%", height: "100%" }}
          camera={{ position: [0, 0, 5], fov: 75 }}
        >
          <Suspense fallback={<LoadingIndicator />}>
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 10, 10]}
              intensity={1}
              castShadow
            />
            <Model color={modelColor} scale={scale} />
            <Cubes cubes={cubes} onRemoveCube={removeCube} />
            <OrbitControls />
            {/* Ground plane to receive shadows */}
            {/* <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -1.4, 0]}
              receiveShadow
            >
              <planeGeometry args={[100, 100]} />
              <shadowMaterial opacity={0.3} />
            </mesh> */}
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

// Loading indicator component
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

export default App;
