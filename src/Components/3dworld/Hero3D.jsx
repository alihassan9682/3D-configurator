import React, { useState, useEffect } from "react";
// import ModelViewer from "./modalFor3D";
import ModelViewer from "./exporterForAR";
import ARView from "./ARView";
// import ARView from "./ARtest";
import logo from "../../assets/logos/dura.webp";
import { TbAugmentedReality, TbView360Number } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  actualHeights,
  levelUrls,
  baseTypeOptions,
  conditionalOptions,
} from "./constants";

const App = () => {
  const [scale] = useState(0.05);
  const [levels, setLevels] = useState([]);
  const [cumulativeHeight, setCumulativeHeight] = useState(0);
  const [activeView, setActiveView] = useState("VR");
  const [baseType, setBaseType] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLength, setSelectedLength] = useState(24);
  const [platformsPerLevel, setPlatformsPerLevel] = useState(1);
  const [modal, setModal] = useState();

  const handleBaseTypeChange = (e) => {
    const newBaseType = e.target.value;
    setBaseType(newBaseType);
    setSelectedType("");
    setSelectedLength(24);
    setPlatformsPerLevel(1);

    if (newBaseType) {
      if (levels.length === 1) {
        const defaultLength = 24;
        const defaultUrl = levelUrls[newBaseType][defaultLength];
        const defaultHeight = actualHeights[defaultLength] * scale;

        const updatedLevels = [...levels];
        updatedLevels[0] = {
          id: updatedLevels[0].id,
          url: defaultUrl,
          position: [0, -defaultHeight, 0],
          height: defaultHeight,
        };

        setLevels(updatedLevels);
        setCumulativeHeight(defaultHeight);
        toast.success(`Updated the base modal to: ${newBaseType}`);
      } else if (levels.length === 0) {
        const defaultLength = 24;
        const defaultUrl = levelUrls[newBaseType][defaultLength];
        const defaultHeight = actualHeights[defaultLength] * scale;

        const newLevel = {
          id: `${Date.now()}`,
          url: defaultUrl,
          position: [0, -cumulativeHeight - defaultHeight, 0],
          height: defaultHeight,
        };

        setLevels([newLevel]);
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
      toast.error(
        "Please select both the base type and model type before adding levels."
      );
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
        id: `${Date.now()}-${i}`,
        url: selectedLevelUrl,
        position: newPosition,
        height: actualHeight,
      };

      newCumulativeHeight += actualHeight;
      newLevels.push(newLevel);
    }

    setCumulativeHeight(newCumulativeHeight);
    setLevels([...levels, ...newLevels]);

    toast.success(
      'platform(s) added to the modal'
    );
  };

  const removeLevel = () => {
    if (levels.length > 0) {
      const lastLevel = levels[levels.length - 1];
      setCumulativeHeight(cumulativeHeight - lastLevel.height);
      setLevels(levels.slice(0, -1));
      toast.info("Removed the last level");
    }
  };

  const resetAll = () => {
    setBaseType("");
    setSelectedType("");
    setSelectedLength(24);
    setPlatformsPerLevel(1);
    setLevels([]);
    setCumulativeHeight(0);
    setActiveView("VR");
    toast.info("Reset all settings to default");
  };

  const toggleView = (view) => {
    setActiveView(view);
  };

  useEffect(() => {
    if (levels.length === 0) {
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
              className={`px-4 py-2 rounded-full transition duration-300 ${activeView === "AR"
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
              className={`px-4 py-2 rounded-full transition duration-300 ${activeView === "VR"
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
        <div className="flex flex-col">
          <div className="flex justify-end mt-4">
            <button
              onClick={resetAll}
              className="bg-neutral-500 w-fit text-xs text-white px-2 py-1 rounded-md shadow-md hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-opacity-50 transition duration-300"
            >
              Reset all
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Select Base Type:
            </label>
            <select
              value={baseType}
              onChange={handleBaseTypeChange}
              className="p-2 border border-gray-300 rounded-md w-full"
              disabled={!!baseType}
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
              disabled={!baseType}
            >
              <option value="">Select Platform</option>
              {baseType &&
                conditionalOptions[baseType].map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
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
              disabled={!baseType}
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
          </div>
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
          levels={levels}
          setModal={setModal}
        />
      ) : activeView === "AR" ? (
        <ARView modal={modal} />
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