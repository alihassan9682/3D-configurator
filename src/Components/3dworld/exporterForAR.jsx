import React, { useEffect, useRef, Suspense, useCallback, useState } from "react";
import {
  Canvas, useThree
} from "@react-three/fiber";
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

const Level = ({ url, position, scale, rotation, }) => {
  const { scene } = useGLTF(url);
  const [hovered, setHovered] = useState(null);
  const clonedScene = scene.clone();

  const [originalMaterials, setOriginalMaterials] = useState({});
  useEffect(() => {
    const clonedScene = scene.clone();

    const materials = {};
    clonedScene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        if (node.material) {
          node.material.roughness = 0.5;
          node.material.metalness = 0.5;
          materials[node.uuid] = node.material.clone();
        }
      }
    });
    setOriginalMaterials(materials);
  }, [scene]);

  // const handlePointerOver = (event) => {
  //   event.stopPropagation();
  //   if (event.object !== hovered) {
  //     if (hovered) {
  //       hovered.material = originalMaterials[hovered.uuid];
  //     }
  //     setHovered(event.object);
  //     event.object.material = new THREE.MeshStandardMaterial({ color: "red" });
  //   }
  // };

  // const handlePointerOut = () => {
  //   if (hovered) {
  //     hovered.material = originalMaterials[hovered.uuid];
  //     setHovered(null);
  //   }
  // };
  // console.log("Hovered Position:", hovered)
  // console.log("Rotation Value", rotation)


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
  return (
    <primitive
      object={scene.clone()}
      position={position}
      scale={scale}
      rotation={rotation}
    // onPointerOver={handlePointerOver}
    // onPointerOut={handlePointerOut}
    />
  );
};



const ModelViewer = ({
  scale,
  levels,
  dispatch,
  toast
}) => {
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

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

  const handleClick = useCallback((event) => {
    event.preventDefault();
    // ClickHandler();
    console.log("Click event triggered");

    if (!cameraRef.current || !sceneRef.current) {
      console.error("Camera or scene reference is missing");
      return;
    }

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

    if (intersects.length > 0) {
      const clickedPosition = intersects[0].point;
      const xPosition = clickedPosition.x;
      const zPosition = clickedPosition.z;
      const yPosition = clickedPosition.y;

      console.log("Clicked X Position:", xPosition);
      console.log("Clicked yPosition:", yPosition);
      console.log("Clicked zPosition:", zPosition);

      const Grill =
        xPosition < 1.2 ? "Platform 01" :
          xPosition < 2.06 ? "Platform 02" :
            xPosition < 3.59 ? "Platform 03" :
              xPosition < 6.12 ? "Platform 04" : null;

      if (Grill) {
        console.log(`Selected ${Grill}`);
        toast.success(`Selected ${Grill}`);
        setSelectedPart(Grill);
        dispatch({ type: "SET_SELECTED_PART", payload: clickedPosition });
      } else {
        console.log("Clicked outside of defined platforms");
        toast.info("Clicked outside of defined platforms");
        setSelectedPart(null);
      }
    } else {
      console.log("No intersection found");
      toast.info("No intersection found. Try clicking on a visible part of the model.");
      setSelectedPart(null);
    }
  }, [dispatch, toast]);

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
            onClick={handleClick}
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