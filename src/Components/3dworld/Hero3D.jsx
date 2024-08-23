import React, { useState } from "react";
import ModelViewer from "./modalFor3D";
import ARView from "./ARView";
import level2 from "../../assets/GLBs/Shelfs_Segment/6InShelf.glb";
import level3 from "../../assets/GLBs/Shelfs_Segment/12InShelf.glb";
import level4 from "../../assets/GLBs/Shelfs_Segment/24InShelf.glb";
import logo from "../../assets/logos/dura.webp";
import { TbAugmentedReality, TbView360Number } from "react-icons/tb";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles

const App = () => {
  const [scale] = useState(0.05);
  const [levels, setLevels] = useState([]);
  const [cumulativeHeight, setCumulativeHeight] = useState(0);
  const [activeView, setActiveView] = useState("VR");
  const [selectedOption, setSelectedOption] = useState("PDOUBLE");
  const [dropHeight, setDropHeight] = useState(6);

  const actualHeights = {
    6: 6,
    12: 12,
    24: 24,
  };

  const levelUrls = {
    6: level2,
    12: level3,
    24: level4,
  };

  const maxLayers = {
    PDOUBLE: 2,
    PTRIPLE: 3,
    PQUAD: 4,
    PTRIPLE_L: 0, // Disabled
    PQUAD_L: 0, // Disabled
  };

  const adjustLayers = (newOption) => {
    const allowedLayers = maxLayers[newOption];
    if (levels.length > allowedLayers) {
      // Remove excess layers
      const excess = levels.length - allowedLayers;
      const newLevels = levels.slice(0, -excess);
      const removedHeight = levels.slice(-excess).reduce((sum, level) => sum + level.height, 0);
      
      setLevels(newLevels);
      setCumulativeHeight(cumulativeHeight - removedHeight);
      toast.info(`Removed ${excess} extra layer(s) for ${newOption}`);
    }
  };

  const addLevel = () => {
    if (levels.length >= maxLayers[selectedOption]) {
      toast.error(`Cannot add more than ${maxLayers[selectedOption]} layers for ${selectedOption}`);
      return;
    }

    const selectedLevelUrl = levelUrls[dropHeight];
    const actualHeight = actualHeights[dropHeight] * scale;
    const newPosition = [0, -cumulativeHeight - actualHeight, 0];
    const newLevel = {
      id: Date.now(),
      url: selectedLevelUrl,
      position: newPosition,
      height: actualHeight,
    };

    setCumulativeHeight(cumulativeHeight + actualHeight);
    setLevels([...levels, newLevel]);
    toast.success(`Added level with height ${dropHeight} inches`);
  };

  const removeLevel = () => {
    if (levels.length > 0) {
      const lastLevel = levels[levels.length - 1];
      setCumulativeHeight(cumulativeHeight - lastLevel.height);
      setLevels(levels.slice(0, -1));
      toast.info('Removed the last level');
    }
  };

  const toggleView = (view) => {
    setActiveView(view);
  };

  const handleDropdownChange = (e) => {
    const newOption = e.target.value;
    setSelectedOption(newOption);
    adjustLayers(newOption);
  };

  const handleDropHeightChange = (e) => {
    setDropHeight(parseInt(e.target.value));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-80 p-4 md:p-6 bg-gray-200 shadow-lg rounded-lg flex-shrink-0">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-24 md:w-36 h-auto" />
        </div>

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
              <div className="flex items-center gap-2">
                <TbAugmentedReality size={24} /> <span>AR View</span>
              </div>
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
              <div className="flex items-center gap-2">
                <TbView360Number size={24} />
                <span>VR View</span>
              </div>
            </button>
          </div>
        </div>

        <h2 className="text-xl md:text-2xl mb-6 text-gray-800 text-center md:text-left">
          Model Configurator
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Select Model Type:
          </label>
          <select
            value={selectedOption}
            onChange={handleDropdownChange}
            className="p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="PDOUBLE">PDOUBLE</option>
            <option value="PTRIPLE">PTRIPLE</option>
            <option value="PTRIPLE-L" disabled>PTRIPLE-L</option>
            <option value="PQUAD">PQUAD</option>
            <option value="PQUAD-L" disabled>PQUAD-L</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Drop Level Height:
          </label>
          <select
            value={dropHeight}
            onChange={handleDropHeightChange}
            className="p-2 border border-gray-300 rounded-md w-full"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
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

      {activeView === "VR" ? (
        <ModelViewer scale={scale} dropHeight={dropHeight} levels={levels} />
      ) : activeView === "AR" ? (
        <ARView />
      ) : (
        <div className="flex-1 p-4 md:p-6 flex items-center justify-center h-full">
          <p className="text-red-700">Select a view to start.</p>
        </div>
      )}

      {/* Add ToastContainer component */}
      <ToastContainer />
    </div>
  );
};

export default App;
