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
import { useParams } from "react-router-dom";

const App = () => {
  const [selectedPart, setSelectedPart] = useState(null);
  const [scale] = useState(0.05);
  const [levels, setLevels] = useState([]);
  const [cumulativeHeight, setCumulativeHeight] = useState(0);
  const [activeView, setActiveView] = useState("VR");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLength, setSelectedLength] = useState(24);
  const [platformsPerLevel, setPlatformsPerLevel] = useState(1);
  const [modal, setModal] = useState(null);

  const { id } = useParams();
  const [baseType, setBaseType] = useState("");

  useEffect(() => {
    const baseTypeFromId = baseTypeOptions.find(option => option.id === parseInt(id));

    if (baseTypeFromId) {
      handleBaseTypeChange(baseTypeFromId.value);
      setBaseType(baseTypeFromId.label);
      console.log(baseType)
    } else {
      toast.error("Invalid base type ID");
    }
  }, [id]);


  const handleBaseTypeChange = (value) => {
    const newBaseType = value;
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
        console.log(updatedLevels)
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
        console.log(newLevel)
        setLevels([newLevel]);
        setCumulativeHeight(defaultHeight);
        toast.success(`Added base modal: ${newBaseType}`);
      }
    }
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    console.log(e.target.value);
  };

  const handleLengthChange = (e) => {
    const selectedLengthValue = parseInt(e.target.value);
    if (levels.length === 0 && selectedLengthValue !== 24) {
      toast.error("The first level must have a length of 24 inches.");
    } else {
      setSelectedLength(selectedLengthValue);
    }
  };
  const createModelFromPSingle = (selectedType, selectedLength) => {
    // Determine the number of rods based on the selected type
    const psingleCount =
      selectedType === "PTRIPLE" ? 3 :
        selectedType === "PDOUBLE" ? 2 :
          selectedType === "PQUAD" ? 4 :
            1;

    const selectedLevelUrl = levelUrls["PSINGLE"][selectedLength];
    const actualHeight = actualHeights[selectedLength] * scale;

    const modelLevels = [];

    // Adjust the position based on the type to merge rods as needed
    for (let i = 0; i < psingleCount; i++) {
      // For PDOUBLE, position the second rod to merge with the first
      const newPosition = [
        i === 0 ? 0 : actualHeight, // Place the first rod at 0, second rod at actualHeight
        0,
        0
      ];
      const newLevel = {
        id: `${Date.now()}-${i}`,
        url: selectedLevelUrl,
        position: newPosition,
        height: actualHeight,
      };
      modelLevels.push(newLevel);
    }

    return modelLevels;
  };

  const addLevel = () => {
    if (!selectedType || !baseType) {
      toast.error(
        "Please select both the base type and model type before adding levels."
      );
      return;
    }

    const currentLength = selectedLength;
    const actualHeight = actualHeights[currentLength] * scale;

    const generatedModel = createModelFromPSingle(selectedType, selectedLength);
    let newLevels = []; // Start with an empty array for new levels
    let newCumulativeHeight = cumulativeHeight; // Start with existing cumulative height

    // Iterate through the generated model and set positions
    generatedModel.forEach((level) => {
      // Set new position for each level from the generated model
      level.position[1] = newCumulativeHeight;
      newCumulativeHeight += level.height; // Update cumulative height
      newLevels.push(level); // Add the updated level to newLevels
    });

    for (let i = 0; i < platformsPerLevel; i++) {
      const newPosition = [0, -newCumulativeHeight - actualHeight, 0];
      const newLevel = {
        id: `${Date.now()}-${generatedModel.length + i}`, // Ensure unique ID
    url:levelUrls,// Get URL for the new platform
        position: newPosition, // Set the position
        height: actualHeight, // Keep the height the same as calculated
      };

      newCumulativeHeight += actualHeight; // Update cumulative height
      newLevels.push(newLevel); // Add the new platform level to newLevels
    }

    // Update state with all levels, including the new ones from PSINGLE and additional platforms
    setCumulativeHeight(newCumulativeHeight); // Update cumulative height in state
    setLevels([...levels, ...newLevels]); // Merge existing levels with new levels

    toast.success('Platform(s) added to the model');
  };



  const removeLevel = () => {
    if (levels.length > 0) {
      const lastGroupType = levels[levels.length - 1].groupType;

      const newLevels = levels.filter(level => level.groupType !== lastGroupType);

      const lastGroupHeight = levels
        .filter(level => level.groupType === lastGroupType)
        .reduce((acc, level) => acc + level.height, 0);

      setCumulativeHeight(cumulativeHeight - lastGroupHeight);
      setLevels(newLevels);

      toast.info(`Removed the latest ${lastGroupType} `);
    } else {
      toast.warn("No levels to remove");
    }
  };
  // const addLevelBelowPSingle = (psingleId, newType, selectedLength) => {
  //   const newModelLevels = createModelFromPSingle(newType, selectedLength);

  //   const targetPSingle = levels.find(level => level.id === psingleId);

  //   if (!targetPSingle) {
  //     toast.error("Could not find the specified PSINGLE to add below.");
  //     return;
  //   }

  //   // Position the new levels just below the target PSINGLE
  //   newModelLevels.forEach(level => {
  //     level.position[1] = targetPSingle.position[1] - level.height; // Add new level below the target
  //   });

  //   // Adjust positions of levels that come after the newly inserted levels
  //   const updatedLevels = levels.map(level => {
  //     if (level.position[1] < targetPSingle.position[1]) {
  //       // Shift existing levels down to make space for new levels
  //       return { ...level, position: [level.position[0], level.position[1] - newModelLevels.length * newModelLevels[0].height, 0] };
  //     }
  //     return level;
  //   });

  //   // Update the levels state with new levels
  //   setLevels([...updatedLevels, ...newModelLevels]);
  //   setCumulativeHeight(cumulativeHeight + newModelLevels.reduce((acc, level) => acc + level.height, 0));

  //   toast.success(`Added ${newType} levels below PSINGLE with ID: ${psingleId}`);
  // };



  useEffect(() => {
    console.log(baseType)
  }, [baseType])
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
  }, [levels, baseType]);

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
              Base Type:
            </label>
            <input
              type="text"
              value={baseType}
              className="p-2 border border-gray-300 rounded-md w-full"
              disabled={baseType}
              placeholder={baseType}
            />
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
          addLevel ={addLevel}
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
