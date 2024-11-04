import React, { useState, useEffect, useRef, useReducer } from 'react';
import {
    ModelViewer,
    ARView,
    logo,
    convert,
    TbAugmentedReality,
    TbView360Number,
    ToastContainer,
    toast,
    FaCartFlatbed,
    GrPowerReset,
    MdAddCircleOutline,
    baseTypeOptions,
    conditionalOptions,
    actualHeights,
    levelUrls,
    initialState,
    heroReducer,
    addLevel,
    toggleView,
    resetAll,
    removeLevel,
    handleBaseTypeChange,
    addToCart,
    MdRotate90DegreesCw,
    HiMenu
} from './index';
import Footer from "../Footer";
import { useParams } from 'react-router-dom';
import { FaDatabase } from "react-icons/fa6";
import { FaLayerGroup } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";
import { FaRuler } from "react-icons/fa";
import Client from 'shopify-buy';
import { MdOutlineFileDownload } from "react-icons/md";

const Hero3D = () => {
    const { id } = useParams();
    const [state, dispatch] = useReducer(heroReducer, initialState);
    const [checkout, setCheckout] = React.useState(null);
    const [rotationValue, setRotationValue] = React.useState(0);
    const [variant_ID, setVariantID] = React.useState(null);
    const scrollToTopRef = React.useRef(null);
    const scrollToARRef = React.useRef(null);
    const [IdNull, setIdNull] = React.useState(false);
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [state.activeView]);

    useEffect(() => {
        const client = Client.buildClient({
            domain: 'duralifthardware.com',
            storefrontAccessToken: process.env.REACT_APP_API_KEY,
        });
        client.checkout.create().then((checkout) => {
            setCheckout(checkout);
        })
    }, [])

    useEffect(() => {
        const baseTypeFromId = baseTypeOptions.find(
            (option) => option.id === parseInt(id)
        );
        if (baseTypeFromId) {
            dispatch({ type: "SET_PRICE", payload: baseTypeFromId.price });
            dispatch({ type: "SET_BASE_TYPE", payload: baseTypeFromId.value });
            dispatch({ type: "SET_INITIAL_PRICE", payload: baseTypeFromId.price })
            handleBaseTypeChange(baseTypeFromId.value, state.levels, levelUrls, actualHeights, state.scale, dispatch, toast, state.cumulativeHeight, state.rotation);
            setVariantID(baseTypeFromId.varaintID);
        } else {
            setIdNull(true)
            toast.error("Invalid base type ID");
        }
    }, [id]);
    const handleTypeChange = (e) => {
        dispatch({ type: "SET_SELECTED_TYPE", payload: e.target.value });
    };
    const handleBaseTypeChange1 = (e) => {
        dispatch({ type: "SET_BASE_TYPE", payload: e.target.value });
        const baseTypeFromId = baseTypeOptions.find(
            (option) => option.value === e.target.value
        )
        handleBaseTypeChange(baseTypeFromId.value, state.levels, levelUrls, actualHeights, state.scale, dispatch, toast, state.cumulativeHeight, state.rotation);
        dispatch({ type: "SET_PRICE", payload: baseTypeFromId.price });
        dispatch({ type: "SET_INITIAL_PRICE", payload: baseTypeFromId.price })
        setVariantID(baseTypeFromId.varaintID);
    };
    const updatedDiscriptaion = () => {
        if (state.levels.length === 1) {
            return null
        }
        else if (state.modelSnapshot) {
            const updatedDescription = {
                [`drop_down_level_${state.drop_down - 1}`]: `${convert(state.selectedType)} Dura-Lift Elevate Adjustable Height Overhead Garage Door Ceiling Double Storage Platform PSINGLE ${state.selectedLength} INCH Drop Down, add below ${state.platformName} No platform \n(Model Snapshot: ${state.modelSnapshot}`,
            };
            // console.log(updatedDescription);
            dispatch({ type: "SET_DESCRIPTION", payload: updatedDescription });
        }
    }
    useEffect(() => {
        updatedDiscriptaion();
    }, [state.modelSnapshot]);

    const handleLengthChange = (e) => {
        const selectedLengthValue = parseInt(e.target.value);
        if (state.levels.length === 0 && selectedLengthValue !== 24) {
            toast.error("The first level must have a length of 24 inches.");
        } else {
            dispatch({ type: "SET_SELECTED_LENGTH", payload: selectedLengthValue });
        }
    };

    useEffect(() => {
        // console.log("updated descripation", state.descripation)
        // console.log("updated price", state.price)
        // console.log('Price:', state.price);
        // console.log('selectedPartZ:', state.selectedPartZ);
        // console.log('selectedPart:', state.selectedPart);
        // console.log("MOdel" , state.model)
        // console.log("MOdel" , state.modelIos)
    }, [state.descripation, state.baseType,state.model,state.modelIos])

    const handleARViewClick = () => {
        if (state.baseType === "") {
            toast.error("Please select a base type to start.");
            return;
        }
        toggleView("AR", dispatch);
        if (window.innerWidth < 768) {
            scrollToARRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen lg:mb-3 bg-gray-200" ref={scrollToTopRef}>
            <div className="w-full md:w-80 p-4 md:p-6 bg-gray-200 shadow-2xl rounded-3xl flex-shrink-0">
                <div className="flex justify-center mb-4">
                    <img src={logo} alt="Logo" className="w-24 md:w-36 h-auto transition-transform transform hover:scale-105" />
                </div>
                <div className="flex justify-center mb-2">
                    <div className="flex bg-gray-300 rounded-full p-1 shadow-inner">
                        <button
                            onClick={handleARViewClick}
                            className={`px-4 py-2 rounded-full transition duration-300 ${state.activeView === "AR"
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
                            onClick={() => toggleView("VR", dispatch)}
                            className={`px-4 py-2 rounded-full transition duration-300 ${state.activeView === "VR"
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
                <div className='flex justify-center items-center my-2'>
                <button
                        onClick={() => {
                            const link = document.createElement('a');
                            link.href = state.model;  // The model URL
                            link.download = 'model.usdz';  // Set the filename for download
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}                        
                        className="bg-gray-300 px-2 flex justify-center  py-3 text-sm rounded-full shadow-md md:hidden hover:bg-gray-4400 hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300"
                        disabled={!state.model || !state.baseType }
                    >
                        <MdOutlineFileDownload size={20} className="mr-2" />
                        Download Model 
                    </button>
                    </div>
                <h2 className="text-2xl md:text-2xl mb-4 text-gray-900 text-center md:text-left font-semibold">
                    Model Configurator
                </h2>
                <div className="flex flex-col space-y-4 xl:space-y-2">
                    <div className="flex justify-end mt-4 gap-3">
                        <button
                            onClick={() => addToCart(checkout, state, variant_ID, toast, dispatch, setCheckout)}
                            className="bg-green-500 text-white px-4 py-2 flex items-center text-sm rounded-full shadow-md hover:bg-green-600 hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300"
                            disabled={state.isLoading || state.isInCart}
                        >
                            <FaCartFlatbed size={20} className="mr-2" />
                            {state.isInCart ? "Added to Cart" : "Add to Cart"}
                        </button>

                        <button
                            onClick={() => resetAll(state, dispatch, toast, setVariantID)}
                            className="bg-yellow-500 text-white px-3 py-2 flex items-center text-sm rounded-full shadow-md hover:bg-yellow-600 hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-300"
                        >
                            <GrPowerReset size={20} className="mr-2" />
                            Reset
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Select Platform Type:
                        </label>
                        <div className="relative">
                            {IdNull ? <select
                                value={state.baseType}
                                onChange={handleBaseTypeChange1}
                                className="p-2 pl-10 border border-gray-300 rounded-lg w-full bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                disabled={state.baseType}
                                placeholder='Select Base Type'
                            >
                                <option value="" disabled>Select Base Type</option>
                                {baseTypeOptions.map((options, index) => (
                                    <option key={index} value={options.value}>
                                        {options.label}
                                    </option>
                                ))}
                            </select> :
                                <input
                                    type="text"
                                    value={state.baseType}
                                    className="p-2 pl-10 border border-gray-300 rounded-lg w-full bg-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled
                                    placeholder={state.baseType}
                                />
                            }

                            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <FaLayerGroup size={20} />
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Select Number of Platforms:
                        </label>
                        <div className="relative">
                            <select
                                value={state.selectedType}
                                onChange={handleTypeChange}
                                className="p-2 pl-10 border border-gray-300 rounded-lg w-full bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={!state.baseType}
                            >
                                <option value="">Select Platform</option>
                                {state.baseType &&
                                    conditionalOptions[state.baseType].map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))
                                }
                            </select>

                            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <FaLayerGroup size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Select Length (in inches):
                        </label>
                        <div className="relative">
                            <select
                                value={state.selectedLength}
                                onChange={handleLengthChange}
                                className="p-2 pl-10 border border-gray-300 rounded-lg w-full bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={!state.baseType}
                            >
                                <option value={6}>6</option>
                                <option value={12}>12</option>
                                <option value={24}>24</option>
                            </select>
                            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <FaRuler size={20} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap justify-evenly md:justify-start space-x-4 mt-4 ">
                    <button
                        onClick={() => addLevel(state, dispatch, toast)}
                        className="bg-blue-500 text-white px-3 py-2 flex items-center text-sm rounded-full shadow-md hover:bg-blue-600 hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
                    >
                        <MdAddCircleOutline size={20} className="mr-2" />
                        Add Level
                    </button>
                    <button
                        onClick={() => removeLevel(state, dispatch, toast, setVariantID)}
                        className="bg-red-500 text-white ml-4 px-4 py-2 flex items-center text-sm rounded-full shadow-md hover:bg-red-600 hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
                    >
                        <MdOutlineCancel size={20} className="mr-2" />
                        Remove
                    </button>
                </div>
            </div>

            <div ref={scrollToARRef}>
                {state.activeView === "VR" ? (
                    <div className="flex-1 p-2 md:p-3 flex items-center justify-center h-full  shadow-inner rounded-3xl">
                        <ModelViewer
                            scale={state.scale}
                            levels={state.levels}
                            dispatch={dispatch}
                            psingleCount={state.pSingle}
                            levelIndex={state.levelIndex}
                            platformName={state.platformName}
                            scrollToTopRef={scrollToTopRef}
                            selectedPart={state.selectedPart}
                        />
                    </div>
                ) : state.activeView === "AR" ? (
                    <div className="flex-1 p-4 md:p-6 flex items-center justify-center h-full bg-white shadow-inner rounded-3xl">
                        <ARView model={state.model} />
                    </div>
                ) : (
                    <div className="flex-1 p-4 md:p-6 flex items-center justify-center h-full bg-white shadow-inner rounded-3xl">
                        <p className="text-red-700">Select a view to start.</p>
                    </div>
                )}
            </div>
            <ToastContainer />
            <Footer className="w-full flex-shrink-0" />
        </div>
    );
}

export default Hero3D;