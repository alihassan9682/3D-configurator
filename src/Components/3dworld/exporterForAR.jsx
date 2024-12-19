import React, { useEffect, useRef, Suspense, useCallback, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { toast } from "react-toastify";
import { FaArrowUp } from "react-icons/fa";
import { USDZExporter } from 'three/examples/jsm/exporters/USDZExporter';

const LoadingIndicator = () => {
  return (
    <mesh visible position={[0, 0, 0]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color="orange"
        transparent
        opacity={0.5}
        roughness={1}
        metalness={1}
      />
    </mesh>
  );
};

const DetectionMesh = ({ position, size, onClick, levelIndex, platformNumber, groupType }) => {
  const meshRef = useRef();

  useFrame(({ raycaster, camera, mouse }) => {
    if (meshRef.current) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(meshRef.current);
      document.body.style.cursor = intersects.length > 0 ? "pointer" : "default";
    }
  });

  // Adjust position based on group type and platform number
  if ((groupType === "PTRIPLE_L" && platformNumber === 3) ||
    (groupType === "PQUAD_L" && platformNumber === 4)) {
    position[2] = 20;
  } else {
    position[2] = -12;
  }

  // Adjust size based on group type and platform number
  let adjustedSize = [...size];
  if (groupType === "PTRIPLE_L" || groupType === "PQUAD_L") {
    if ((groupType === "PTRIPLE_L" && (platformNumber === 2 || platformNumber === 3)) ||
      (groupType === "PQUAD_L" && (platformNumber === 3 || platformNumber === 4))) {
      adjustedSize[0] = 30;
    } else {
      adjustedSize[0] = size[0];
    }
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => onClick(e, levelIndex, platformNumber)}
    >
      <boxGeometry args={adjustedSize} />
      <meshBasicMaterial transparent opacity={0} wireframe={true} visible={false} />
    </mesh>
  );
};

const Level = ({ url, position, scale, onClick, levelIndex, groupType, isMesh, setIsSceneReady, originalScale }) => {
  const { scene } = useGLTF(url);
  // console.log(`Loading level with URL: ${url}`);
  // console.log('Loaded scene:', scene);

  const clonedScene = scene.clone();

  const handleClick = useCallback(
    (e, levelIndex, platformNumber) => {
      onClick({
        position: e.point,
        levelIndex,
        platformNumber,
        groupType,
      });
    },
    [onClick, groupType]
  );

  // Calculate bounding box and mesh sizes
  const bbox = new THREE.Box3().setFromObject(clonedScene);
  const modelSize = new THREE.Vector3();
  bbox.getSize(modelSize);

  const detectionMeshes = [];
  const platformCount = getPlatformCount(groupType);

  // Configure mesh dimensions and spacing
  const spacing = 2;
  const meshPadding = 5;
  const totalWidth = modelSize.x;
  const singleMeshWidth = (totalWidth - (spacing * (platformCount - 1))) / platformCount;

  // Create detection meshes for each platform
  for (let i = 0; i < platformCount; i++) {
    const startX = bbox.min.x + (i * (singleMeshWidth + spacing));
    const centerX = startX + (singleMeshWidth / 2);

    detectionMeshes.push(
      <DetectionMesh
        key={`detection-mesh-${levelIndex}-${i}`}
        position={[centerX, modelSize.y - 12, -12]}
        size={[singleMeshWidth + meshPadding, modelSize.y - 4, 33]}
        onClick={handleClick}
        levelIndex={levelIndex}
        platformNumber={i + 1}
        groupType={groupType}
      />
    );
  }

  return (
    <group
      position={[
        position[0],
        position[1] * (originalScale ? 1 : 0.5),
        position[2],
      ]}
      scale={originalScale ? scale : [1 / 39.37, 1 / 39.37, 1 / 39.37]}
    >
      <primitive object={clonedScene} />
      {isMesh ? detectionMeshes : null}
    </group>
  );
};

const ModelViewer = ({ scale, levels, dispatch, platformName, scrollToTopRef, selectedPart, isMesh }) => {
  const [networkSpeed, setNetworkSpeed] = useState(null);
  const sceneRef = useRef(new THREE.Scene());
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [localSelectedPart, setLocalSelectedPart] = useState(null);
  const [localPlatformName, setLocalPlatformName] = useState("");
  const groupRef = useRef();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const [originalScale, setOriginalScale] = useState(false);

  const ClickHandler = () => {
    const { camera, scene } = useThree();
    cameraRef.current = camera;
    sceneRef.current = scene;
    useEffect(() => {

      const timeout = setTimeout(() => {
        // console.log('Scene ready timeout triggered');
        setIsSceneReady(true);
      }, 1500);
      return () => clearTimeout(timeout);
    }, [camera, scene]);
    return null;
  };
  // const logSceneDimensions = () => {
  //   if (!sceneRef.current) return;

  //   const box = new THREE.Box3().setFromObject(sceneRef.current);
  //   const size = new THREE.Vector3();
  //   box.getSize(size);

  //   console.log("Scene Dimensions:", size); // Check size in scene
  // };


  const exportModel = useCallback(() => {
    if (!sceneRef.current || !isSceneReady) {
      console.warn("Scene not ready for export");
      return Promise.reject("Scene not ready");
    }

    return new Promise((resolve, reject) => {
      const exporter = new GLTFExporter();
      exporter.parse(
        groupRef.current,
        (result) => {
          try {
            const blob = new Blob([JSON.stringify(result)], { type: "application/json" });
            const modelUrl = URL.createObjectURL(blob);
            dispatch({ type: "SET_MODEL", payload: modelUrl });
            // captureModelSnapshot();
            // console.log("GLTF export successful");
            resolve();
          } catch (error) {
            console.error("Error in GLTF export:", error);
            reject(error);
          }
        },
        { binary: true } // Export as GLB
      );
    });
  }, [dispatch, localSelectedPart, localPlatformName, isSceneReady]);

  const handleExportUSDZ = useCallback(() => {
    if (!sceneRef.current || !isSceneReady) {
      toast.error("Scene is not ready. Please wait.");
      return Promise.reject("Scene not ready");
    }

    return new Promise((resolve, reject) => {
      try {
        THREE.Cache.clear();
        const exporter = new USDZExporter();

        exporter.parse(groupRef.current, (usdz) => {
          try {
            const blob = new Blob([usdz], { type: "application/octet-stream" });
            dispatch({ type: "SET_MODEL_IOS", payload: blob });
            // console.log("USDZ export successful");
            resolve();
          } catch (error) {
            console.error("Error in USDZ export processing:", error);
            reject(error);
          }
        });
      } catch (error) {
        console.error("Error in USDZ export:", error);
        reject(error);
      }
    });
  }, [dispatch, isSceneReady]);


  const handleClick = useCallback(({ position, levelIndex, platformNumber, groupType }) => {
    const platformName = `${groupType} Platform ${platformNumber}`;
    toast.success(`Selected ${platformName}`);
    setLocalPlatformName(platformName);

    let selectionData = {};
    if ((groupType === "PTRIPLE_L" && platformNumber === 3) ||
      (groupType === "PQUAD_L" && platformNumber === 4)) {
      const exactX = platformNumber === 1 ? 0 :
        (groupType === "PTRIPLE_L" && platformNumber === 3) || platformNumber === 2 ? 1.53 :
          ((platformNumber === 3 || platformNumber === 4) && groupType === "PQUAD_L") ? 3.06 : 0;
      const exactZ = 1.53;
      selectionData = { exactX, exactZ };
    } else {
      const exactX = platformNumber === 1 ? 0 :
        platformNumber === 2 ? 1.53 :
          platformNumber === 3 ? 3.06 : 4.59;
      selectionData = { exactX };
    }
    console.log("Selection Data:", selectionData);
    setLocalSelectedPart(selectionData);
    if (localSelectedPart) {
      dispatch({ type: "SET_PLATFORM_NAME", payload: localPlatformName });
      dispatch({ type: "SET_SELECTED_PART", payload: selectionData.exactX });
      if (localSelectedPart.exactZ) {
        dispatch({ type: "SET_SELECTED_PART_Z", payload: selectionData.exactZ });
      }
    }
  }, []);

  // const captureModelSnapshot = useCallback(() => {
  //   if (!canvasRef.current) return;
  //   const canvas = canvasRef.current.querySelector("canvas");
  //   if (!canvas) return;

  //   const snapshotDataUrl = canvas.toDataURL("image/png");
  //   dispatch({
  //     type: "SET_MODEL_SNAPSHOT",
  //     payload: snapshotDataUrl
  //   });
  // }, [dispatch]);


  const performExports = useCallback(async () => {
    // console.log("Starting exports, scene ready:", isSceneReady);

    // Check if the scene is ready before proceeding
    if (!isSceneReady) {
      toast.error("Scene is not ready. Please wait for it to be ready before exporting.");
      // console.warn("Scene is not ready, skipping export...");
      return; // Exit the function early if the scene is not ready
    }

    const timeout = networkSpeed > 100 ? 0 : 10000; // Instant export if speed > 100 KB/s
    // console.log(`Export timeout set to: ${timeout}ms based on network speed`);

    try {
      // console.log("Waiting before export...");
      await new Promise((resolve) => setTimeout(resolve, timeout)); // Dynamic timeout

      // console.log("Exporting model...");
      setOriginalScale(false);
      await exportModel();
      // await logSceneDimensions();
      // console.log("Exporting USDZ...");
      await handleExportUSDZ();
      setOriginalScale(true);
      setIsLoading(false);
      // console.log("Exports completed successfully");
      toast.success("Export completed successfully!");
    } catch (error) {
      console.error("Export error:", error);

      // Retry logic if export fails
      if (retryCount < maxRetries) {
        // console.log(`Retrying export (Attempt ${retryCount + 1})`);
        setRetryCount((prev) => prev + 1);
        setTimeout(() => performExports(), 5000); // Retry after 5 seconds
      } else {
        console.error("Export failed after multiple attempts");
        setIsLoading(false);
        toast.error("Failed to export model after multiple attempts.");
      }
    }
  }, [exportModel, handleExportUSDZ, isSceneReady, retryCount, maxRetries, networkSpeed]);


  // Global loading timeout
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (!isSceneReady) {
        // console.error('Scene loading timed out');
        setIsSceneReady(true);
        setIsLoading(false);
        toast.error('Model loading timed out');
      }
    }, 30000); // 30 seconds timeout

    return () => clearTimeout(loadingTimeout);
  }, [isSceneReady]);

  // Main export trigger effect
  useEffect(() => {

    if (levels.length > 0 && isSceneReady) {
      setIsLoading(true);
      performExports();
    } else if (levels.length > 0) {
      console.warn('Scene not ready, waiting...');
    }
  }, [levels, isSceneReady]);

  return (
    <div
      ref={canvasRef}
      className="flex  h-screen w-full items-center  justify-center bg-gray-200 relative"
    >
      {levels.length === 0 ? (
        <div className="text-gray-600 text-center">
          <p className="text-xl font-semibold mb-4">Add Levels and Configure Your Personalized Model</p>
          <p>Please use the controls on the side to add levels to your model.</p>
        </div>
      ) : (
        <>
          <Canvas
            gl={{ preserveDrawingBuffer: true }}
            shadows
            className="w-full h-screen"
            camera={{ position: [0, 2, 5], fov: 75 }}
          >
            <ClickHandler />
            <Suspense fallback={<LoadingIndicator />}>
              <spotLight position={[0, 0, 9]} intensity={1.5} castShadow />
              <directionalLight position={[0, 10, -10]} intensity={0.5} />
              <pointLight position={[0, 5, 5]} intensity={0.8} />
              <group ref={groupRef}>
                {levels.map((level, index) => (
                  <Level
                    key={`${level.url}-${index}-${Math.random()}`}
                    url={level.url}
                    position={level.position}
                    scale={[scale, scale, scale]}
                    rotation={level.rotation}
                    onClick={handleClick}
                    levelIndex={index}
                    groupType={level.groupType}
                    parentGroupType={index > 0 ? levels[index - 1].groupType : null}
                    isMesh={isMesh}
                    setIsSceneReady={setIsSceneReady}
                    originalScale={originalScale}
                  />
                ))}
              </group>
              <OrbitControls
                target={[0, 0, 0]}
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

          {localPlatformName && (
            <div className="absolute bottom-4 left-4 bg-gray-200 p-2 rounded shadow flex gap-3">
              Selected Part: {localPlatformName}
            </div>
          )}

          <button
            className="block lg:hidden fixed bottom-6 right-6 z-50 p-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-full shadow-lg"
            onClick={() => scrollToTopRef.current.scrollIntoView({ behavior: "smooth" })}
          >
            <FaArrowUp className="text-2xl" />
          </button>
        </>
      )}
    </div>
  );
};

function getPlatformCount(groupType) {
  switch (groupType) {
    case "PSINGLE":
      return 1;
    case "PDOUBLE":
      return 2;
    case "PTRIPLE":
    case "PTRIPLE_L":
      return 3;
    case "PQUAD":
    case "PQUAD_L":
      return 4;
    default:
      return 1;
  }
}

export default ModelViewer;