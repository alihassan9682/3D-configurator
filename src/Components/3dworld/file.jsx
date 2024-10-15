import React, { useEffect, useRef, Suspense, useCallback, useState } from "react";
import {
    Canvas, useThree, useFrame
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

// const Level = ({ url, position, scale, rotation, onClick }) => {
//   const { scene } = useGLTF(url);
//   const groupRef = useRef();
//   const { raycaster, mouse, camera } = useThree();

//   const clonedScene = scene.clone();

//   useFrame(() => {
//     if (groupRef.current) {
//       raycaster.setFromCamera(mouse, camera);
//       const intersects = raycaster.intersectObject(groupRef.current, true);
//       if (intersects.length > 0) {
//         document.body.style.cursor = 'pointer';
//       } else {
//         document.body.style.cursor = 'default';
//       }
//     }
//   });

//   const handleClick = useCallback((event) => {
//     event.stopPropagation();
//     if (groupRef.current) {
//       raycaster.setFromCamera(mouse, camera);
//       const intersects = raycaster.intersectObject(groupRef.current, true);
//       if (intersects.length > 0) {
//         const clickPosition = intersects[0].point;
//         onClick({
//           position: clickPosition,
//           cameraPosition: camera.position.clone(),
//           normalVector: intersects[0].face.normal.clone()
//         });
//       }
//     }
//   }, [raycaster, mouse, camera, onClick]);

//   clonedScene.traverse((node) => {
//     if (node.isMesh) {
//       node.castShadow = true;
//       node.receiveShadow = true;
//       if (node.material) {
//         node.material.roughness = 0.5;
//         node.material.metalness = 0.5;
//       }
//     }
//   });

//   return (
//     <group ref={groupRef} position={position} scale={scale} rotation={rotation} onClick={handleClick}>
//       <primitive object={clonedScene} />
//     </group>
//   );
// };

// const ModelViewer = ({
//   scale,
//   levels,
//   dispatch,
//   toast,
//   psingleCount
// }) => {
//   const sceneRef = useRef(new THREE.Scene());
//   const cameraRef = useRef();
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedPart, setSelectedPart] = useState(null);

//   const exportModel = useCallback(() => {
//     if (!sceneRef.current) return;
//     console.log("Exporting model...");

//     const exporter = new GLTFExporter();
//     exporter.parse(
//       sceneRef.current,
//       (result) => {
//         const blob = new Blob([JSON.stringify(result)], { type: "application/json" });
//         const url = URL.createObjectURL(blob);
//         dispatch({ type: "SET_MODEL", payload: url });
//       },
//       { binary: true }
//     );
//   }, [dispatch]);

//   useEffect(() => {
//     if (levels.length > 0) {
//       setIsLoading(true);
//       setTimeout(() => {
//         exportModel();
//         setIsLoading(false);
//       }, 1000);
//     }
//   }, [levels, exportModel]);

//   const handleClick = useCallback((event) => {
//     event.preventDefault();

//     if (!cameraRef.current || !sceneRef.current) {
//       console.error("Camera or scene reference is missing");
//       return;
//     }

//     // Normalize mouse coordinates
//     const mouse = new THREE.Vector2();
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//     const raycaster = new THREE.Raycaster();
//     raycaster.setFromCamera(mouse, cameraRef.current);

//     const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

//     if (intersects.length > 0) {
//       const clickedPosition = intersects[0].point;
//       const xPosition = clickedPosition.x;
//       const zPosition = clickedPosition.z;
//       const yPosition = clickedPosition.y;

//       console.log("Clicked X Position:", xPosition);
//       console.log("Clicked Y Position:", yPosition);
//       console.log("Clicked Z Position:", zPosition);

//       const Grill =
//         xPosition < 1.2 ? "Platform 01" :
//           xPosition < 2.06 ? "Platform 02" :
//             xPosition < 3.59 ? "Platform 03" :
//               xPosition < 6.12 ? "Platform 04" : null;

//       if (Grill) {
//         console.log(`Selected ${Grill}`);
//         toast.success(`Selected ${Grill}`);
//         setSelectedPart(Grill);
//         dispatch({ type: "SET_SELECTED_PART", payload: clickedPosition });
//       } else {
//         console.log("Clicked outside of defined platforms");
//         toast.info("Clicked outside of defined platforms");
//         setSelectedPart(null);
//       }
//     } else {
//       console.log("No intersection found");
//       toast.info("No intersection found. Try clicking on a visible part of the model.");
//       setSelectedPart(null);
//     }
//   }, [dispatch, toast]);

//   const ClickHandler = () => {
//     const { camera, scene } = useThree();
//     useEffect(() => {
//       cameraRef.current = camera;
//       sceneRef.current = scene;
//     }, [camera, scene]);

//     return null;
//   };

//   return (
//     <div className="flex-1 w-screen flex-wrap md:h-screen flex flex-col items-center justify-center relative">
//       {levels.length === 0 ? (
//         <div className="text-gray-600 text-center">
//           <p className="text-xl font-semibold mb-4">Add Levels and Configure Your Personalized Model</p>
//           <p>Please use the controls on the side to add levels to your model.</p>
//         </div>
//       ) : (
//         <>
//           <Canvas
//             onClick={handleClick}
//             shadows
//             style={{ width: "100%", height: "100%" }}
//             camera={{ position: [0, 0, 5], fov: 75 }}
//           >
//             <ClickHandler />
//             <Suspense fallback={<LoadingIndicator />}>
//               <spotLight position={[10, 10, 10]} intensity={1} castShadow />
//               <directionalLight position={[10, 10, 10]} intensity={1} castShadow />

//               {levels.map((level, index) => (
//                 <Level
//                   key={`${level.url}-${index}-${Math.random()}`}
//                   url={level.url}
//                   position={level.position}
//                   scale={[scale, scale, scale]}
//                   rotation={level.rotation}
//                 />
//               ))}
//                 <OrbitControls
//                   enablePan={Boolean("Pan", true)}
//                   enableZoom={Boolean("Zoom", true)}
//                   enableRotate={Boolean("Rotate", true)}
//                 />
//               </Suspense>
//           </Canvas>
//           {isLoading && (
//             <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//               <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
//             </div>
//           )}
//           {selectedPart && (
//             <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow">
//               Selected Part: {selectedPart}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default ModelViewer;


const DetectionMesh = ({ position, size, onClick, index }) => {
    const meshRef = useRef();

    useFrame(({ raycaster, camera, mouse }) => {
        if (meshRef.current) {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(meshRef.current);
            document.body.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
        }
    });

    return (
        <mesh ref={meshRef} position={position} onClick={(e) => onClick(e, index)}>
            <boxGeometry args={size} />
            <meshBasicMaterial
                transparent
                opacity={0.01} // Make the mesh almost invisible
                wireframe={true} // Optional: Enable wireframe mode
                color={`hsl(${index * 90}, 100%, 50%)`} // Assign color based on index, but it won't be visible due to opacity
            />
        </mesh>
    );
};
const Level = ({ url, position, scale, rotation, onClick }) => {
    const { scene } = useGLTF(url);
    const groupRef = useRef();
    const { camera } = useThree();  // Access camera here

    const clonedScene = scene.clone();

    const handleClick = useCallback((event, index) => {
        event.stopPropagation();
        const clickPosition = event.point;
        onClick({
            position: clickPosition,
            cameraPosition: camera.position.clone(), // Now using the correct camera
            normalVector: event.face.normal.clone(),
            platformIndex: index + 1, // Index starts from 1
        });
    }, [camera, onClick]); // Include `camera` in the dependency array

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

    // Calculate bounding box of the model
    const bbox = new THREE.Box3().setFromObject(clonedScene);
    const modelSize = new THREE.Vector3();
    bbox.getSize(modelSize);

    // Define 4 platforms based on the size of the model
    const detectionMeshes = [];
    const platformWidth = modelSize.x / 4; // Each platform occupies 1/4th of the model's width
    const meshSize = [platformWidth, modelSize.y, modelSize.z]; // Same size for all meshes

    // Create 4 detection meshes
    for (let i = 0; i < 4; i++) {
        // Position each mesh at the center of its platform
        const xPosition = bbox.min.x + (i + 0.5) * platformWidth;

        detectionMeshes.push(
            <DetectionMesh
                key={`detection-mesh-${i}`}
                position={[xPosition, 0, 0]} // Correctly calculate x position
                size={meshSize} // Set the size based on the platform width
                onClick={handleClick}
                index={i} // Pass index to handleClick
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
const ModelViewer = ({
    scale,
    levels,
    dispatch,
    toast,
    psingleCount
}) => {
    const sceneRef = useRef(new THREE.Scene());
    const cameraRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPart, setSelectedPart] = useState(null);

    // ... [exportModel function remains unchanged]
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
            console.log("Clicked Position:", clickedPosition);

            // Determine which part was clicked based on the x-position
            const partIndex = Math.floor((clickedPosition.x + 3) / (6 / psingleCount));
            const partName = `Platform ${String(partIndex).padStart(2, '0')}`;

            console.log(`Selected ${partName}`);
            toast.success(`Selected ${partName}`);
            setSelectedPart(partName);
            dispatch({ type: "SET_SELECTED_PART", payload: clickedPosition });
        } else {
            console.log("No intersection found");
            toast.info("No intersection found. Try clicking on a visible part of the model.");
            setSelectedPart(null);
        }
    }, [dispatch, toast, psingleCount]);

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
                                    psingleCount={psingleCount}
                                />
                            ))}
                            <OrbitControls
                                enablePan={Boolean("Pan", true)}
                                enableZoom={Boolean("Zoom", true)}
                                enableRotate={Boolean("Rotate", true)}
                            />
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



import React, { useEffect, useRef, Suspense, useCallback, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

// ... (Previous components remain unchanged)












