import React, { useEffect, useRef, Suspense, useCallback, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

const LoadingIndicator = () => {
  return (
    <mesh visible position={[0, 0, 0]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="orange" transparent opacity={0.1} roughness={1} metalness={1} />
    </mesh>
  );
};

const Level = ({ url, position, scale, rotation }) => {
  const { scene } = useGLTF(url);
  return (
    <primitive
      object={scene.clone()}
      position={position}
      scale={scale}
      rotation={rotation}
    />
  );
};

const ModelViewer = ({ scale, levels, dispatch, toast }) => {
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  let lastClickTime = 0;

  const exportModel = useCallback(() => {
    if (!sceneRef.current) return;
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

  const getModelBoundingBox = (scene) => {
    const box = new THREE.Box3();
    box.setFromObject(scene);
    return box;
  };

  const handleClick = (event) => {
    event.preventDefault();
    const now = Date.now();
    if (now - lastClickTime < 200) return; // Throttle clicks
    lastClickTime = now;

    if (!cameraRef.current || !sceneRef.current) {
      console.error("Camera or scene reference is missing");
      return;
    }

    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
    
    if (intersects.length > 0) {
      const clickedPosition = intersects[0].point;
      const boundingBox = getModelBoundingBox(sceneRef.current);
      
      if (boundingBox.containsPoint(clickedPosition)) {
        handleObjectSelection(clickedPosition);
      } else {
        toast.info("Clicked outside the model's bounding area.");
      }
    } else {
      toast.info("No intersection found. Try clicking on a visible part of the model.");
    }
  };

  const handleObjectSelection = (clickedPosition) => {
    const xPosition = clickedPosition.x;
    const Grill =
      xPosition < 1 ? "Platform 01" :
      xPosition < 2.321 ? "Platform 02" :
      xPosition < 3.59 ? "Platform 03" :
      xPosition < 5 ? "Platform 04" : null;

    if (Grill) {
      toast.success(`Selected ${Grill}`);
      setSelectedPart(Grill);
      dispatch({ type: "SET_SELECTED_PART", payload: xPosition });
    } else {
      toast.info("Clicked outside of defined platforms");
      setSelectedPart(null);
    }
  };

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
            onPointerDown={handleClick}
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
                />
              ))}
              <OrbitControls />
            </Suspense>
          </Canvas>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
          {selectedPart && (
            <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow">
              Selected Part: {selectedPart}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ModelViewer;
