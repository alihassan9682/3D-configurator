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
    IoMdCloseCircle,
    baseTypeOptions,
    conditionalOptions,
    actualHeights,
    levelUrls,
    //     initialState,
    // heroReducer
} from './exporter';
import { useParams } from 'react-router-dom';
import { FaDatabase } from "react-icons/fa6";
import { FaLayerGroup } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";
import { FaRuler } from "react-icons/fa";
import Client from 'shopify-buy';
import { useReducer, useEffect } from 'react';

const initialState = {
    scale: 0.05,
    levels: [],
    cumulativeHeight: 0,
    activeView: "VR",
    baseType: "",
    selectedType: "",
    selectedLength: 24,
    platformsPerLevel: 1,
    descripation: { base: "" },
};

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_BASE_TYPE":
            return {
                ...state,
                baseType: action.payload,
                selectedType: "",
                selectedLength: 24,
                platformsPerLevel: 1,
                descripation: {
                    base: action.payload,
                }
            };
        case "SET_DESCRIPTION":
            return {
                ...state,
                descripation: {
                    ...state.descripation,
                    ...action.payload
                }
            };
        case "REMOVE_DESCRIPTION":
            return {
                ...state,
                descripation: {
                    ...action.payload
                }
            };

        case "SET_LEVELS":
            return {
                ...state,
                levels: action.payload,
            };
        case "SET_CUMULATIVE_HEIGHT":
            return {
                ...state,
                cumulativeHeight: action.payload,
            };
        case "SET_SELECTED_TYPE":
            return {
                ...state,
                selectedType: action.payload,
            };
        case "SET_SELECTED_LENGTH":
            return {
                ...state,
                selectedLength: action.payload,
            };
        case "SET_PLATFORMS_PER_LEVEL":
            return {
                ...state,
                platformsPerLevel: action.payload,
            };
        case "SET_ACTIVE_VIEW":
            return {
                ...state,
                activeView: action.payload,
            };
        case "RESET_ALL":
            return {
                ...state,
                scale: 0.05,
                activeView: "VR",
                selectedType: "",
                selectedLength: 24,
                platformsPerLevel: 1,
            };
        default:
            return state;
    }
};

const Hero1 = () => {
    const { id } = useParams();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [updateModel, setUpdateModel] = React.useState([]);
    const [checkout, setCheckout] = React.useState(null);
    const [drop_down, setDropdownlevel] = React.useState(1);
    const [price, setPrice] = React.useState(0);
    const [value, setValue] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isInCart, setIsInCart] = React.useState(false);
    const [model,setModal] = React.useState(null);
    useEffect(() => {
        const client = Client.buildClient({
            domain: 'duralifthardware.com',
            storefrontAccessToken: 'de189c5e871c9aaded8566d9dab068f7',
        });

        client.checkout.create().then((checkout) => {
            setCheckout(checkout);
        });
    }, []);

    const addToCart = async () => {
        if (!checkout || isInCart || isLoading) return; // Prevent if checkout is not ready, item is already in cart, or loading

        setIsLoading(true); // Set loading state
        const variant_id = id;
        const variantId = `gid://shopify/ProductVariant/${variant_id}`;

        const customPrice = price;
        const customDescripation = JSON.stringify(state.descripation)
        const lineItemsToAdd = [
            {
                variantId,
                quantity: 1,
                customAttributes: [
                    { key: 'Price after Custumization', value: JSON.stringify(customPrice) },
                    { key: 'Customization  Details', value: customDescripation },
                ],
            },
        ];

        const client = Client.buildClient({
            domain: 'duralifthardware.com',
            storefrontAccessToken: 'de189c5e871c9aaded8566d9dab068f7',
        });

        const retryWithBackoff = async (fn, retries = 5, delay = 1000) => {
            try {
                return await fn();
            } catch (error) {
                if (retries > 0 && error.message.includes('Throttled')) {
                    await new Promise((res) => setTimeout(res, delay));
                    return retryWithBackoff(fn, retries - 1, delay * 2);
                }
                throw error;
            }
        };

        try {
            const updatedCheckout = await retryWithBackoff(() =>
                client.checkout.addLineItems(checkout.id, lineItemsToAdd)
            );
            setCheckout(updatedCheckout);
            setIsInCart(true); // Mark item as added to cart
            window.location.href = updatedCheckout.webUrl;
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const baseTypeFromId = baseTypeOptions.find(
            (option) => option.id === parseInt(id)
        );
        if (baseTypeFromId) {
            setPrice((prevPrice) => prevPrice + baseTypeFromId.price)
            dispatch({ type: "SET_BASE_TYPE", payload: baseTypeFromId.value });
            handleBaseTypeChange(baseTypeFromId.value);
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
    const handleBaseTypeChange = (newBaseType) => {
        if (newBaseType) {
            let levels = state.levels;

            if (levels.length === 1) {
                const defaultLength = 24;
                const defaultUrl = levelUrls[newBaseType][defaultLength];
                const defaultHeight = actualHeights[defaultLength] * state.scale;

                const updatedLevels = levels.map((level, index) => {
                    if (index === 0) {
                        return {
                            ...level,
                            url: defaultUrl,
                            position: [0, -defaultHeight, 0],
                            height: defaultHeight,
                        };
                    }
                    return level;
                });

                dispatch({ type: "SET_LEVELS", payload: updatedLevels });
                dispatch({ type: "SET_CUMULATIVE_HEIGHT", payload: defaultHeight });
                toast.success(`Updated the base modal to: ${newBaseType}`);
            } else if (levels.length === 0) {
                const defaultLength = 24;
                const defaultUrl = levelUrls[newBaseType][defaultLength];
                const defaultHeight = actualHeights[defaultLength] * state.scale;

                const newLevel = {
                    id: `${Date.now()}`,
                    url: defaultUrl,
                    position: [0, -state.cumulativeHeight - defaultHeight, 0],
                    height: defaultHeight,
                };

                dispatch({ type: "SET_LEVELS", payload: [newLevel] });
                dispatch({ type: "SET_CUMULATIVE_HEIGHT", payload: defaultHeight });
                toast.success(`Added base modal: ${newBaseType}`);
            }
        }
    };
    const addLevel = () => {
        if (!state.selectedType && !state.baseType) {
            toast.error("Please select both the base type and model type before adding levels.");
            return;
        }
        setDropdownlevel(drop_down + 1);
        const convert = (value) => {
            switch (value) {
                case "PSINGLE":
                    return "1X"
                case "PDOUBLE":
                    return "2X"
                case "PTRIPLE":
                    return "3X"
                case "PQUAD":
                    return "4X"
                case "PTRIPLE_L":
                    return "3X"
                case "PQUAD_L":
                    return "4X"
                default:
                    return "Invalid Type"
            }
        }
        const Price = () => {
            let updatePrice = 0;

            switch (true) {
                case state.selectedType === "PSINGLE" && state.selectedLength === 24:
                    updatePrice = 97.94;
                    break;
                case state.selectedType === "PSINGLE" && state.selectedLength === 12:
                    updatePrice = 80.94;
                    break;
                case state.selectedType === "PSINGLE" && state.selectedLength === 6:
                    updatePrice = 70.94;
                    break;
                case state.selectedType === "PDOUBLE" && state.selectedLength === 24:
                    updatePrice = 195.94;
                    break;
                case state.selectedType === "PDOUBLE" && state.selectedLength === 12:
                    updatePrice = 180.94;
                    break;
                case state.selectedType === "PDOUBLE" && state.selectedLength === 6:
                    updatePrice = 170.94;
                    break;
                case state.selectedType === "PTRIPLE" && state.selectedLength === 24:
                    updatePrice = 251.46;
                    break;
                case state.selectedType === "PTRIPLE" && state.selectedLength === 12:
                    updatePrice = 240.46;
                    break;
                case state.selectedType === "PTRIPLE" && state.selectedLength === 6:
                    updatePrice = 230.46;
                    break;
                case state.selectedType === "PTRIPLE_L" && state.selectedLength === 12:
                    updatePrice = 257.58;
                    break;
                case state.selectedType === "PTRIPLE_L" && state.selectedLength === 12:
                    updatePrice = 257.58;
                    break;
                case state.selectedType === "PTRIPLE_L" && state.selectedLength === 24:
                    updatePrice = 257.58;
                    break;
                case state.selectedType === "PQUAD" && state.selectedLength === 6:
                    updatePrice = 250.56;
                    break;
                case state.selectedType === "PQUAD" && state.selectedLength === 12:
                    updatePrice = 351.35;
                    break;
                case state.selectedType === "PQUAD" && state.selectedLength === 24:
                    updatePrice = 351.35;
                    break;
                case state.selectedType === "PQUAD_L" && state.selectedLength === 6:
                    updatePrice = 351.35;
                    break;
                case state.selectedType === "PQUAD_L" && state.selectedLength === 12:
                    updatePrice = 351.35;
                    break;
                case state.selectedType === "PQUAD_L" && state.selectedLength === 24:
                    updatePrice = 376.86;
                    break;
                default:
                    updatePrice = 0;
            }
            setValue((prevValue) => [...prevValue, updatePrice]);
            setPrice((prevPrice) => prevPrice + updatePrice)
        };
        Price()
        const detials = {
            [`drop_down_level_${drop_down}`]: `${convert(state.selectedType)} PSINGLE ${state.selectedLength} INCH`,
        };
        dispatch({ type: "SET_DESCRIPTION", payload: detials });
        const selectedLevelUrl = levelUrls[state.selectedType][state.selectedLength];
        const actualHeight = actualHeights[state.selectedLength] * state.scale;

        let newLevels = [...state.levels];
        let newCumulativeHeight = state.cumulativeHeight;

        for (let i = 0; i < state.platformsPerLevel; i++) {
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
        dispatch({ type: "SET_LEVELS", payload: newLevels });
        dispatch({ type: "SET_CUMULATIVE_HEIGHT", payload: newCumulativeHeight });
        toast.success('Platform(s) added to the modal');
    };
    const removeLevel = () => {
        if (state.levels.length === 0 || state.levels.length === 1) { 
            toast.error("No levels to removes");
        }
       else  if (state.levels.length > 0) {
            const lastLevel = state.levels[state.levels.length - 1];

            // Update the cumulative height
            dispatch({ type: "SET_CUMULATIVE_HEIGHT", payload: state.cumulativeHeight - lastLevel.height });

            // Create a new levels array without the last level
            const newLevels = state.levels.slice(0, -1);
            dispatch({ type: "SET_LEVELS", payload: newLevels });

            const updatedDescripation = { ...state.descripation };
            delete updatedDescripation[`drop_down_level_${drop_down-1}`]; 
            console.log('updatedDescripation', updatedDescripation);

            const lastValue = value[value.length - 1];
            setPrice((prevPrice) => prevPrice - lastValue);
            setValue((prevValue) => prevValue.slice(0, -1));
            dispatch({ type: "REMOVE_DESCRIPTION", payload: updatedDescripation });
            setDropdownlevel(drop_down - 1);
            toast.info("Removed the last level");
        }
    };


    useEffect(() => {
        console.log('Price after adding base type:', price);
    }, [price]);
    useEffect(() => {
        console.log("updated descripation", state.descripation)
    }, [state.descripation, state.levels])

    const resetAll = () => {
        dispatch({ type: "RESET_ALL" });
        toast.info("Reset all settings to default");
    };

    const toggleView = (view) => {
        dispatch({ type: "SET_ACTIVE_VIEW", payload: view });
    };

    return (
        <div className="flex flex-col md:flex-row h-screen lg:mb-5 bg-gradient-to-br from-gray-100 to-gray-300">
            <div className="w-full md:w-80 p-4 md:p-6 bg-gradient-to-br from-green-100 via-white to-blue-100 shadow-2xl rounded-3xl flex-shrink-0">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="Logo" className="w-24 md:w-36 h-auto transition-transform transform hover:scale-105" />
                </div>

                <div className="flex justify-center mb-6">
                    <div className="flex bg-gray-300 rounded-full p-1 shadow-inner">
                        <button
                            onClick={() => toggleView("AR")}
                            className={`px-4 py-2 rounded-full transition duration-300 ${state.activeView === "AR"
                                ? "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg transform hover:scale-105"
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
                            className={`px-4 py-2 rounded-full transition duration-300 ${state.activeView === "VR"
                                ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-lg transform hover:scale-105"
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
                            onClick={addToCart}
                            className="bg-green-500 text-white px-4 py-2 flex items-center text-sm rounded-full shadow-md hover:bg-green-600 hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300"
                            disabled={isLoading || isInCart}
                        >
                            <FaCartFlatbed size={20} className="mr-2" />
                            {isInCart ? "Added to Cart" : "Add to Cart"}
                        </button>

                        <button
                            onClick={resetAll}
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
                        onClick={addLevel}
                        className="bg-blue-500 text-white px-3 py-2 flex items-center text-sm rounded-full shadow-md hover:bg-blue-600 hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
                    >
                        <MdAddCircleOutline size={20} className="mr-2" />
                        Add Level
                    </button>
                    <button
                        onClick={removeLevel}
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
                    setModal={setModal}
                />
            ) : state.activeView === "AR" ? (
                <ARView modal={model} />
            ) : (
                <div className="flex-1 p-4 md:p-6 flex items-center justify-center h-full bg-white shadow-inner rounded-3xl">
                    <p className="text-red-700">Select a view to start.</p>
                </div>
            )}
            <ToastContainer />
        </div >
    );
}
export default Hero1;