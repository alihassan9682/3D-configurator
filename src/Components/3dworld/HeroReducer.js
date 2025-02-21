import Client from "shopify-buy";

import { actualHeights, levelUrls, baseTypeOptions } from "./index";
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
  isLoading: false,
  isInCart: false,
  model: null,
  selectedPart: 0,
  inital: 0,
  drop_down: 1,
  rotation: 0,
  type: [],
  pSingle: 0,
  levelIndex: 0,
  platformName: "",
  selectedPartZ: 0,
  top: true,
  PositionX: [],
  PositionZ: [0],
  modelSnapshot: null,
  modelIos: null,
  lineItem: [],
  performingExport: false,
};
// Reducer function for the application
export const heroReducer = (state, action) => {
  switch (action.type) {
    case "SET_LEVEL_INDEX":
      return {
        ...state,
        levelIndex: action.payload,
      };
    case "SET_EXPORT":
      return {
        ...state,
        performingExport: action.payload,
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
    case "SET_INITIAL_":
      return {
        ...state,
        inital: action.payload,
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
        isInCart: action.payload,
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
      // const defaultHeight = actualHeights[defaultLength];
      const defaultHeight = actualHeights[defaultLength];
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
      dispatch({ type: "SET_BASE_TYPE", payload: newBaseType });
      toast.success(
        `${
          levels.length === 0 ? "Added" : "Updated"
        } base model to: ${newBaseType}`
      );
    }
  }
};
export const toggleView = (view, dispatch) => {
  dispatch({ type: "SET_ACTIVE_VIEW", payload: view });
};

export const addToCart = async (
  cart, // Now a cart object with id and checkoutUrl, or null if not initialized
  state,
  toast,
  dispatch,
  setCart // Renamed from setCheckout for clarity
) => {
  const { performingExport } = state;
  if (performingExport) {
    toast.error("Please wait for the export to finish before adding to cart.");
    return;
  }
  if (!state) {
    toast.error("Invalid state provided");
    return;
  }
  const { isInCart, isLoading, lineItem } = state;
  if (!Array.isArray(lineItem)) {
    toast.error("Cart items are not properly formatted");
    return;
  }

  if (isInCart || isLoading) {
    return;
  }

  dispatch({ type: "SET_Loading" });

  const storefrontAccessToken = process.env.REACT_APP_API_KEY;
  const endpoint = "https://duralifthardware.com/api/2024-10/graphql.json"; // Latest Storefront API version

  try {
    let currentCart = cart;
    if (!currentCart?.id) {
      // Create a new cart
      const createCartQuery = `
        mutation {
          cartCreate {
            cart {
              id
              checkoutUrl
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const createResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
        },
        body: JSON.stringify({ query: createCartQuery }),
      });

      const createResult = await createResponse.json();
      if (!createResult.data?.cartCreate?.cart) {
        throw new Error(
          "Failed to create cart: " +
            JSON.stringify(
              createResult.data?.cartCreate?.userErrors || createResult.errors
            )
        );
      }
      currentCart = createResult.data.cartCreate.cart;
    }

    // Format line items for Shopify Cart API
    const validatedLineItems = lineItem
      .filter((item) => item && item.variantID)
      .map((item) => ({
        merchandiseId: `gid://shopify/ProductVariant/${item.variantID}`, // Changed from variantId
        quantity: Math.max(1, parseInt(item.quantity) || 1),
        attributes: [
          // Changed from customAttributes
          {
            key: "description",
            value:
              typeof item.description === "object"
                ? JSON.stringify(item.description)
                : item.description?.toString() || "No description provided",
          },
        ],
      }));

    if (!validatedLineItems.length) {
      throw new Error("No valid items to add to cart");
    }

    // Add items to the cart with retry mechanism
    const addItemsQuery = `
      mutation ($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    let retryCount = 0;
    const maxRetries = 3;
    let updatedCart;

    while (retryCount < maxRetries) {
      try {
        const addResponse = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
          },
          body: JSON.stringify({
            query: addItemsQuery,
            variables: {
              cartId: currentCart.id,
              lines: validatedLineItems,
            },
          }),
        });

        const addResult = await addResponse.json();
        if (
          addResult.errors ||
          addResult.data?.cartLinesAdd?.userErrors?.length
        ) {
          throw new Error(
            "Failed to add items: " +
              JSON.stringify(
                addResult.data?.cartLinesAdd?.userErrors || addResult.errors
              )
          );
        }
        updatedCart = addResult.data.cartLinesAdd.cart;
        break;
      } catch (error) {
        retryCount++;
        if (retryCount === maxRetries) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
      }
    }

    if (!updatedCart?.lines?.edges?.length) {
      throw new Error("Failed to update cart after multiple attempts");
    }

    // Update state and handle redirect
    setCart(updatedCart); // Updated to setCart
    dispatch({ type: "SET_CART", payload: true });

    const checkoutUrl = updatedCart.checkoutUrl;
    if (checkoutUrl) {
      setTimeout(() => {
        window.location.assign(checkoutUrl);
      }, 100);
    } else {
      throw new Error("No checkout URL available");
    }
  } catch (error) {
    console.error("Add to cart error:", error);

    if (error.message.includes("invalid")) {
      toast.error("Item validation failed. Please try again.");
    } else if (error.message.includes("No valid items")) {
      toast.error("Please ensure all items are properly selected");
    } else if (error.message.includes("cart")) {
      toast.error("Cart initialization failed. Please refresh and try again.");
    } else {
      toast.error("Unable to add items to cart. Please try again.");
    }
  } finally {
    dispatch({ type: "SET_Loading", payload: false });
  }
};

export const convert = (value) => {
  const typeMap = {
    PSINGLE: "1X PSINGLE",
    PDOUBLE: "2x PSINGLE",
    PTRIPLE: "3X PSINGLE ",
    PQUAD: "4x PSINGLE ",
    PTRIPLE_L: "3X_L PSINGLE ",
    PQUAD_L: "4X_L PSINGLE ",
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
    PositionX,
    PositionZ,
    levels,
    cumulativeHeight,
    platformsPerLevel,
    selectedPart,
    selectedPartZ,
    drop_down,
    levelIndex,
    lineItem,
    descripation,
    platformName,
    selectedLength,
    performingExport,
  } = state;

  if (!selectedType) {
    toast.error("Please select base model and type before adding levels.");
    return;
  }
  if (performingExport) {
    toast.error(
      "Please wait for the export to finish before adding more levels."
    );
    return;
  }
  dispatch({ type: "SET_LOADING" });

  const updatedLineItems = [...lineItem];
  const selectedBaseType = baseTypeOptions.find(
    (item) => item.value === selectedType
  );
  const variantID = selectedBaseType?.varaintID || null;

  const existingItemIndex = updatedLineItems.findIndex(
    (item) => item.variantID === variantID
  );
  if (existingItemIndex !== -1) {
    updatedLineItems[existingItemIndex].quantity += 1;
    const Position = platformName
      ? platformName
      : `${selectedType} Platform No 01`;
    // Spread the existing descripation to create a new object
    updatedLineItems[existingItemIndex].description = {
      ...updatedLineItems[existingItemIndex].description,
      [`drop_down_level_${state.drop_down}`]: `${convert(
        selectedType
      )} Storage Platform ${selectedLength} INCH Drop Down, added below ${Position}`,
    };
  } else if (variantID) {
    const Position = platformName
      ? platformName
      : `${selectedType} Platform No 01`;
    updatedLineItems.push({
      variantID,
      quantity: 1,
      description: {
        [`drop_down_level_${state.drop_down}`]: `${convert(
          selectedType
        )} Storage Platform ${selectedLength} INCH Drop Down, added below ${Position}`,
      },
    });
  }
  dispatch({ type: "SET_LINEITEM", payload: updatedLineItems });
  // Generate levels
  const newModelLevels = createModelFromPSingle(state, dispatch);
  let newLevels = [...levels];
  let newCumulativeHeight = cumulativeHeight;

  const previousPositionX =
    PositionX.length !== 0 ? PositionX[PositionX.length - 1] : 0;
  const newPositionX = Number(previousPositionX) + Number(selectedPart);
  // console.log(newPositionX);
  const previousPositionZ =
    PositionZ.length !== 0 ? PositionZ[PositionZ.length - 1] : 0;
  // console.log(previousPositionZ);
  const newPositionZ = Number(previousPositionZ) + Number(selectedPartZ);
  // console.log(selectedPartZ);
  const newX = PositionX;
  const newZ = PositionZ;
  newZ.push(newPositionZ);
  newX.push(newPositionX);
  dispatch({ type: "SET_POSITION_Z", payload: newZ });
  dispatch({ type: "SET_POSITION_X", payload: newX });
  for (const modelLevel of newModelLevels) {
    for (let j = 0; j < platformsPerLevel; j++) {
      const newPosition = [
        newPositionX,
        -newCumulativeHeight - modelLevel.height,
        0,
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
  const Position = platformName ? platformName : selectedType;
  const updatedDescription = {
    [`drop_down_level_${state.drop_down}`]: `${convert(
      selectedType
    )} Storage Platform ${selectedLength} INCH Drop Down, added below ${Position}`,
  };
  // console.log(updatedDescription);
  dispatch({ type: "SET_DESCRIPTION", payload: updatedDescription });
  dispatch({ type: "SET_POSITION_X", payload: [...PositionX, newPositionX] });
  dispatch({ type: "SET_POSITION_Z", payload: [...PositionZ, newPositionZ] });
  dispatch({ type: "SET_LEVELS", payload: newLevels });
  dispatch({
    type: "SET_CUMULATIVE_HEIGHT",
    payload: newCumulativeHeight + newModelLevels[0].height,
  });

  dispatch({ type: "SET_DROP_DOWN", payload: drop_down + 1 });
  dispatch({ type: "SET_LEVEL_INDEX", payload: levelIndex + 1 });
  dispatch({ type: "SET_SELECTED_PART", payload: 0 });
  dispatch({ type: "SET_SELECTED_PART_Z", payload: 0 });
  dispatch({ type: "PLATFROM_NAME", payload: "" });
  dispatch({ type: "SET_LOADING" });

  toast.success(`${selectedType} platform(s) added to the model`);
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
    type,
    levelIndex,
    PositionX,
    PositionZ,
    lineItem,
    performingExport,
  } = state;

  // Check if there are levels to remove; if not, show an error toast
  if (levels.length === 0) {
    toast.error("No levels to remove");
    return;
  }
  if (performingExport) {
    toast.error("Please wait for the export to finish before removing levels.");
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
        const new_descripation = (newLineItems[index] = {
          ...newLineItems[index],
          quantity: newLineItems[index].quantity - 1,
          description:
            delete newLineItems[index].description[
              `drop_down_level_${drop_down - 1}`
            ],
        });
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
  dispatch({ type: "SET_CART", payload: false });
  dispatch({ type: "RESET_ALL" });

  toast.info("Reset all settings to default");
};
