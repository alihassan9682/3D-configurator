import React from 'react';
// import { FaCartFlatbed, GrPowerReset, MdAddCircleOutline, IoMdCloseCircle } from './index';
import {
    TbAugmentedReality,
    TbView360Number,
    FaCartFlatbed,
    GrPowerReset,
    MdAddCircleOutline,
    IoMdCloseCircle,
    conditionalOptions,
} from './exporter';
const ControlPanel = ({
    state,
    toggleView,
    addToCart,
    resetAll,
    handleTypeChange,
    handleLengthChange,
    addLevel,
    removeLevel,
    logo
}) => {
    const handleaddLevel = () => {
        console.log('button clicked')
        console.log(addLevel);
        console.log('afterbutton clicked')

    }
    return (
        <div className="w-full md:w-80 p-4 md:p-6 bg-gray-200 shadow-lg rounded-lg flex-shrink-0">
            <div className="flex justify-center mb-6">
                <img src={logo} alt="Logo" className="w-24 md:w-36 h-auto" />
            </div>

            <div className="flex justify-center mb-6">
                <div className="flex bg-gray-300 rounded-full p-1 shadow-inner">
                    <button
                        onClick={() => toggleView("AR")}
                        className={`px-4 py-2 rounded-full transition duration-300 ${state.activeView === "AR" ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-700"}`}
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
                        className={`px-4 py-2 rounded-full transition duration-300 ${state.activeView === "VR" ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-700"}`}
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
                <div className="flex justify-end mt-4 gap-2">
                    <button
                        onClick={addToCart}
                        className="bg-blue-500 text-white px-4 py-1 flex items-center text-sm rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
                    >
                        <FaCartFlatbed size={20} className="mr-2" />
                        Add to Cart
                    </button>

                    <button
                        onClick={resetAll}
                        className="bg-gray-500 text-white px-2 py-2 flex items-center text-sm rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300"
                    >
                        <GrPowerReset size={20} className="mr-2" />
                        Reset
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Base Type:
                    </label>
                    <input
                        type="text"
                        value={state.baseType}
                        className="p-2 border border-gray-300 rounded-md w-full"
                        disabled
                        placeholder={state.baseType}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Select Number of Platforms:
                    </label>
                    <select
                        value={state.selectedType}
                        onChange={handleTypeChange}
                        className="p-2 border border-gray-300 rounded-md w-full"
                        disabled={!state.baseType}
                    >
                        <option value="">Select Platform</option>
                        {state.baseType &&
                            conditionalOptions[state.baseType].map((option) => (
                                <option key={option.value} value={option.value} disabled={!state.baseType}>
                                    {option.label}
                                </option>
                            ))
                        }
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Select Length (in inches):
                    </label>
                    <select
                        value={state.selectedLength}
                        onChange={handleLengthChange}
                        className="p-2 border border-gray-300 rounded-md w-full"
                        disabled={!state.baseType}
                    >
                        <option value={6}>6</option>
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-wrap justify-center flex-row gap-3 md:justify-start space-x-4 mb-4">
                <button
                    onClick={addLevel}
                    className="bg-red-500 text-white px-2 py-1 flex items-center text-base rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
                >
                    <MdAddCircleOutline size={20} className="mr-2" />
                    Add Level
                </button>
                <button
                    onClick={removeLevel}
                    className="bg-gray-500 text-white px-2 py-2 flex items-center text-sm rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300"
                >
                    <IoMdCloseCircle size={20} className="mr-2" />
                    Remove
                </button>
            </div>
        </div>
    );
};

export default ControlPanel;
