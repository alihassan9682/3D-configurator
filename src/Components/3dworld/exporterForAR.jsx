import React, { useEffect, useRef, Suspense, useCallback, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

// ... (LoadingIndicator component remains unchanged)
const LoadingIndicator = () => {
  return (
    <mesh visible position={[0, 0, 0]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="orange" transparent opacity={0.1} roughness={1} metalness={1} />
    </mesh>
  );
};
const DetectionMesh = ({ position, size, onClick, levelIndex, platformNumber }) => {
  const meshRef = useRef();

  useFrame(({ raycaster, camera, mouse }) => {
    if (meshRef.current) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(meshRef.current);
      document.body.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => onClick(e, levelIndex, platformNumber)}
    >
      <boxGeometry args={size} />
      <meshBasicMaterial transparent opacity={0.01} wireframe={true} />
    </mesh>
  );
};

const Level = ({ url, position, scale, rotation, onClick, levelIndex, platformCount }) => {
  const { scene } = useGLTF(url);
  const groupRef = useRef();
  const { camera } = useThree();

  const clonedScene = scene.clone();

  const handleClick = useCallback((event, levelIndex, platformNumber) => {
    event.stopPropagation();
    const clickPosition = event.point;
    onClick({
      position: clickPosition,
      cameraPosition: camera.position.clone(),
      normalVector: event.face.normal.clone(),
      levelIndex,
      platformNumber,
    });
  }, [camera, onClick]);

  // ... (clonedScene traversal remains unchanged)

  const bbox = new THREE.Box3().setFromObject(clonedScene);
  const modelSize = new THREE.Vector3();
  bbox.getSize(modelSize);

  const detectionMeshes = [];
  const platformWidth = modelSize.x / platformCount;
  const meshSize = [platformWidth, modelSize.y, modelSize.z];

  for (let i = 0; i < platformCount; i++) {
    const xPosition = bbox.min.x + (i + 0.5) * platformWidth;
    detectionMeshes.push(
      <DetectionMesh
        key={`detection-mesh-${levelIndex}-${i}`}
        position={[xPosition, 0, 0]}
        size={meshSize}
        onClick={handleClick}
        levelIndex={levelIndex}
        platformNumber={i + 1}  // Platform numbering starts from 1
      />
    );
  }

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      <primitive object={clonedScene} />
      {detectionMeshes}
    </group>
  );
};


const ModelViewer = ({ scale, levels, dispatch, toast, levelIndex,platformName }) => {
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  // Nested array structure for levels and platforms
  const levelStructure = [
    [1, 2, 3, 4],  // Level 0 (base level) with 4 platforms
    [1, 2, 3],     // Level 1 with 3 platforms
    [1, 2],        // Level 2 with 2 platforms
    [1]           
  ]

  // ... (exportModel function remains unchanged)
  const exportModel = useCallback(() => {
    if (!sceneRef.current) return;
    console.log("Exporting model...");

    const exporter = new GLTFExporter();
    exporter.parse(
      sceneRef.current,
      (result) => {
        const blob = new Blob([JSON.stringify(result)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        dispatch({ type: "SET_MODEL", payload: url });
      },
      { binary: true }
    );
  }, [dispatch]);
  useEffect(() => {
    if (levels.length > 0) {
      setIsLoading(true);
      setTimeout(() => {
        exportModel();
        setIsLoading(false);
      }, 1000);
    }
  }, [levels, exportModel]);
  // ... (useEffect for exporting model remains unchanged)

  const handleClick = useCallback(({ position, levelIndex, platformNumber }) => {
    if (levelIndex < levelStructure.length && platformNumber <= levelStructure[levelIndex].length) {
      const platformName = `Platform ${platformNumber}`;
      console.log(`Selected ${platformName}`);
      toast.success(`Selected ${platformName}`);
      dispatch({ type: "SET_PLATFORM_NAME" ,payload: platformName })
      // Use the exact x position from the click event
      const exactX = position.x;

      console.log(`Exact click position (x): ${exactX}`);
      dispatch({ type: "SET_SELECTED_PART", payload: exactX });
    } else {
      console.log("Invalid platform selected");
      toast.info("Invalid platform selected. Try clicking on a visible part of the model.");
    }
  }, [dispatch, toast, levelStructure]);

  // ... (ClickHandler component remains unchanged)
  const ClickHandler = () => {
    const { camera, scene } = useThree();
    useEffect(() => {
      cameraRef.current = camera;
      sceneRef.current = scene;
    }, [camera, scene]);

    return null;
  };
  return (
    <div className="flex-1 w-screen flex-wrap md:h-screen flex flex-col items-center justify-center relative">
      {levels.length === 0 ? (
        <div className="text-gray-600 text-center">
          <p className="text-xl font-semibold mb-4">Add Levels and Configure Your Personalized Model</p>
          <p>Please use the controls on the side to add levels to your model.</p>
        </div>
      ) : (
        <>
          <Canvas
            shadows
            style={{ width: "100%", height: "100%" }}
            camera={{ position: [0, 0, 5], fov: 75 }}
          >
            <ClickHandler />
            <Suspense fallback={<LoadingIndicator />}>
              <spotLight position={[10, 10, 10]} intensity={1} castShadow />
              <directionalLight position={[10, 10, 10]} intensity={1} castShadow />

              {levels.map((level, index) => (
                <Level
                  key={`${level.url}-${index}-${Math.random()}`}
                  url={level.url}
                  position={level.position}
                  scale={[scale, scale, scale]}
                  rotation={level.rotation}
                  onClick={handleClick}
                  levelIndex={index}
                  platformCount={levelStructure[index] ? levelStructure[index].length : 0}
                />
              ))}
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
              />
            </Suspense>
          </Canvas>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
            {platformName && (
            <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow">
              Selected Part: {platformName}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ModelViewer;