import Client from "shopify-buy";

import { actualHeights, levelUrls, priceMap } from "./index";
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
  selectedPart: {},
  initalPrice: 0,
  drop_down: 1,
  rotation: 0,
  type: [],
};
// Reducer function for the application
export const heroReducer = (state, action) => {
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
        },
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
        scale: 0.05,
        activeView: "VR",
        selectedType: "",
        selectedLength: 24,
        platformsPerLevel: 1,
        descripation: { base: state.baseType },
        levels: action.payload,
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
  rotation
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
      const newRoation = [0, rotation, 0];
      const newLevel = {
        id: `${Date.now()}`,
        url: defaultUrl,
        position: [0, -cumulativeHeight - defaultHeight, 0],
        height: defaultHeight,
        rotation: newRoation,
      };
      console.log("newLevel", newLevel);
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
  setCheckout
) => {
  const { isInCart, isLoading, price, descripation } = state;
  if (!checkout) {
    console.error("Checkout object is null or undefined");
    return;
  }

  if (isInCart || isLoading) return;

  dispatch({ type: "SET_Loading" });
  console.log("Button Clicked");

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
  console.log("process.env.REACT_APP_API_KEY", process.env.REACT_APP_API_KEY);

  try {
    const updatedCheckout = await retryWithBackoff(() =>
      client.checkout.addLineItems(checkout.id, lineItemsToAdd)
    );
    setCheckout(updatedCheckout);
    dispatch({ type: "SET_CART" });
    window.location.href = updatedCheckout.webUrl;
  } catch (error) {
    console.error("Failed to add to cart:", error);
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
    PSINGLE: "1X",
    PDOUBLE: "2X",
    PTRIPLE: "3X",
    PQUAD: "4X",
    PTRIPLE_L: "3X_L",
    PQUAD_L: "4X_L",
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

  const selecttype = [...type, selectedType];
  dispatch({ type: "ADD_TYPE", payload: selecttype });
  const selectedLevelUrl = levelUrls["PSINGLE"][selectedLength];
  const actualHeight = actualHeights[selectedLength] * scale;
  const modelLevels = [];

  for (let i = 0; i < psingleCount; i++) {
    let xvalue = 0;
    let zvalue = 0;
    const baseOffset =
      rotation === 0 ? [0, 0.34, 0.67, 1] : [0, 0.32, 0.61, 0.91];

    if (i < baseOffset.length) {
      xvalue = i * actualHeight + baseOffset[i];
    }

    if (
      (selectedType === "PTRIPLE_L" || selectedType === "PQUAD_L") &&
      i === psingleCount - 1
    ) {
      zvalue = actualHeight + 0.26;
      xvalue = i > 0 ? modelLevels[i - 1].xOffset : 0;
    }

    // Create new level object
    const newLevel = {
      url: selectedLevelUrl,
      height: actualHeight,
      xOffset: xvalue,
      zOffset: zvalue,
      rotation: [0, 0, 0],
      groupType: selectedType,
    };

    // Add the new level to the modelLevels array
    modelLevels.push(newLevel);
  }

  return modelLevels;
};

export const addLevel = (state, dispatch, toast) => {
  const {
    selectedType,
    baseType,
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
  } = state;

  if (!selectedType && !baseType) {
    toast.error(
      "Please select both the base type and model type before adding levels."
    );
    return;
  }

  dispatch({ type: "SET_LOADING" });

  const Dropdownlevel = drop_down + 1;
  dispatch({ type: "SET_DROP_DOWN", payload: Dropdownlevel });

  // Assuming Price is a function that calculates the price
  Price(selectedType, selectedLength, price, dispatch, value);

  const details = {
    [`drop_down_level_${drop_down}`]: `${convert(
      selectedType
    )} PSINGLE ${selectedLength} INCH`,
  };
  dispatch({ type: "SET_DESCRIPTION", payload: details });

  const newModelLevels = createModelFromPSingle(state, dispatch);
  let newLevels = [...levels];
  let newCumulativeHeight = cumulativeHeight;

  for (const modelLevel of newModelLevels) {
    for (let j = 0; j < platformsPerLevel; j++) {
      const xPosition =
        selectedPart.x < 1.53
          ? 0
          : selectedPart.x < 3.06
          ? 1.53
          : selectedPart.x < 4.59
          ? 3.06
          : selectedPart.x < 6.13
          ? 4.59
          : 0;
      console.log("selectedPart.z ", selectedPart.z);

      const PositionZ =
        selectedPart.z < 0 ? -1.53 : selectedPart.z > 1 ? 1.53 : 0;
      const adjustedXPosition = xPosition + modelLevel.xOffset;
      const adjustedZPosition = modelLevel.zOffset + PositionZ;
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

  // Increase cumulative height once per group
  newCumulativeHeight += newModelLevels[0].height;
  dispatch({ type: "SET_LEVELS", payload: newLevels });
  dispatch({ type: "SET_CUMULATIVE_HEIGHT", payload: newCumulativeHeight });
  dispatch({ type: "SET_LOADING" });

  toast.success(`${selectedType} platform(s) added to the model`);
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
  } = state;

  if (levels.length === 1) {
    toast.error("No levels to remove");
    dispatch({ type: "SET_PRICE", payload: initalPrice });
    return;
  }

  const lastLevel = levels[levels.length - 1];
  const lastGroupType1 = type[type.length - 1];
  const type1 = [...type]; // Clone the type array
  type1.pop();

  // Determine how many platforms to remove based on the selected type
  const lastGroupType =
    lastGroupType1 === "PTRIPLE"
      ? 3
      : lastGroupType1 === "PDOUBLE"
      ? 2
      : lastGroupType1 === "PQUAD"
      ? 4
      : lastGroupType1 === "PTRIPLE_L"
      ? 3
      : lastGroupType1 === "PQUAD_L"
      ? 4
      : lastGroupType1 === "PSINGLE"
      ? 1
      : 0;

  // Adjust cumulative height
  dispatch({ type: "ADD_TYPE", payload: type1 });
  dispatch({
    type: "SET_CUMULATIVE_HEIGHT",
    payload: cumulativeHeight - lastLevel.height,
  });

  // Ensure not to remove more levels than exist
  const newLevels = levels.slice(0, Math.max(0, levels.length - lastGroupType));
  dispatch({ type: "SET_LEVELS", payload: newLevels });

  // Remove the last dropdown description
  const updatedDescripation = { ...descripation };
  delete updatedDescripation[`drop_down_level_${drop_down - 1}`];

  // Calculate new price based on removed levels
  const lastValue = value[value.length - 1];
  let newPrice = price === initialPrice ? 0 : price - lastValue;

  // Update value array by removing last entry
  const newValueArray = value.slice(0, -1);

  dispatch({ type: "SET_PRICE", payload: newPrice });
  dispatch({ type: "SET_VALUE", payload: newValueArray });
  dispatch({ type: "REMOVE_DESCRIPTION", payload: updatedDescripation });
  dispatch({ type: "SET_DROP_DOWN", payload: drop_down - 1 });

  toast.info("Removed the last level");
};

// Resetting all the settings to default
export const resetAll = (state, dispatch, toast) => {
  const { levels, initalPrice } = state;
  const newlevels = [];
  newlevels.push(levels[0]);
  console.log("newlevels", newlevels);
  dispatch({ type: "SET_PRICE", payload: initalPrice });
  dispatch({ type: "RESET_ALL", payload: newlevels });
  dispatch({ type: "SET_DROP_DOWN", payload: 1 });
  toast.info("Reset all settings to default");
};
