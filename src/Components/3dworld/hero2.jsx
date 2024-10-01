import React from 'react';
import {
    ModelViewer,
    ARView,
    logo,
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
} from './exporter';
import { useParams } from 'react-router-dom';
import { FaDatabase } from "react-icons/fa6";
import { FaLayerGroup } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";
import { FaRuler } from "react-icons/fa";
import Client from 'shopify-buy';
import { useReducer, useEffect } from 'react';

const Hero2 = () => {
    const { id } = useParams();
    const [state, dispatch] = useReducer(heroReducer, initialState);
    const [initalPrice,setInitialPrice] = React.useState(0);
    const [drop_down, setDropdownlevel] = React.useState(1);
    const [checkout, setCheckout] = React.useState(null);
    useEffect(() => {
        const client = Client.buildClient({
            domain: 'duralifthardware.com',
            storefrontAccessToken: process.env.REACT_APP_API_KEY,
        });
        client.checkout.create().then((checkout) => {
            setCheckout(checkout);
        })
    },[])
    useEffect(() => {
        const baseTypeFromId = baseTypeOptions.find(
            (option) => option.id === parseInt(id)
        );
        if (baseTypeFromId) {
            setInitialPrice(baseTypeFromId.price)
            dispatch({ type: "SET_PRICE", payload: baseTypeFromId.price });
            dispatch({ type: "SET_BASE_TYPE", payload: baseTypeFromId.value });
            handleBaseTypeChange(baseTypeFromId.value, state.levels, levelUrls, actualHeights, state.scale, dispatch, toast, state.cumulativeHeight);

        } else {
            toast.error("Invalid base type ID");
        }
    }, [id]);    
    const handleTypeChange = (e) => {
        dispatch({ type: "SET_SELECTED_TYPE", payload: e.target.value });
    };
    const handleLengthChange = (e) => {
        const selectedLengthValue = parseInt(e.target.value);
        if (state.levels.length === 0 && selectedLengthValue !== 24) {
            toast.error("The first level must have a length of 24 inches.");
        } else {
            dispatch({ type: "SET_SELECTED_LENGTH", payload: selectedLengthValue });
        }
    };
    useEffect(() => {
        console.log("updated descripation", state.descripation)
        console.log('Price:', state.price);
        console.log('Levels:', state.levels);
    }, [state.levels, state.price, state.descripation, state.model]);
    return (
        <div className="flex flex-col md:flex-row h-screen lg:mb-5 ">
            <div className="w-full md:w-80 p-4 md:p-6   bg-gray-200 shadow-2xl rounded-3xl flex-shrink-0">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="Logo" className="w-24 md:w-36 h-auto transition-transform transform hover:scale-105" />
                </div>
                <div className="flex justify-center mb-6">
                    <div className="flex bg-gray-300 rounded-full p-1 shadow-inner">
                        <button
                            onClick={() => toggleView("AR",dispatch)}
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
                <h2 className="text-2xl md:text-2xl mb-6 text-gray-900 text-center md:text-left font-semibold">
                    Model Configurator
                </h2>
                <div className="flex flex-col space-y-4 xl:space-y-2">
                    <div className="flex justify-end mt-4 gap-3">
                        <button
                            onClick={() => addToCart(checkout, state.isInCart, state.isLoading, id, state.price, state.descripation,toast, dispatch,setCheckout)}
                            className="bg-green-500 text-white px-4 py-2 flex items-center text-sm rounded-full shadow-md hover:bg-green-600 hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300"
                            disabled={state.isLoading || state.isInCart}
                        >
                            <FaCartFlatbed size={20} className="mr-2" />
                            {state.isInCart ? "Added to Cart" : "Add to Cart"}
                        </button>

                        <button
                            onClick={()=>resetAll(state.levels,dispatch,toast,initalPrice)}
                            className="bg-yellow-500 text-white px-3 py-2 flex items-center text-sm rounded-full shadow-md hover:bg-yellow-600 hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-300"
                        >
                            <GrPowerReset size={20} className="mr-2" />
                            Reset
                        </button>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Base Type:
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={state.baseType}
                                className="p-2 pl-10 border border-gray-300 rounded-lg w-full bg-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled
                                placeholder={state.baseType}
                            />
                            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <FaDatabase size={20} />
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
                <div className="flex flex-wrap justify-evenly md:justify-start space-x-4  mt-4 ">
                    <button
                        onClick={() => addLevel(state.selectedType, state.baseType, dispatch, state.price, state.levels, levelUrls, setDropdownlevel, actualHeights, state.scale, state.cumulativeHeight, state.platformsPerLevel, state.selectedLength, toast, drop_down, setDropdownlevel)}
                        className="bg-blue-500 text-white px-3 py-2 flex items-center text-sm rounded-full shadow-md hover:bg-blue-600 hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
                    >
                        <MdAddCircleOutline size={20} className="mr-2" />
                        Add Level
                    </button>
                    <button
                        onClick={() => removeLevel(state.levels, state.cumulativeHeight, dispatch, drop_down, setDropdownlevel, toast, state.descripation,state.value,state.price)}
                        className="bg-red-500 text-white ml-4 px-4 py-2 flex items-center text-sm rounded-full shadow-md hover:bg-red-600 hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
                    >
                        <MdOutlineCancel size={20} className="mr-2" />
                        Remove
                    </button>
                </div>
            </div >
            {state.activeView === "VR" ? (
                <ModelViewer
                    scale={state.scale}
                    levels={state.levels}
                    dispatch = {dispatch}
                />
            ) : state.activeView === "AR" ? (
                <ARView modal={state.model} />
            ) : (
                <div className="flex-1 p-4 md:p-6 flex items-center justify-center h-full bg-white shadow-inner rounded-3xl">
                    <p className="text-red-700">Select a view to start.</p>
                </div>
            )}
            <ToastContainer />
        </div >
    );
}
export default Hero2;