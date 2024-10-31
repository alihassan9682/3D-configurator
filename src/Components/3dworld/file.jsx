import React, { useEffect, useRef, Suspense, useCallback, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { toast } from "react-toastify";
import { FaArrowUp } from "react-icons/fa";

// LoadingIndicator component
const LoadingIndicator = () => {
    return (
        <mesh visible position={[0, 0, 0]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="orange" transparent opacity={0} roughness={1} metalness={1} />
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

    if ((groupType === "PTRIPLE_L" && platformNumber === 3) ||
        (groupType === "PQUAD_L" && platformNumber === 4)) {
        position[2] = 20;
    } else {
        position[2] = -12;
    }
    let adjustedSize = [...size];
    if (groupType === "PTRIPLE_L" || groupType === "PQUAD_L") {
        if ((groupType === "PTRIPLE_L" && (platformNumber === 2 || platformNumber === 3)) ||
            (groupType === "PQUAD_L" && (platformNumber === 3 || platformNumber === 4))) {
            // Adjust size for the last platform
            adjustedSize[0] = 30;
        } else {
            // Keep original size for other platforms
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

const Level = ({ url, position, scale, onClick, levelIndex, groupType, parentGroupType }) => {
    const { scene } = useGLTF(url);
    const groupRef = useRef();
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

    const bbox = new THREE.Box3().setFromObject(clonedScene);
    const modelSize = new THREE.Vector3();
    bbox.getSize(modelSize);
    const detectionMeshes = [];
    const platformCount = getPlatformCount(groupType);

    const spacing = 2;
    const meshPadding = 5;
    const totalWidth = modelSize.x;
    const singleMeshWidth = (totalWidth - (spacing * (platformCount - 1))) / platformCount;

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
        <group ref={groupRef} position={position} scale={scale}>
            <primitive object={clonedScene} />
            {detectionMeshes}
        </group>
    );
};

// ModelViewer component
const ModelViewer = ({ scale, levels, dispatch, platformName, scrollToTopRef, selectedPart }) => {
    const sceneRef = useRef(new THREE.Scene());
    const cameraRef = useRef();
    const [isLoading, setIsLoading] = useState(false);

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

    // Updated handleClick logic for last platform behavior
    const handleClick = useCallback(
        ({ position, levelIndex, platformNumber, groupType }) => {
            const platformName = `${groupType} Platform ${platformNumber}`;
            toast.success(`Selected ${platformName}`);
            dispatch({ type: "SET_SELECTED_PART", payload: platformNumber });
            // Dispatch platform name
            dispatch({ type: "SET_PLATFORM_NAME", payload: platformNumber });
            const platformCount = getPlatformCount(groupType);
            // Regular behavior
            if ((groupType === "PTRIPLE_L" && platformNumber === 3) || (groupType === "PQUAD_L" && platformNumber === 4)) {
                const exactX = platformNumber === 1 ? 0 : groupType === "PTRIPLE_L" && platformNumber === 3 || platformNumber === 2 ? 1.53 : platformNumber === 3 || platformNumber === 4 && groupType === "PQUAD_L" ? 3.06 : 0;
                dispatch({ type: "SET_SELECTED_PART", payload: exactX });
                const exactZ = 1.53;
                // console.log(`Exact click position (z): ${exactZ}`);
                dispatch({ type: "SET_SELECTED_PART_Z", payload: exactZ });
            }
            else {
                const exactX = platformNumber === 1 ? 0 : platformNumber === 2 ? 1.53 : platformNumber === 3 ? 3.06 : 4.59;
                dispatch({ type: "SET_SELECTED_PART", payload: exactX })
            }
        },
        [dispatch]
    );

    const ClickHandler = () => {
        const { camera, scene } = useThree();
        useEffect(() => {
            cameraRef.current = camera;
            sceneRef.current = scene;
        }, [camera, scene]);
        return null;
    };
    const handleScrollToTop = () => {
        scrollToTopRef.current.scrollIntoView({ behavior: "smooth" });
    };
    return (
        <div className="flex flex-wrap h-screen w-screen flex-col items-center bg-gray-200 justify-center relative" ref={scrollToTopRef}>
            {levels.length === 0 ? (
                <div className="text-gray-600 text-center">
                    <p className="text-xl font-semibold mb-4">Add Levels and Configure Your Personalized Model</p>
                    <p>Please use the controls on the side to add levels to your model.</p>
                </div>
            ) : (
                <>
                    <Canvas
                        shadows
                        className="w-full h-screen"
                        camera={{ position: [0, 2, 5], fov: 75 }}
                    >
                        <ClickHandler />
                        <Suspense fallback={<LoadingIndicator />}>
                            {/* SpotLight for main focused lighting */}
                            <spotLight position={[10, 10, 9]} intensity={1.5} castShadow />

                            {/* Additional directional light for ambient light */}
                            <directionalLight position={[-10, 10, -10]} intensity={0.5} />

                            {/* Optional point light for soft illumination from the side */}
                            <pointLight position={[0, 5, 5]} intensity={0.8} />

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
                                />
                            ))}
                            <OrbitControls target={[0, 0, 0]} enablePan={true} enableZoom={true} enableRotate={true} />
                        </Suspense>
                    </Canvas>

                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
                        </div>
                    )}
                    {platformName && (
                        <div className="absolute bottom-4 left-4 bg-gray-200 p-2 rounded shadow flex gap-3">
                            Selected Part: Platform No {platformName}
                        </div>
                    )}

                    <button
                        className="block lg:hidden fixed bottom-6 right-6 z-50 p-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-full shadow-lg"
                        onClick={handleScrollToTop}
                    >
                        <FaArrowUp className="text-2xl" />
                    </button>
                </>
            )}
        </div>
    );
};

// Helper function to get the platform count based on group type
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
