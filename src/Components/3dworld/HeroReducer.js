import Client from "shopify-buy";
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
};

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
    case "SET_CART":
      return {
        ...state,
        isInCart: !state.isInCart,
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
export const Price = (selectedType, selectedLength, price, dispatch) => {
  let updatePrice = price;
  const selectedValue = [];
  let value = [];
  switch (true) {
    case selectedType === "PSINGLE" && selectedLength === 24:
      updatePrice += 97.94;
      selectedValue.push(97.94);
      break;
    case selectedType === "PSINGLE" && selectedLength === 12:
      updatePrice += 80.94;
      selectedValue.pus(97.94);

      break;
    case selectedType === "PSINGLE" && selectedLength === 6:
      updatePrice += 70.94;
      selectedValue.push(70.94);

      break;
    case selectedType === "PDOUBLE" && selectedLength === 24:
      updatePrice += 195.94;
      selectedValue.push(195.94);

      break;
    case selectedType === "PDOUBLE" && selectedLength === 12:
      updatePrice += 180.94;
      selectedValue.push(180.84);

      break;
    case selectedType === "PDOUBLE" && selectedLength === 6:
      updatePrice += 170.94;
      selectedValue.push(170.94);

      break;
    case selectedType === "PTRIPLE" && selectedLength === 24:
      updatePrice += 190.89;
      selectedValue.push(190.89);

      break;
    case selectedType === "PTRIPLE" && selectedLength === 12:
      updatePrice += 240.46;
      selectedValue.push(97.94);

      break;
    case selectedType === "PTRIPLE" && selectedLength === 6:
      updatePrice += 230.46;
      selectedValue.push(230.46);

      break;
    case selectedType === "PTRIPLE_L" && selectedLength === 12:
      updatePrice += 257.58;
      selectedValue.push(257.58);
      break;
    case selectedType === "PTRIPLE_L" && selectedLength === 6:
      updatePrice += 257.58;
      selectedValue.push(257.58);

      break;
    case selectedType === "PTRIPLE_L" && selectedLength === 24:
      updatePrice += 240.54;
      selectedValue.push(240.54);

      break;
    case selectedType === "PQUAD" && selectedLength === 6:
      updatePrice += 250.56;
      selectedValue.push(250.56);

      break;
    case selectedType === "PQUAD" && selectedLength === 12:
      updatePrice += 351.35;
      selectedValue.push(351.35);

      break;
    case selectedType === "PQUAD" && selectedLength === 24:
      updatePrice += 351.35;
      selectedValue.push(351.35);

      break;
    case selectedType === "PQUAD_L" && selectedLength === 6:
      updatePrice += 351.35;
      selectedValue.push(351.35);

      break;
    case selectedType === "PQUAD_L" && selectedLength === 12:
      updatePrice += 351.35;
      selectedValue.push(351.35);

      break;
    case selectedType === "PQUAD_L" && selectedLength === 24:
      updatePrice += 376.86;
      selectedValue.push(376.86);
      break;
    default:
      updatePrice = 0;
  }
  dispatch({ type: "SET_PRICE", payload: updatePrice });
  dispatch({ type: "SET_VALUE", payload: selectedValue });
};

export const convert = (value) => {
  switch (value) {
    case "PSINGLE":
      return "1X";
    case "PDOUBLE":
      return "2X";
    case "PTRIPLE":
      return "3X";
    case "PQUAD":
      return "4X";
    case "PTRIPLE_L":
      return "3X";
    case "PQUAD_L":
      return "4X";
    default:
      return "Invalid Type";
  }
};

export const addLevel = (
  selectedType,
  baseType,
  dispatch,
  price,
  levels,
  levelUrls,
  setDropdownlevel,
  actualHeights,
  scale,
  cumulativeHeight,
  platformsPerLevel,
  selectedLength,
  toast,
  drop_down
) => {
  if (!selectedType && !baseType) {
    toast.error(
      "Please select both the base type and model type before adding levels."
    );
    return;
  }
  setDropdownlevel(drop_down + 1);
  Price(selectedType, selectedLength, price, dispatch);
  const detials = {
    [`drop_down_level_${drop_down}`]: `${convert(
      selectedType
    )} PSINGLE ${selectedLength} INCH`,
  };
  dispatch({ type: "SET_DESCRIPTION", payload: detials });
  const selectedLevelUrl = levelUrls[selectedType][selectedLength];
  const actualHeight = actualHeights[selectedLength] * scale;
  let newLevels = [...levels];
  let newCumulativeHeight = cumulativeHeight;
  for (let i = 0; i < platformsPerLevel; i++) {
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
  toast.success("Platform(s) added to the modal");
};
export const toggleView = (view, dispatch) => {
  dispatch({ type: "SET_ACTIVE_VIEW", payload: view });
};

export const resetAll = (levels, dispatch, toast, initalPrice) => {
  const newlevels = [];
  newlevels.push(levels[0]);
  console.log("newlevels", newlevels);
  dispatch({ type: "SET_PRICE", payload: initalPrice });
  dispatch({ type: "RESET_ALL", payload: newlevels });
  toast.info("Reset all settings to default");
};
export const removeLevel = (
  levels,
  cumulativeHeight,
  dispatch,
  drop_down,
  setDropdownlevel,
  toast,
  descripation,
  value,
  price
) => {
  if (levels.length === 0 || levels.length === 1) {
    toast.error("No levels to removes");
  } else if (levels.length > 0) {
    const lastLevel = levels[levels.length - 1];
    dispatch({
      type: "SET_CUMULATIVE_HEIGHT",
      payload: cumulativeHeight - lastLevel.height,
    });
    const newLevels = levels.slice(0, -1);
    dispatch({ type: "SET_LEVELS", payload: newLevels });
    const updatedDescripation = { ...descripation };
    delete updatedDescripation[`drop_down_level_${drop_down - 1}`];
    console.log("value", value);
    let newPrice = value[value.length - 1];
    const Newvalue = value.slice(0, -1);
    console.log("newPrice", newPrice);
    price -= newPrice;
    dispatch({ type: "SET_PRICE", payload: price });
    dispatch({ type: "SET_VALUE", payload: Newvalue });
    console.log("updatedDescripation", updatedDescripation);
    dispatch({ type: "REMOVE_DESCRIPTION", payload: updatedDescripation });
    setDropdownlevel(drop_down - 1);
    toast.info("Removed the last level");
  }
};

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
      };

      dispatch({ type: "SET_LEVELS", payload: [newLevel] });
      dispatch({ type: "SET_CUMULATIVE_HEIGHT", payload: defaultHeight });
      toast.success(`Added base modal: ${newBaseType}`);
    }
  }
};

export const addToCart = async (
  checkout,
  isInCart,
  isLoading,
  id,
  price,
  descripation,
  dispatch,
  setCheckout
) => {
  if (!checkout) {
    console.error("Checkout object is null or undefined");
    return;
  }

  if (isInCart || isLoading) return;

  dispatch({ type: "SET_Loading" });
  console.log("Button Clicked");

  const variant_id = id;
  const variantId = `gid://shopify/ProductVariant/${variant_id}`;

  const customPrice = price;
  const customDescripation = JSON.stringify(descripation);
  const lineItemsToAdd = [
    {
      variantId,
      quantity: 1, // Set quantity to 1
      customAttributes: [
        {
          key: "Price after Customization",
          value: JSON.stringify(customPrice),
        },
        { key: "Customization Details", value: customDescripation },
      ],
    },
  ];

  // Retry function for handling API throttling
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
      client.checkout.addLineItems(checkout.id, lineItemsToAdd),
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

