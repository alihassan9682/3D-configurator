import React, { useEffect, useReducer } from 'react';
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
} from './index';
import Footer from "../Footer";
import { useParams } from 'react-router-dom';
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
    const [mesh, setMesh] = React.useState(true);
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
            dispatch({ type: "SET_BASE_TYPE", payload: baseTypeFromId.value });
            handleBaseTypeChange(baseTypeFromId.value, state.levels, levelUrls, actualHeights, state.scale, dispatch, toast, state.cumulativeHeight, state.rotation);
            setVariantID(baseTypeFromId.varaintID);
            const item = {
                variantID: baseTypeFromId.varaintID,
                quantity: 1,
            }
            const lineItemsToAdd = state.lineItem;
            lineItemsToAdd.push(item);
            dispatch({ type: "SET_LINEITEM", payload: lineItemsToAdd });
        } else {
            setIdNull(true)
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
        setVariantID(baseTypeFromId.varaintID);
        const item = {
            variantID: baseTypeFromId.varaintID,
            quantity: 1,
        }
        const lineItemsToAdd = state.lineItem;
        lineItemsToAdd.push(item);

        dispatch({ type: "SET_LINEITEM", payload: lineItemsToAdd });
    };
    const updatedDiscriptaion = () => {
        if (state.levels.length === 1) return null;
        const Position = state.platformName || 1; // Default to 1 if platformName is empty
        const updatedDescription = {
            [`drop_down_level_${state.drop_down - 1}`]:
                `${convert(state.selectedType)} Dura-Lift Elevate Adjustable Height Overhead Garage Door Ceiling Double Storage Platform ${state.selectedLength} INCH Drop Down, added below ${Position}`,
            // Uncomment to add image link
            // imageLink: `<a href="${imgurl}" target="_blank">View Configured Image</a>`,
        };

        // console.log("Updated Description:", updatedDescription);
        dispatch({ type: "SET_DESCRIPTION", payload: updatedDescription });
    };

    useEffect(() => {
        updatedDiscriptaion();
    }, [state.modelSnapshot, state.platformName]); // Triggers only when modelSnapshot or platformName changes

    const handleLengthChange = (e) => {
        const selectedLengthValue = parseInt(e.target.value);
        if (state.levels.length === 0 && selectedLengthValue !== 24) {
            toast.error("The first level must have a length of 24 inches.");
        } else {
            dispatch({ type: "SET_SELECTED_LENGTH", payload: selectedLengthValue });
        }
    };
    const addTOCart = () => {
        variant_ID === null ? toast.error("Please select a base type to start.") : addToCart(checkout, state, variant_ID, toast, dispatch, setCheckout)
    }
    useEffect(() => {
        // console.log("updated descripation", state.descripation)
        // console.log("updated price", state.price)
        // console.log('Price:', state.price);
        // console.log('selectedPartZ:', state.selectedPartZ);
        // console.log('selectedPart:', state.selectedPart);
        // console.log("MOdel" , state.model)
        // console.log("MOdel" , state.modelIos)
        // console.log("VarantID",variant_ID)
        // console.log("IdNull",IdNull)
        // console.log("Platform Name", state.platformName)
        // console.log("Levels", state.levels)
        // console.log("Line Item", state.lineItem)
        // console.log(state.modelIos)
        console.log("Selected Part", state.selectedPart)
        console.log("PositionX", state.PositionX)
    }, [state.selectedPart, state.PositionX])

    const handleARViewClick = () => {
        // if (state.baseType === "") {
        //     toast.error("Please select a base type to start.");
        //     return;
        // }
        // if (state.model === null || state.modelIos === null) {
        //     toast.error("Model is loading.Please Wait .....");
        //     return;
        // }
        // // Check if device is iOS/Apple
        // const isAppleDevice = /iPhone|iPad|iPod|Mac/i.test(navigator.userAgent) ||
        //     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        // setMesh(false);

        // if (isAppleDevice && state.modelIos) {
        //     // Apple device: Download USDZ file
        // setTimeout(() => {
        // try {
        const link = document.createElement('a');
        const url = URL.createObjectURL(state.modelIos);
        link.href = url;
        link.download = 'model.usdz';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // setTimeout(() => URL.revokeObjectURL(url), 10000);
        //         } catch (error) {
        //             console.error('Download error:', error);
        //             toast.error("Error downloading model. Please try again.");
        //         }
        //     }, 500);
        // } else {
        //     // Open VR view for non-Apple devices as fallback
        // toggleView("AR", dispatch);
        // if (window.innerWidth < 768) {
        //     scrollToARRef.current.scrollIntoView({ behavior: 'smooth' });
        // }
    }
    // };

    // useEffect(() => {
    //     if (scrollToARRef.current) {
    //         // console.log("scrollToARRef is not empty:", scrollToARRef.current);
    //         // Perform actions with the ref, e.g., scrollIntoView
    //         scrollToARRef.current.scrollIntoView({ behavior: 'smooth' });
    //     } else {
    //         console.error("scrollToARRef is empty!");
    //     }
    // }, [scrollToARRef]);

    return (
        <div className="flex flex-col h-full 2xl:h-auto bg-gray-200">
            <div className="flex flex-col md:flex-row w-full flex-grow h-full lg:mb-3 overflow-hidden" ref={scrollToTopRef}>
                <div className="w-full md:w-80 lg:w-96 p-4 md:p-6 bg-gray-200 shadow-2xl rounded-3xl flex-shrink-0">
                    <div className="flex justify-center mb-4 lg:mb-2">
                        <img src={logo} alt="Logo" className="w-24 md:w-36 h-auto transition-transform transform hover:scale-105" />
                    </div>
                    <div>
                        <div className="flex justify-center mb-2">
                            <div
                                className="flex rounded-full md:mx-3 justify-center items-center p-1 shadow-inner bg-gray-100"
                                style={{
                                    boxShadow: "inset 0px 4px 8px rgba(0, 0, 0, 0.15)",
                                }}
                            >
                                <button
                                    onClick={handleARViewClick}
                                    className={`px-4 py-3 rounded-full whitespace-nowrap transition duration-300 md:text-sm lg:text-lg ${state.activeView === "AR" ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-700"
                                        }`}
                                    style={{
                                        borderTopRightRadius: 0,
                                        borderBottomRightRadius: 0,
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <TbAugmentedReality size={24} /> <span>View in Room</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => {
                                        setMesh(!mesh);
                                        toggleView("VR", dispatch);
                                    }}
                                    className={`px-4 py-3 rounded-full whitespace-nowrap transition duration-300 md:text-sm lg:text-lg ${state.activeView === "VR" ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-700"
                                        }`}
                                    style={{
                                        borderTopLeftRadius: 0,
                                        borderBottomLeftRadius: 0,
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <TbView360Number size={24} />
                                        <span>View in VR</span>
                                    </div>
                                </button>
                            </div>
                        </div>


                        <h2 className="text-2xl md:text-2xl mb-4 lg:left-10 relative text-gray-900  justify-center text-center md:text-left font-semibold">
                            Model Configurator
                        </h2>
                        <div className="flex flex-col space-y-4 xl:space-y-2">
                            <div className="flex justify-end mt-4 gap-3">
                                <button
                                    onClick={() => addTOCart()}
                                    className="bg-green-500 text-white px-4 py-2 flex items-center text-sm rounded-full shadow-md hover:bg-green-600 hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300"
                                    disabled={state.isLoading || state.isInCart}
                                >
                                    <FaCartFlatbed size={20} className="mr-2" />
                                    {state.isInCart ? "Added to Cart" : "Add to Cart"}
                                </button>

                                <button
                                    onClick={() => resetAll(state, dispatch, toast, setVariantID, setIdNull)}
                                    className="bg-yellow-500 text-white px-3 py-2 flex items-center text-sm rounded-full shadow-md hover:bg-yellow-600 hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-300"
                                >
                                    <GrPowerReset size={20} className="mr-2" />
                                    Reset
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div className="relative">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Select Platform Type:
                                    </label>
                                    <div className="relative">
                                        {IdNull ? (
                                            <select
                                                value={state.baseType}
                                                onChange={handleBaseTypeChange1}
                                                className="block w-full p-2 pl-10 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
                                                disabled={state.baseType}
                                                placeholder="Select Base Type"
                                            >
                                                <option value="" disabled>Select Base Type</option>
                                                {baseTypeOptions.map((option, index) => (
                                                    <option key={index} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={state.baseType}
                                                className="block w-full p-2 pl-10 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                                disabled
                                                placeholder={state.baseType}
                                            />
                                        )}
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                            <FaLayerGroup size={20} />
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Select Number of Platforms:
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={state.selectedType}
                                            onChange={handleTypeChange}
                                            className="block w-full p-2 pl-10 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
                                            disabled={!state.baseType}
                                        >
                                            <option value="">Select Platform</option>
                                            {state.baseType &&
                                                conditionalOptions[state.baseType].map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                        </select>
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                            <FaLayerGroup size={20} />
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Select Length (in inches):
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={state.selectedLength}
                                            onChange={handleLengthChange}
                                            className="block w-full p-2 pl-10 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
                                            disabled={!state.baseType}
                                        >
                                            <option value={6}>6</option>
                                            <option value={12}>12</option>
                                            <option value={24}>24</option>
                                        </select>
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                            <FaRuler size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-evenly md:justify-start  lg:justify-evenly space-x-4 mt-4 ">
                            <button
                                onClick={() => addLevel(state, dispatch, toast)}
                                className="bg-blue-500 text-white px-3 py-2 flex items-center text-sm rounded-full shadow-md hover:bg-blue-600 hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
                            >
                                <MdAddCircleOutline size={20} className="mr-2" />
                                Add Level
                            </button>
                            <button
                                onClick={() => removeLevel(state, dispatch, toast, setVariantID, setIdNull)}
                                className="bg-red-500 text-white ml-4 px-4 py-2 flex items-center text-sm rounded-full shadow-md hover:bg-red-600 hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
                            >
                                <MdOutlineCancel size={20} className="mr-2" />
                                Remove
                            </button>
                        </div>
                    </div>
                    {/* Buttons, Forms, etc. */}
                </div>
                <div className="w-full h-full" ref={scrollToARRef}>
                    {state.activeView === "VR" ? (
                        <div className="flex-1 p-2 md:p-3 flex w-full items-center justify-center h-full shadow-inner rounded-3xl">
                            <ModelViewer
                                scale={state.scale}
                                levels={state.levels}
                                dispatch={dispatch}
                                psingleCount={state.pSingle}
                                levelIndex={state.levelIndex}
                                platformName={state.platformName}
                                scrollToTopRef={scrollToTopRef}
                                selectedPart={state.selectedPart}
                                isMesh={mesh}
                                setMesh={setMesh}
                            />
                        </div>
                    ) : state.activeView === "AR" ? (
                        <div className="flex-1 p-4 md:p-6 flex items-center justify-center h-full bg-white shadow-inner rounded-3xl" >
                            <ARView model={state.model} />
                        </div>
                    ) : (
                        <div className="flex-1 p-4 md:p-6 flex items-center justify-center h-full bg-white shadow-inner rounded-3xl">
                            <p className="text-red-700">Select a view to start.</p>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
            {/* Footer */}
            <Footer className="block  bg-gray-800 text-white p-4" />
        </div >

    );
}

export default Hero3D;