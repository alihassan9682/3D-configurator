import Client from "shopify-buy";
import { actualHeights, levelUrls } from "./index";
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
  selectedPart: null,
  initalPrice: 0,
  drop_down: 1,
  rotation: 0,
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
    case "SET_ROTATION":
      return {
        ...state,
        rotation: action.payload,
      }
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
      const newRoation = rotation;
      const newLevel = {
        id: `${Date.now()}`,
        url: defaultUrl,
        position: [0, -cumulativeHeight - defaultHeight, 0],
        height: defaultHeight,
        rotation: newRoation,
      };
       console.log("newLevel", newLevel)
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

const priceMap = {
  PSINGLE: { 24: 97.94, 12: 80.94, 6: 70.94 },
  PDOUBLE: { 24: 195.94, 12: 180.94, 6: 170.94 },
  PTRIPLE: { 24: 190.89, 12: 240.46, 6: 230.46 },
  PTRIPLE_L: { 24: 240.54, 12: 257.58, 6: 257.58 },
  PQUAD: { 24: 351.35, 12: 351.35, 6: 250.56 },
  PQUAD_L: { 24: 376.86, 12: 351.35, 6: 351.35 },
};

// Calculating the Prcie of the model based on the selected type and length
export const Price = (selectedType, selectedLength, price, dispatch,value) => {
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
    PTRIPLE_L: "3X",
    PQUAD_L: "4X",
  };
  return typeMap[value] || "Invalid Type";
};

// Adding the levels to the model
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
       console.log('rotation',rotation)
  dispatch({ type: "SET_LOADING" });
  const Dropdownlevel = drop_down + 1;
  dispatch({ type: "SET_DROP_DOWN", payload: Dropdownlevel });
  Price(selectedType, selectedLength, price, dispatch, value);
  const detials = {
    [`drop_down_level_${drop_down}`]: `${convert(
      selectedType
    )} PSINGLE ${selectedLength} INCH`,
  };
  dispatch({ type: "SET_DESCRIPTION", payload: detials });

  const selectedLevelUrl = levelUrls[selectedType][selectedLength];
  console.log("selectedLevelUrl", selectedLevelUrl);
  const actualHeight = actualHeights[selectedLength] * scale;
  let newLevels = [...levels];
  let newCumulativeHeight = cumulativeHeight;
  let newRotation = rotation;
  console.log("newRotation", newRotation);
  for (let i = 0; i < platformsPerLevel; i++) {
    const xPosition =
      selectedPart < 1.53
        ? 0
        : selectedPart < 3.06
        ? 1.53
        :selectedPart < 4.59
        ? 3.06
        :selectedPart < 6.13
        ? 4.59
        : 0;
    console.log("selectedPart", selectedPart);
    console.log("xPosition", xPosition);

    const newPosition = [xPosition, -newCumulativeHeight - actualHeight,0];
    const newLevel = {
      id: `${Date.now()}-${i}`,
      url: selectedLevelUrl,
      position: newPosition,
      height: actualHeight,
      rotation: newRotation,
    };
     console.log("newLevel", newLevel.rotation)
    newCumulativeHeight += actualHeight;
    newLevels.push(newLevel);
  }

  dispatch({ type: "SET_LEVELS", payload: newLevels });
  dispatch({ type: "SET_CUMULATIVE_HEIGHT", payload: newCumulativeHeight });
  dispatch({ type: "SET_LOADING" });

  toast.success("Platform(s) added to the model");
  dispatch({ type: "SET_SELECTED_TYPE", payload: "" });
  dispatch({ type: "SET_SELECTED_LENGTH", payload: 24 });
  dispatch({ type: "SET_ROTATION", payload: 0 });
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
  } = state;

  if (levels.length === 0 || levels.length === 1) {
    toast.error("No levels to remove");
    dispatch({ type: "SET_PRICE", payload: initalPrice });
  } else if (levels.length > 0) {
    const lastLevel = levels[levels.length - 1];

    // Update cumulative height by removing the height of the last level
    dispatch({
      type: "SET_CUMULATIVE_HEIGHT",
      payload: cumulativeHeight - lastLevel.height,
    });

    // Remove the last level
    const newLevels = levels.slice(0, -1);
    dispatch({ type: "SET_LEVELS", payload: newLevels });

    // Remove the last dropdown description
    const updatedDescripation = { ...descripation };
    delete updatedDescripation[`drop_down_level_${drop_down - 1}`];

    const lastValue = value[value.length - 1];
    const newPrice = price - lastValue;

    const newValueArray = value.slice(0, -1);

    dispatch({ type: "SET_PRICE", payload: newPrice });
    dispatch({ type: "SET_VALUE", payload: newValueArray });
    dispatch({ type: "REMOVE_DESCRIPTION", payload: updatedDescripation });
    dispatch({ type: "SET_DROP_DOWN", payload: drop_down - 1 });

    toast.info("Removed the last level");
  }
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
