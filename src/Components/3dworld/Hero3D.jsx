import React, { useState } from "react";
import ModelViewer from "./modalFor3D";
import ARView from "./ARView"; // Import the AR view component
import level2 from "../../assets/GLBs/Shelfs glb/Shelf2.glb";
import level3 from "../../assets/GLBs/Shelfs glb/Shelf3.glb";
import level4 from "../../assets/GLBs/Shelfs glb/Shelf4.glb";
import logo from "../../assets/logos/dura.webp";
import { TbAugmentedReality, TbView360Number } from "react-icons/tb";

// Main App component
const App = () => {
  const [modelColor, setModelColor] = useState("#ffffff");
  const [scale, setScale] = useState(10);
  const [levels, setLevels] = useState([]);
  const [activeView, setActiveView] = useState("VR"); // Default to VR

  const levelUrls = [level2, level3, level4];

  const addLevel = () => {
    if (levels.length < levelUrls.length) {
      const newLevels = [
        ...levels,
        {
          url: levelUrls[levels.length],
          position: [0, 0, 0], // No height offset
        },
      ];
      setLevels(newLevels);
    }
  };

  const removeLevel = () => {
    if (levels.length > 0) {
      const newLevels = levels.slice(0, -1);
      setLevels(newLevels);
    }
  };

  const toggleView = (view) => {
    setActiveView(view);
    console.log(`${view} View`);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar for Configuration */}
      <div className="w-full md:w-80 p-4 md:p-6 bg-gray-200 shadow-lg rounded-lg flex-shrink-0">
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Logo"
            className="w-24 md:w-36 h-auto"
          />
        </div>

        {/* Toggle Button for AR and VR views */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-300 rounded-full p-1 shadow-inner">
            <button
              onClick={() => toggleView("AR")}
              className={`px-4 py-2 rounded-full transition duration-300 ${
                activeView === "AR"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
               <div className="flex items-center gap-2">  <TbAugmentedReality size={24} /> <span>AR View</span></div>  
            </button>
            <button
              onClick={() => toggleView("VR")}
              className={`px-4 py-2 rounded-full transition duration-300 ${
                activeView === "VR"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            >
           <div className="flex items-center gap-2">  <TbView360Number size={24}/><span>VR View</span></div>  
            </button>
          </div>
        </div>

        <h2 className="text-xl md:text-2xl mb-6 text-gray-800 text-center md:text-left">Model Configurator</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Model Color:
            <input
              type="color"
              value={modelColor}
              onChange={(e) => setModelColor(e.target.value)}
              className="ml-2 w-12 h-8 border-none p-1 rounded-md cursor-pointer"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Scale:
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="ml-2 p-2 border border-gray-300 rounded-md w-full"
            />
          </label>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start space-x-4 mb-4">
          <button
            onClick={addLevel}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
          >
            Add Level
          </button>
          <button
            onClick={removeLevel}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 transition duration-300"
          >
            Remove Level
          </button>
        </div>
      </div>

      {/* Conditional Rendering */}
      {activeView === "VR" ? (
        <ModelViewer modelColor={modelColor} scale={scale} levels={levels} />
      ) : activeView === "AR" ? (
        <ARView />
      ) : (
        <div className="flex-1 p-4 md:p-6 flex items-center justify-center h-full">
          <p className="text-gray-800">Select a view to start.</p>
        </div>
      )}
    </div>
  );
};

export default App;
