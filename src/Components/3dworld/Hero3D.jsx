import React, { useState, useEffect } from "react";
import ModelViewer from "./modalFor3D";
import ARView from "./ARView";
import PD6 from "../../assets/GLBs/P-Double/PD6.glb";
import PD12 from "../../assets/GLBs/P-Double/PD12.glb";
import PD24 from "../../assets/GLBs/P-Double/PD24.glb";
import PT6 from "../../assets/GLBs/PTRIPLE/PT6.glb";
import PT12 from "../../assets/GLBs/PTRIPLE/PT12.glb";
import PT24 from "../../assets/GLBs/PTRIPLE/PT24.glb";
import PTL6 from "../../assets/GLBs/PTRIPLEL/PTL6.glb";
import PTL12 from "../../assets/GLBs/PTRIPLEL/PTL12.glb";
import PTL24 from "../../assets/GLBs/PTRIPLEL/PTL24.glb";
import PQ6 from "../../assets/GLBs/PQUAD/PQ6.glb";
import PQ12 from "../../assets/GLBs/PQUAD/PQ12.glb";
import PQ24 from "../../assets/GLBs/PQUAD/PQ24.glb";
import PQL6 from "../../assets/GLBs/PQUADL/PQL6.glb";
import PQL12 from "../../assets/GLBs/PQUADL/PQL12.glb";
import PQL24 from "../../assets/GLBs/PQUADL/PQL24.glb";

import logo from "../../assets/logos/dura.webp";
import { TbAugmentedReality, TbView360Number } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the styles

const App = () => {
  const [scale] = useState(0.05);
  const [levels, setLevels] = useState([]);
  const [cumulativeHeight, setCumulativeHeight] = useState(0);
  const [activeView, setActiveView] = useState("VR");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLength, setSelectedLength] = useState(24); // Default to 24 inches
  const [platformsPerLevel, setPlatformsPerLevel] = useState(1); // Number of platforms per level
  const [firstLevelAdded, setFirstLevelAdded] = useState(false); // State to track if the first level is added

  const actualHeights = {
    6: 6,
    12: 12,
    24: 24,
  };

  const levelUrls = {
    PDOUBLE: {
      6: PD6,
      12: PD12,
      24: PD24,
    },
    PTRIPLE: {
      6: PT6,
      12: PT12,
      24: PT24,
    },
    PTRIPLE_L: {
      6: PTL6,
      12: PTL12,
      24: PTL24,
    },
    PQUAD: {
      6: PQ6,
      12: PQ12,
      24: PQ24,
    },
    PQUAD_L: {
      6: PQL6,
      12: PQL12,
      24: PQL24,
    },
  };

  useEffect(() => {
    if (selectedType && !firstLevelAdded) {
      addLevel(); // Automatically add the first level when type is selected
    }
  }, [selectedType]);

  useEffect(() => {
    if (firstLevelAdded) {
      // Re-enable inputs once the first level is added
    }
  }, [firstLevelAdded]);

  const addLevel = () => {
    let currentLength = selectedLength;

    // Ensure the first level is always added with 24 inches length
    if (!firstLevelAdded) {
      currentLength = 24;
      setSelectedLength(24); // Force the dropdown to reflect 24 for the first level
    }

    const selectedLevelUrl = levelUrls[selectedType][currentLength];
    const actualHeight = actualHeights[currentLength] * scale;

    let newLevels = [];
    let newCumulativeHeight = cumulativeHeight;

    for (let i = 0; i < platformsPerLevel; i++) {
      const newPosition = [0, -newCumulativeHeight - actualHeight, 0];
      const newLevel = {
        id: Date.now() + i, // Unique ID for each level
        url: selectedLevelUrl,
        position: newPosition,
        height: actualHeight,
      };

      newCumulativeHeight += actualHeight;
      newLevels.push(newLevel);
    }

    setCumulativeHeight(newCumulativeHeight);
    setLevels([...levels, ...newLevels]); // Add all new levels
    setFirstLevelAdded(true); // Mark the first level as added

    toast.success(`Added ${platformsPerLevel} level(s) with ${platformsPerLevel} platform(s) each.`);
  };

  const removeLevel = () => {
    if (levels.length > 0) {
      const lastLevel = levels[levels.length - 1];
      setCumulativeHeight(cumulativeHeight - lastLevel.height);
      setLevels(levels.slice(0, -1));
      toast.info("Removed the last level");
    }
  };

  const toggleView = (view) => {
    setActiveView(view);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleLengthChange = (e) => {
    const selectedLengthValue = parseInt(e.target.value);
    if (levels.length === 0 && selectedLengthValue !== 24) {
      toast.error("The first level must have a length of 24 inches.");
    } else {
      setSelectedLength(selectedLengthValue);
    }
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
            value={selectedType}
            onChange={handleTypeChange}
            className="p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="">Select Type</option>
            <option value="PDOUBLE">PDOUBLE</option>
            <option value="PTRIPLE">PTRIPLE</option>
            <option value="PTRIPLE_L">PTRIPLE-L</option>
            <option value="PQUAD">PQUAD</option>
            <option value="PQUAD_L">PQUAD-L</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Select Length (in inches):
          </label>
          <select
            value={selectedLength}
            onChange={handleLengthChange}
            className="p-2 border border-gray-300 rounded-md w-full"
            disabled={!firstLevelAdded} // Disable until the first level is added
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Number of Platforms per Level:
          </label>
          <input
            type="number"
            value={platformsPerLevel}
            onChange={(e) => setPlatformsPerLevel(parseInt(e.target.value))}
            className="p-2 border border-gray-300 rounded-md w-full"
            min="1"
            disabled={!firstLevelAdded} // Disable until the first level is added
          />
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
        <ModelViewer
          scale={scale}
          dropHeight={selectedLength}
          levels={levels}
        />
      ) : activeView === "AR" ? (
        <ARView layers={levels} />
      ) : (
        <div className="flex-1 p-4 md:p-6 flex items-center justify-center h-full">
          <p className="text-red-700">Select a view to start.</p>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default App;
