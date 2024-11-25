import Client from "shopify-buy";
import { useEffect, useState } from "react";
import { actualHeights, levelUrls, priceMap, baseTypeOptions } from "./index";
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
  modelSnapshot: null,
  modelIos: null,
  lineItem: [],
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
    case "SET_MODEL_IOS":
      return {
        ...state,
        modelIos: action.payload,
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

    case "SET_LINEITEM":
      return {
        ...state,
        lineItem: action.payload,
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
  cumulativeHeight
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

/**
 * Creates or retrieves an existing checkout
 * @param {Client} client - Shopify client instance
 * @returns {Object} Checkout object
 */

/**
 * Debug logger for cart operations
 */

const debugLog = (message, data) => {
  console.log(`[Cart Debug] ${message}`, JSON.stringify(data, null, 2));
};

export const addToCart = async (
  checkout,
  state,
  variant_ID,
  toast,
  dispatch,
  setCheckout
) => {
  // Early validation of state and items
  if (!state) {
    toast.error("Invalid state provided");
    debugLog("Invalid state:", state);
    return;
  }

  const { isInCart, isLoading, lineItem } = state;

  // Debug log the incoming line item data
  debugLog("Incoming line item data:", lineItem);

  // Validate lineItem structure with more detailed logging
  if (!Array.isArray(lineItem)) {
    toast.error("Cart items are not properly formatted");
    debugLog("Invalid lineItem format:", lineItem);
    return;
  }

  // Prevent duplicate submissions
  if (isInCart || isLoading) {
    debugLog("Duplicate submission prevented", { isInCart, isLoading });
    return;
  }

  dispatch({ type: "SET_Loading" });

  try {
    // Initialize Shopify client
    const client = Client.buildClient({
      domain: "duralifthardware.com",
      storefrontAccessToken: process.env.REACT_APP_API_KEY,
    });

    // Ensure checkout exists before proceeding
    let currentCheckout = checkout;
    if (!currentCheckout?.id) {
      debugLog("No existing checkout, creating new one");
      currentCheckout = await client.checkout.create();
      debugLog("New checkout created:", currentCheckout);
    }

    // Validate and format line items with improved error handling
    const validatedLineItems = [];
    for (const item of lineItem) {
      debugLog("Processing item:", item);

      // Detailed validation of each item
      if (!item) {
        debugLog("Null or undefined item found");
        continue;
      }

      if (!item.variantID) {
        debugLog("Item missing variantID:", item);
        continue;
      }

      // Format the item with explicit type checking
      const formattedItem = {
        variantId: `gid://shopify/ProductVariant/${item.variantID}`,
        quantity: Math.max(1, parseInt(item.quantity) || 1), // Ensure minimum quantity of 1
      };

      debugLog("Formatted item:", formattedItem);
      validatedLineItems.push(formattedItem);
    }

    // Double-check we have items to add
    if (!validatedLineItems.length) {
      throw new Error("No valid items to add to cart");
    }

    debugLog("Final validated items:", validatedLineItems);

    // Add items to checkout with retry mechanism
    let retryCount = 0;
    const maxRetries = 3;
    let updatedCheckout;

    while (retryCount < maxRetries) {
      try {
        updatedCheckout = await client.checkout.addLineItems(
          currentCheckout.id,
          validatedLineItems
        );
        break; // Success, exit loop
      } catch (error) {
        retryCount++;
        debugLog(`Attempt ${retryCount} failed:`, error);
        if (retryCount === maxRetries) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
      }
    }

    if (!updatedCheckout?.lineItems) {
      throw new Error("Failed to update checkout after multiple attempts");
    }

    debugLog("Checkout updated successfully:", {
      checkoutId: updatedCheckout.id,
      lineItemCount: updatedCheckout.lineItems.length,
    });

    // Update state and handle redirect
    setCheckout(updatedCheckout);
    dispatch({ type: "SET_CART" });

    if (updatedCheckout.webUrl) {
      // Use timeout to ensure state updates complete
      setTimeout(() => {
        window.location.assign(updatedCheckout.webUrl);
      }, 100);
    } else {
      throw new Error("No checkout URL available");
    }
  } catch (error) {
    debugLog("Error occurred:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });

    // More specific error messages
    if (error.message.includes("invalid")) {
      toast.error("Item validation failed. Please try again.");
    } else if (error.message.includes("No valid items")) {
      toast.error("Please ensure all items are properly selected");
    } else if (error.message.includes("checkout")) {
      toast.error("Cart initialization failed. Please refresh and try again.");
    } else {
      toast.error("Unable to add items to cart. Please try again.");
    }
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
  const { selectedType, selectedLength, scale, type } = state;
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
  // const combinedUrl = `${baseUrl}_${psingleCount}`;

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
    PositionZ,
    price,
    levels,
    cumulativeHeight,
    platformsPerLevel,
    selectedLength,
    selectedPart,
    drop_down,
    value,
    levelIndex,
    selectedPartZ,
    PositionX,
    lineItem,
  } = state;
  if (!selectedType) {
    toast.error("Please select base  model and  type  before adding levels.");
    return;
  } else if (levels.length === 0) {
    dispatch({ type: "SET_LOADING" });
    const newlineItems = [...lineItem];
    const item = baseTypeOptions.find((item) => item.value === selectedType);
    const variantID = item.varaintID;

    // Find the index instead of the item
    const existingItemIndex = newlineItems.findIndex(
      (lineItem) => lineItem.variantID === variantID
    );
    const quantity = 1;

    if (existingItemIndex !== -1) {
      // Update quantity using the index
      newlineItems[existingItemIndex].quantity += quantity;
    } else {
      newlineItems.push({
        variantID: variantID,
        quantity: quantity,
      });
    }

    dispatch({ type: "SET_LINEITEM", payload: newlineItems });
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
    // const details = {
    //   [`drop_down_level_${drop_down}`]: `${convert(
    //     selectedType
    //   )} Dura-Lift Elevate Adjustable Height Overhead Garage Door Ceiling Double Storage Platform PSINGLE ${selectedLength} INCH Drop Down, add below ${platformName} No platform`,
    // };
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
        const newlineItems = [...lineItem];
        const item = baseTypeOptions.find(
          (item) => item.value === selectedType
        );
        const variantID = item.varaintID;

        // Find the index instead of the item
        const existingItemIndex = newlineItems.findIndex(
          (lineItem) => lineItem.variantID === variantID
        );
        const quantity = 1;

        if (existingItemIndex !== -1) {
          // Update quantity using the index
          newlineItems[existingItemIndex].quantity += quantity;
        } else {
          newlineItems.push({
            variantID: variantID,
            quantity: quantity,
          });
        }

        dispatch({ type: "SET_LINEITEM", payload: newlineItems });
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
export const removeLevel = (
  state,
  dispatch,
  toast,
  setVariantID,
  setIdNull
) => {
  const {
    levels,
    cumulativeHeight,
    drop_down,
    descripation,
    value,
    price,
    initialPrice,
    type,
    levelIndex,
    PositionX,
    PositionZ,
    lineItem,
  } = state;

  // Check if there are levels to remove; if not, show an error toast
  if (levels.length === 0) {
    toast.error("No levels to remove");
    return;
  }

  if (levels.length === 1) {
    dispatch({ type: "SET_BASE_TYPE", payload: "" });
    setVariantID(null);
    setIdNull(true);
  }

  const newLevelIndex = levelIndex - 1;
  const lastLevel = levels[levels.length - 1];
  const lastGroupType = type.slice(0, -1); // Remove last item from type array

  // Create a new copy of lineItem array
  let newLineItems = [...lineItem];

  // Find the item in baseTypeOptions that matches the last level's groupType
  const matchingBaseType = baseTypeOptions.find(
    (item) => item.value === lastLevel.groupType
  );

  if (matchingBaseType) {
    // Find the index of the item in lineItems
    const index = newLineItems.findIndex(
      (item) => item.variantID === matchingBaseType.varaintID
    );

    if (index !== -1) {
      if (newLineItems[index].quantity === 1) {
        // Remove the item completely if quantity would become 0
        newLineItems = newLineItems.filter((_, i) => i !== index);
      } else {
        // Decrease quantity by 1
        newLineItems[index] = {
          ...newLineItems[index],
          quantity: newLineItems[index].quantity - 1,
        };
      }
    }
  }

  // Dispatch the updated lineItems
  dispatch({ type: "SET_LINEITEM", payload: newLineItems });

  dispatch({ type: "SET_LEVEL_INDEX", payload: newLevelIndex });
  dispatch({ type: "SET_TYPE", payload: lastGroupType });
  dispatch({
    type: "SET_CUMULATIVE_HEIGHT",
    payload: cumulativeHeight - lastLevel.height,
  });

  // Update levels array by removing the last level
  const newLevels = levels.slice(0, -1);
  dispatch({ type: "SET_LEVELS", payload: newLevels });

  const updatedDescripation = { ...descripation };
  delete updatedDescripation[`drop_down_level_${drop_down - 1}`];
  dispatch({ type: "SET_DESCRIPTION", payload: updatedDescripation });

  const lastValue = value[value.length - 1];
  const newPrice = price === initialPrice ? 0 : price - lastValue;
  const newValueArray = value.slice(0, -1);
  dispatch({ type: "SET_PRICE", payload: newPrice });
  dispatch({ type: "SET_VALUE", payload: newValueArray });

  const newPositionX = PositionX.slice(0, -1);
  const newPositionZ = PositionZ.slice(0, -1);
  dispatch({ type: "Set_PositionX", payload: newPositionX });
  dispatch({ type: "Set_Positionz", payload: newPositionZ });

  dispatch({ type: "SET_DROP_DOWN", payload: drop_down - 1 });
  dispatch({ type: "SET_SELECTED_PART", payload: 0 });
  dispatch({ type: "SET_PLATFORM_NAME", payload: "" });
  dispatch({ type: "SET_SELECTED_PART_Z", payload: 0 });
  dispatch({ type: "SET_LOADING" });

  toast.info("Removed the last level");
};

export const resetAll = (state, dispatch, toast, setVariantID, setIdNull) => {
  dispatch({ type: "SET_LOADING" });

  // Reset all state values
  setVariantID(null);
  setIdNull(true);

  dispatch({ type: "SET_PRICE", payload: 0 });
  dispatch({ type: "SET_BASE_TYPE", payload: "" });
  dispatch({ type: "SET_DROP_DOWN", payload: 1 });
  dispatch({ type: "SET_LEVELS", payload: [] }); // Changed from SET_LEVEL to SET_LEVELS for consistency
  dispatch({ type: "SET_PLATFORM_NAME", payload: "" });
  dispatch({ type: "SET_SELECTED_PART", payload: 0 });
  dispatch({ type: "SET_SELECTED_PART_Z", payload: 0 });
  dispatch({ type: "SET_CUMULATIVE_HEIGHT", payload: 0 });
  dispatch({ type: "Set_PositionX", payload: [] });
  dispatch({ type: "Set_Positionz", payload: [] });
  dispatch({ type: "SET_LINEITEM", payload: [] }); // Properly reset lineItem array
  dispatch({ type: "SET_MODEL", payload: null });
  dispatch({ type: "SET_MODEL_IOS", payload: null });
  dispatch({ type: "SET_MODEL_SNAPSHOT", payload: null });
  dispatch({ type: "SET_DESCRIPTION", payload: { base: "" } });
  dispatch({ type: "RESET_ALL" });

  toast.info("Reset all settings to default");
};
