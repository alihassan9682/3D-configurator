import React, { useState, useEffect } from "react";
import ModelViewer from "./modalFor3D"; // Ensure this component is correctly used
import ARView from "./ARView"; // Ensure this component is correctly used
import PS6 from "../../assets/GLBs/PSINGLE/PS6.glb";
import PS12 from "../../assets/GLBs/PSINGLE/PS12.glb";
import PS24 from "../../assets/GLBs/PSINGLE/PS24.glb";
import PD6 from "../../assets/GLBs/PDOUBLE/PD6.glb";
import PD12 from "../../assets/GLBs/PDOUBLE/PD12.glb";
import PD24 from "../../assets/GLBs/PDOUBLE/PD24.glb";
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
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [scale] = useState(0.05);
  const [levels, setLevels] = useState([]);
  const [cumulativeHeight, setCumulativeHeight] = useState(0);
  const [activeView, setActiveView] = useState("VR");
  const [baseType, setBaseType] = useState(""); // Base type state
  const [selectedType, setSelectedType] = useState(""); // Conditional type state
  const [selectedLength, setSelectedLength] = useState(24);
  const [platformsPerLevel, setPlatformsPerLevel] = useState(1);

  const actualHeights = {
    6: 6,
    12: 12,
    24: 24,
  };

  const levelUrls = {
    PSINGLE: {
      6: PS6,
      12: PS12,
      24: PS24,
    },
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

  const baseTypeOptions = [
    { value: "", label: "Select Base Type" },
    { value: "PSINGLE", label: "PSINGLE" },
    { value: "PDOUBLE", label: "PDOUBLE" },
    { value: "PTRIPLE", label: "PTRIPLE" },
    { value: "PTRIPLE_L", label: "PTRIPLE_L" },
    { value: "PQUAD", label: "PQUAD" },
    { value: "PQUAD_L", label: "PQUAD_L" },
  ];

  const conditionalOptions = {
    PSINGLE: ["PSINGLE"],
    PDOUBLE: ["PSINGLE", "PDOUBLE"],
    PTRIPLE: ["PSINGLE", "PDOUBLE", "PTRIPLE", "PTRIPLE_L"],
    PTRIPLE_L: ["PSINGLE", "PDOUBLE", "PTRIPLE", "PTRIPLE_L"],
    PQUAD: ["PSINGLE", "PDOUBLE", "PTRIPLE", "PTRIPLE_L", "PQUAD", "PQUAD_L"],
    PQUAD_L: ["PSINGLE", "PDOUBLE", "PTRIPLE", "PTRIPLE_L", "PQUAD", "PQUAD_L"],
  };

  const handleBaseTypeChange = (e) => {
    const newBaseType = e.target.value;
    setBaseType(newBaseType);
    setSelectedType(""); // Reset selected type
    setSelectedLength(24); // Reset length
    setPlatformsPerLevel(1); // Reset platforms per level
  
    if (newBaseType) {
      if (levels.length === 1) {
        // Update the existing single level with the new base type
        const defaultLength = 24;
        const defaultUrl = levelUrls[newBaseType][defaultLength];
        const defaultHeight = actualHeights[defaultLength] * scale;
  
        // Update the first level in the list
        const updatedLevels = [...levels];
        updatedLevels[0] = {
          id: updatedLevels[0].id, // Keep the same ID
          url: defaultUrl,
          position: [0, -defaultHeight, 0],
          height: defaultHeight,
        };
  
        setLevels(updatedLevels);
        setCumulativeHeight(defaultHeight);
        toast.success(`Updated the base modal to: ${newBaseType}`);
      } else if (levels.length === 0) {
        // Automatically add the selected base modal if levels are empty
        const defaultLength = 24;
        const defaultUrl = levelUrls[newBaseType][defaultLength];
        const defaultHeight = actualHeights[defaultLength] * scale;
  
        const newLevel = {
          id: `${Date.now()}`, // Unique ID for each level
          url: defaultUrl,
          position: [0, -cumulativeHeight - defaultHeight, 0],
          height: defaultHeight,
        };
  
        setLevels([newLevel]); // Set new level as the first level
        setCumulativeHeight(defaultHeight);
        toast.success(`Added base modal: ${newBaseType}`);
      }
    }
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

  const addLevel = () => {
    if (!selectedType || !baseType) {
      toast.error("Please select both the base type and model type before adding levels.");
      return;
    }

    let currentLength = selectedLength;
    const selectedLevelUrl = levelUrls[selectedType][currentLength];
    const actualHeight = actualHeights[currentLength] * scale;

    let newLevels = [];
    let newCumulativeHeight = cumulativeHeight;

    for (let i = 0; i < platformsPerLevel; i++) {
      const newPosition = [0, -newCumulativeHeight - actualHeight, 0];
      const newLevel = {
        id: `${Date.now()}-${i}`, // Unique ID for each level
        url: selectedLevelUrl,
        position: newPosition,
        height: actualHeight,
      };

      newCumulativeHeight += actualHeight;
      newLevels.push(newLevel);
    }

    setCumulativeHeight(newCumulativeHeight);
    setLevels([...levels, ...newLevels]); // Add all new levels

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

  useEffect(() => {
    if (levels.length === 0) {
      // Reset states when levels are empty
      setSelectedLength(24);
      setPlatformsPerLevel(1);
      setBaseType("");
      setSelectedType("");
    }
  }, [levels]);

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
            Select Base Type:
          </label>
          <select
            value={baseType}
            onChange={handleBaseTypeChange}
            className="p-2 border border-gray-300 rounded-md w-full"
          >
            {baseTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Select Number of Platforms:
          </label>
          <select
            value={selectedType}
            onChange={handleTypeChange}
            className="p-2 border border-gray-300 rounded-md w-full"
            disabled={!baseType} // Disable if no base type is selected
          >
            <option value="">Select Type</option>
            {baseType && conditionalOptions[baseType].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
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
            disabled={false} // Allow selection irrespective of first level status
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
            disabled={false} // Allow input irrespective of first level status
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
