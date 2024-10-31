import Client from "shopify-buy";

import { actualHeights, levelUrls, priceMap, toast } from "./index";
// Initial state of the application
export const initialState = {
  scale: 0.05,
  levels: [],
  cumulativeHeight: 0,
  activeView: "VR",
  baseType: "",
  selectedType: "",
  selectedLength: 24,
  platformsPerLevel: 1,
  descripation: { base: "" },
  price: 0,
  value: [],
  isLoading: false,
  isInCart: false,
  model: null,
  selectedPart: 0,
  initalPrice: 0,
  drop_down: 1,
  rotation: 0,
  type: [],
  pSingle: 0,
  levelIndex: 0,
  platformName: "",
  selectedPartZ: 0,
  top: true,
  PositionX: [],
  PositionZ: [],
  modelSnapshot:null,
};
// Reducer function for the application
export const heroReducer = (state, action) => {
  switch (action.type) {
    case "SET_LEVEL_INDEX":
      return {
        ...state,
        levelIndex: action.payload,
      };
    case "SET_BASE_TYPE":
      return {
        ...state,
        baseType: action.payload,
        selectedType: "",
        selectedLength: 24,
        descripation: {
          base: action.payload,
        },
      };
    case "Set_PositionX":
      return {
        ...state,
        PositionX: action.payload,
      };
    case "Set_PositionZ":
      return {
        ...state,
        PositionZ: action.payload,
      };
    case "SET_PSINGLE_COUNT":
      return {
        ...state,
        pSingle: action.payload,
      };
    case "ADD_TYPE":
      return {
        ...state,
        type: action.payload,
      };
    case "SET_ROTATION":
      return {
        ...state,
        rotation: action.payload,
      };
    case "SET_INITIAL_PRICE":
      return {
        ...state,
        initalPrice: action.payload,
      };
    case "SET_PLATFORM_NAME":
      return {
        ...state,
        platformName: action.payload,
      };
    case "SET_MODEL_SNAPSHOT":
      return {
        ...state,
        modelSnapshot: action.payload,
      }
    case "SET_CART":
      return {
        ...state,
        isInCart: !state.isInCart,
      };
    case "SET_DROP_DOWN":
      return {
        ...state,
        drop_down: action.payload,
      };
    case "SET_Loading":
      return {
        ...state,
        isLoading: !state.isLoading,
      };
    case "SET_PRICE":
      return {
        ...state,
        price: action.payload,
      };
    case "SET_VALUE":
      return {
        ...state,
        value: action.payload,
      };
    case "SET_SELECTED_PART_Z":
      return {
        ...state,
        selectedPartZ: action.payload,
      };
    case "SET_MODEL":
      return {
        ...state,
        model: action.payload,
      };
    case "SET_DESCRIPTION":
      return {
        ...state,
        descripation: {
          ...state.descripation,
          ...action.payload,
        },
      };
    case "SET_TOP":
      return {
        ...state,
        top: true,
      };
    case "SET_SELECTED_PART":
      return {
        ...state,
        selectedPart: action.payload,
      };
    case "REMOVE_DESCRIPTION":
      return {
        ...state,
        descripation: {
          ...action.payload,
        },
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
        activeView: "VR",
        selectedType: "",
        selectedLength: 24,
        descripation: "",
      };
    default:
      return state;
  }
};
// Setting the initial state of the application model
export const handleBaseTypeChange = (
  newBaseType,
  levels,
  levelUrls,
  actualHeights,
  scale,
  dispatch,
  toast,
  cumulativeHeight,
) => {
  if (newBaseType) {
    let level = levels;
    if (level.length === 1) {
      const defaultLength = 24;
      const defaultUrl = levelUrls[newBaseType][defaultLength];
      const defaultHeight = actualHeights[defaultLength] * scale;

      const updatedLevels = level.map((lev, index) => {
        if (index === 0) {
          return {
            ...lev,
            url: defaultUrl,
            position: [0, -defaultHeight, 0],
            height: defaultHeight,
            groupType: newBaseType,
          };
        }
        return lev;
      });

      dispatch({ type: "SET_LEVELS", payload: updatedLevels });
      dispatch({ type: "SET_CUMULATIVE_HEIGHT", payload: defaultHeight });
      toast.success(`Updated the base modal to: ${newBaseType}`);
    } else if (level.length === 0) {
      const defaultLength = 24;
      const defaultUrl = levelUrls[newBaseType][defaultLength];
      const defaultHeight = actualHeights[defaultLength] * scale;
      const newLevel = {
        id: `${Date.now()}`,
        url: defaultUrl,
        position: [0, -cumulativeHeight - defaultHeight, 0],
        height: defaultHeight,
        groupType: newBaseType,
      };
      dispatch({ type: "SET_LEVELS", payload: [newLevel] });
      dispatch({ type: "SET_CUMULATIVE_HEIGHT", payload: defaultHeight });
      toast.success(
        `${
          levels.length === 0 ? "Added" : "Updated"
        } base model to: ${newBaseType}`
      );
    }
  }
};

// CHangung the Application View from VR to AR
export const toggleView = (view, dispatch) => {
  dispatch({ type: "SET_ACTIVE_VIEW", payload: view });
};

// ADDING TO CART FUNCTIONALITY
export const addToCart = async (
  checkout,
  state,
  variant_ID,
  dispatch,
  setCheckout,
  toast
) => {
  const { isInCart, isLoading, price, descripation } = state;
  if (!checkout) {
    return;
  }

  if (isInCart || isLoading) return;

  dispatch({ type: "SET_Loading" });

  const variant_id = variant_ID;
  const variantId = `gid://shopify/ProductVariant/${variant_id}`;

  const lineItemsToAdd = [
    {
      variantId,
      quantity: 1, // Set quantity to 1
      customAttributes: [
        {
          key: "Price after Customization",
          value: JSON.stringify(price),
        },
        {
          key: "Customization Details",
          value: JSON.stringify(descripation),
        },
      ],
    },
  ];

  const retryWithBackoff = async (fn, retries = 5, delay = 1000) => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0 && error.message.includes("Throttled")) {
        await new Promise((res) => setTimeout(res, delay));
        return retryWithBackoff(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  };

  // Create the client using environment variables
  const client = Client.buildClient({
    domain: "duralifthardware.com",
    storefrontAccessToken: process.env.REACT_APP_API_KEY,
  });
  try {
    const updatedCheckout = await retryWithBackoff(() =>
      client.checkout.addLineItems(checkout.id, lineItemsToAdd)
    );
    setCheckout(updatedCheckout);
    dispatch({ type: "SET_CART" });
    window.location.href = updatedCheckout.webUrl;
  } catch (error) {
    toast("Failed to add to cart:", error);
  } finally {
    dispatch({ type: "SET_Loading" });
  }
};

// Calculating the Prcie of the model based on the selected type and length
export const Price = (selectedType, selectedLength, price, dispatch, value) => {
  const selectedValue = value;
  const additionalPrice = priceMap[selectedType]?.[selectedLength] || 0;
  const updatedPrice = price + additionalPrice;
  selectedValue.push(additionalPrice);
  dispatch({ type: "SET_PRICE", payload: updatedPrice });
  dispatch({ type: "SET_VALUE", payload: selectedValue });
};
// Makign the Descripation for the model to be displayed in the cart
export const convert = (value) => {
  const typeMap = {
    PSINGLE:
      "1X Dura-Lift Elevate Adjustable Height Overhead Garage Door Ceiling Single Storage Platform",
    PDOUBLE:
      "1 x Dura-Lift Elevate Adjustable Height Overhead Garage Door Ceiling Double Storage Platform",
    PTRIPLE:
      "3X Dura-Lift Elevate Adjustable Height Overhead Garage Door Ceiling Single Storage Platform ",
    PQUAD:
      "4x Dura-Lift Elevate Adjustable Height Overhead Garage Door Ceiling Single Storage Platform ",
    PTRIPLE_L:
      "3X_L Dura-Lift Elevate Adjustable Height Overhead Garage Door Ceiling Single Storage Platform ",
    PQUAD_L:
      "4X_L Dura-Lift Elevate Adjustable Height Overhead Garage Door Ceiling Single Storage Platform ",
  };
  return typeMap[value] || "Invalid Type";
};

const createModelFromPSingle = (state, dispatch) => {
  const { selectedType, selectedLength, scale, rotation, type } = state;
  const psingleCount =
    selectedType === "PTRIPLE" || selectedType === "PTRIPLE_L"
      ? 3
      : selectedType === "PDOUBLE"
      ? 2
      : selectedType === "PQUAD" || selectedType === "PQUAD_L"
      ? 4
      : selectedType === "PSINGLE"
      ? 1
      : 0;
  dispatch({ type: "SET_PSINGLE_COUNT", payload: psingleCount });
  const selecttype = [...type, selectedType];
  dispatch({ type: "ADD_TYPE", payload: selecttype });

  const baseUrl = levelUrls[selectedType][selectedLength];
  const combinedUrl = `${baseUrl}_${psingleCount}`;

  const actualHeight = actualHeights[selectedLength] * scale;
  const newLevel = {
    url: baseUrl,
    height: actualHeight,
    xOffset: 0,
    zOffset: 0,
    groupType: selectedType,
  };
  if (selectedType === "PTRIPLE_L" || selectedType === "PQUAD_L") {
    newLevel.zOffset = actualHeight + 0.26;
  }
  return [newLevel];
};

export const addLevel = (state, dispatch, toast) => {
  const {
    selectedType,
    baseType,
    PositionZ,
    price,
    levels,
    scale,
    cumulativeHeight,
    platformsPerLevel,
    selectedLength,
    selectedPart,
    drop_down,
    value,
    rotation,
    levelIndex,
    platformName,
    selectedPartZ,
    PositionX,
  } = state;
  if (!selectedType) {
    toast.error("Please select base  model and  type  before adding levels.");
    return;
  } else if (levels.length === 0) {
    dispatch({ type: "SET_LOADING" });
    const newModelLevels = createModelFromPSingle(state, dispatch);
    let newLevels = [...levels];
    let newCumulativeHeight = cumulativeHeight;
    for (const modelLevel of newModelLevels) {
      for (let j = 0; j < platformsPerLevel; j++) {
        const lastIndex =
          PositionX.length === 1
            ? PositionX[0]
            : PositionX[PositionX.length - 1];
        const newPositionX =
          PositionX.length === 0
            ? selectedPart
            : Number(selectedPart) + lastIndex;
        const lastIndexz =
          PositionZ.length === 1
            ? PositionZ[0]
            : PositionZ[PositionZ.length - 1];
        const newPositionZ =
          PositionZ.length === 0
            ? selectedPartZ
            : Number(selectedPartZ) + lastIndexz;
        const NEWPostionX = PositionX;
        const NEWPostionz = PositionZ;
        NEWPostionX.push(newPositionX);
        NEWPostionz.push(newPositionZ);
        dispatch({ type: "Set_PositionX", payload: NEWPostionX });
        dispatch({ type: "Set_Positionz", payload: NEWPostionz });
        const adjustedXPosition = newPositionX;
        const adjustedZPosition = newPositionZ ? newPositionZ : 0;
        const newPosition = [
          adjustedXPosition,
          -newCumulativeHeight - modelLevel.height,
          adjustedZPosition,
        ];
        const newLevel = {
          id: `${Date.now()}-${modelLevel.groupType}-${j}`,
          url: modelLevel.url,
          position: newPosition,
          height: modelLevel.height,
          rotation: modelLevel.rotation,
          groupType: modelLevel.groupType,
        };
        newLevels.push(newLevel);
      }
    }

    newCumulativeHeight += newModelLevels[0].height;
    dispatch({ type: "SET_LEVELS", payload: newLevels });
    dispatch({ type: "SET_CUMULATIVE_HEIGHT", payload: newCumulativeHeight });
    dispatch({ type: "SET_LOADING" });
  } else {
    dispatch({ type: "SET_LOADING" });
    const Dropdownlevel = drop_down + 1;
    dispatch({ type: "SET_DROP_DOWN", payload: Dropdownlevel });
    Price(selectedType, selectedLength, price, dispatch, value);
    const newLevelIndex = levelIndex + 1;
    dispatch({ type: "SET_LEVEL_INDEX", payload: newLevelIndex });
    const details = {
      [`drop_down_level_${drop_down}`]: `${convert(
        selectedType
      )} Dura-Lift Elevate Adjustable Height Overhead Garage Door Ceiling Double Storage Platform PSINGLE ${selectedLength} INCH Drop Down, add below ${platformName} No platform`,
    };
    // dispatch({ type: "SET_DESCRIPTION", payload: details });
    const newModelLevels = createModelFromPSingle(state, dispatch);
    let newLevels = [...levels];
    let newCumulativeHeight = cumulativeHeight;
    for (const modelLevel of newModelLevels) {
      for (let j = 0; j < platformsPerLevel; j++) {
        const lastIndex =
          PositionX.length === 1
            ? PositionX[0]
            : PositionX[PositionX.length - 1];
        const newPositionX =
          PositionX.length === 0
            ? selectedPart
            : Number(selectedPart) + lastIndex;
        const lastIndexz =
          PositionZ.length === 1
            ? PositionZ[0]
            : PositionZ[PositionZ.length - 1];
        const newPositionZ =
          PositionZ.length === 0
            ? selectedPartZ
            : Number(selectedPartZ) + lastIndexz;
        const NEWPostionX = PositionX;
        const NEWPostionz = PositionZ;
        NEWPostionX.push(newPositionX);
        NEWPostionz.push(newPositionZ);
        dispatch({ type: "Set_PositionX", payload: NEWPostionX });
        dispatch({ type: "Set_Positionz", payload: NEWPostionz });
        const adjustedXPosition = newPositionX;
        const adjustedZPosition = newPositionZ ? newPositionZ : 0;
        const newPosition = [
          adjustedXPosition,
          -newCumulativeHeight - modelLevel.height,
          adjustedZPosition,
        ];
        const newLevel = {
          id: `${Date.now()}-${modelLevel.groupType}-${j}`,
          url: modelLevel.url,
          position: newPosition,
          height: modelLevel.height,
          rotation: modelLevel.rotation,
          groupType: modelLevel.groupType,
        };
        newLevels.push(newLevel);
      }
    }

    newCumulativeHeight += newModelLevels[0].height;
    dispatch({ type: "SET_LEVELS", payload: newLevels });
    dispatch({ type: "SET_CUMULATIVE_HEIGHT", payload: newCumulativeHeight });
    dispatch({ type: "SET_LOADING" });
    dispatch({ type: "SET_PLATFORM_NAME", payload: "" });
    dispatch({ type: "SET_SELECTED_PART", payload: 0 });
    dispatch({ type: "SET_SELECTED_PART_Z", payload: 0 });
    toast.success(`${selectedType} platform(s) added to the model`);
  }
};

// Removing the levels from the model
export const removeLevel = (state, dispatch, toast) => {
  const {
    levels,
    cumulativeHeight,
    drop_down,
    descripation,
    value,
    price,
    initalPrice,
    selectedType,
    initialPrice,
    type,
    levelIndex,
    PositionX,
    PositionZ,
  } = state;

  if (levels.length === 1) {
    toast.error("No levels to remove");
    dispatch({ type: "SET_PRICE", payload: initalPrice });
    return;
  }
  const index = levelIndex - 1;
  dispatch({ type: "SET_LEVEL", payload: index });
  const lastLevel = levels[levels.length - 1];
  const lastGroupType1 = type[type.length - 1];
  const type1 = [...type]; // Clone the type array
  type1.pop();

  // Determine how many platforms to remove based on the selected type
  const lastGroupType = 1;

  // Adjust cumulative height
  dispatch({ type: "ADD_TYPE", payload: type1 });
  dispatch({
    type: "SET_CUMULATIVE_HEIGHT",
    payload: cumulativeHeight - lastLevel.height,
  });

  const newLevels = levels.slice(0, Math.max(0, levels.length - lastGroupType));
  dispatch({ type: "SET_LEVELS", payload: newLevels });
  dispatch({ type: "SET_PLATFORM_NAME", payload: "" });

  const updatedDescripation = { ...descripation };
  delete updatedDescripation[`drop_down_level_${drop_down - 1}`];

  const lastValue = value[value.length - 1];
  let newPrice = price === initialPrice ? 0 : price - lastValue;

  const newValueArray = value.slice(0, -1);
  const newPostion = PositionX.slice(0, -1);
  const newPositionZ = PositionZ.slice(0, -1);
  dispatch({ type: "Set_PositionX", payload: newPostion });
  dispatch({ type: "Set_PositionZ", payload: newPositionZ });
  dispatch({ type: "SET_PRICE", payload: newPrice });
  dispatch({ type: "SET_VALUE", payload: newValueArray });
  dispatch({ type: "REMOVE_DESCRIPTION", payload: updatedDescripation });
  dispatch({ type: "SET_DROP_DOWN", payload: drop_down - 1 });
  dispatch({ type: "SET_SELECTED_PART", payload: 0 });
  dispatch({ type: "SET_PLATFORM_NAME", payload: "" });
  dispatch({ type: "SET_SELECTED_PART_Z", payload: 0 });
  dispatch({ type: "SET_LOADING" });
  toast.info("Removed the last level");
};
// Resetting all the settings to default
export const resetAll = (state, dispatch, toast) => {
  const { initalPrice, scale ,levels} = state;
  const newlevels = levels;
  newlevels.splice(0, newlevels.length);
  // console.log("newlevels", newlevels);
  dispatch({ type: "SET_PRICE", payload: 0 });
  dispatch({ type: "RESET_ALL" });
  dispatch({ type: "SET_MODEL", payload: null });
  dispatch({ type: "SET_BASE_TYPE", payload: "" });
  dispatch({ type: "SET_DROP_DOWN", payload: 1 });
  dispatch({ type: "SET_LEVEL", payload: newlevels });
  dispatch({ type: "SET_PLATFORM_NAME", payload: "" });
  dispatch({ type: "SET_SELECTED_PART", payload: 0 });
  dispatch({ type: "SET_SELECTED_PART_Z", payload: 0 });
  dispatch({ type: "SET_CUMULATIVE_HEIGHT", payload: 0 });
  dispatch({ type: "Set_PositionX", payload: [] });
  dispatch({ type: "Set_PositionZ", payload: [] });
  dispatch({ type: "SET_PLATFORM_NAME", payload: "" });
  dispatch({ type: "SET_MODEL_SNAPSHOT", payload: null });
  toast.info("Reset all settings to default");
};
