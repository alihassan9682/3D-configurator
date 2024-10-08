import React, { useEffect, useRef, Suspense, useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
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

  const handlePointerOver = (event) => {
    event.stopPropagation();
    if (event.object !== hovered) {
      if (hovered) {
        hovered.material = originalMaterials[hovered.uuid];
      }
      setHovered(event.object);
      event.object.material = new THREE.MeshStandardMaterial({ color: "red" });
    }
  };

  const handlePointerOut = () => {
    if (hovered) {
      hovered.material = originalMaterials[hovered.uuid];
      setHovered(null);
    }
  };

  return (
    <primitive
      object={scene.clone()}
      position={position}
      scale={scale}
      rotation={[0, rotation, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  );
};


const ModelViewer = ({
  scale,
  levels,
  dispatch,
  toast}) => {
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef();
  const [hoveredPosition, setHoveredPosition] = useState(null);

  const exportModel = () => {
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
  };

  useEffect(() => {
    if (levels.length > 0) {
      exportModel();
    }
  }, [levels]);

  const handleClick = useCallback((event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      const clickedPosition = intersects[0].point; // World position of the clicked point

      if (clickedObject.isMesh) {
        console.log("Clicked object:", clickedObject.name);

        const positionData = {
          x: clickedPosition.x,
          y: clickedPosition.y,
          z: clickedPosition.z,
          axis: 'XYZ',
        };
        console.log("Position data:", positionData);
        const Grill = positionData.x < 1.53 ? "Platform 01" : positionData.x < 3.06 ? "Platform 02" : positionData.x < 4.59 ? "Platform 03" : positionData.x < 6.12 ? "Platform 04" : null
        toast.success(`Selected ${Grill} `)
        dispatch({ type: "SET_SELECTED_PART", payload: positionData.x });
      }
    }
  }, [dispatch]);

  const handleHover = (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;
      const hoveredPosition = intersects[0].point.x; // Get the x position of the hovered point

      console.log("Hovered Object:", hoveredObject.name);
      console.log("Hovered X Position:", hoveredPosition);
     

      setHoveredPosition(hoveredPosition);
    } else {
      setHoveredPosition(null);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [handleClick]);

  return (
    <div className="flex-1 w-screen flex-wrap md:h-screen flex flex-col items-center justify-center">
      {levels.length === 0 ? (
        <div className="text-gray-600 text-center">
          <p className="text-xl font-semibold mb-4">Add Levels and Configure Your Personalized Model</p>
          <p>Please use the controls on the side to add levels to your model.</p>
        </div>
      ) : (
          <Canvas
            onClick={handleClick} // Attach click handler directly to the Canvas
            shadows
            style={{ width: "100%", height: "100%" }}
            camera={{ position: [0, 0, 5], fov: 75 }}
            onCreated={({ camera, scene }) => {
              cameraRef.current = camera;
              sceneRef.current = scene;
              exportModel();
            }}
          >
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
      )}
    </div>
  );
};

export default ModelViewer;
