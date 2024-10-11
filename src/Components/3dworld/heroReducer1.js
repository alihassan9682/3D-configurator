import Client from "shopify-buy";
import { actualHeights, levelUrls } from "./index";

// Improved initial state with grouped related fields
export const initialState = {
  model: {
    scale: 0.05,
    levels: [],
    cumulativeHeight: 0,
    activeView: "VR",
    model: null,
  },
  selection: {
    baseType: "",
    selectedType: "",
    selectedLength: 24,
    platformsPerLevel: 1,
    selectedPart: null,
  },
  pricing: {
    price: 0,
    initalPrice: 0,
    value: [],
  },
  ui: {
    isLoading: false,
    isInCart: false,
    drop_down: 1,
  },
  description: { base: "" },
};

const createAction = (type) => (payload) => ({ type, payload });

export const actions = {
  setBaseType: createAction("SET_BASE_TYPE"),
  setInitialPrice: createAction("SET_INITIAL_PRICE"),
  toggleCart: createAction("TOGGLE_CART"),
  setDropDown: createAction("SET_DROP_DOWN"),
  toggleLoading: createAction("TOGGLE_LOADING"),
  setPrice: createAction("SET_PRICE"),
  setValue: createAction("SET_VALUE"),
  setModel: createAction("SET_MODEL"),
  setDescription: createAction("SET_DESCRIPTION"),
  setSelectedPart: createAction("SET_SELECTED_PART"),
  setLevels: createAction("SET_LEVELS"),
  setCumulativeHeight: createAction("SET_CUMULATIVE_HEIGHT"),
  setSelectedType: createAction("SET_SELECTED_TYPE"),
  setSelectedLength: createAction("SET_SELECTED_LENGTH"),
  setPlatformsPerLevel: createAction("SET_PLATFORMS_PER_LEVEL"),
  setActiveView: createAction("SET_ACTIVE_VIEW"),
  resetAll: createAction("RESET_ALL"),
};

export const heroReducer = (state, action) => {
  switch (action.type) {
    case "SET_BASE_TYPE":
      return {
        ...state,
        selection: {
          ...state.selection,
          baseType: action.payload,
          selectedType: "",
          selectedLength: 24,
          platformsPerLevel: 1,
        },
        description: { base: action.payload },
      };
    case "SET_INITIAL_PRICE":
      return {
        ...state,
        pricing: { ...state.pricing, initalPrice: action.payload },
      };
    case "TOGGLE_CART":
      return { ...state, ui: { ...state.ui, isInCart: !state.ui.isInCart } };
    case "SET_DROP_DOWN":
      return { ...state, ui: { ...state.ui, drop_down: action.payload } };
    case "TOGGLE_LOADING":
      return { ...state, ui: { ...state.ui, isLoading: !state.ui.isLoading } };
    case "SET_PRICE":
      return { ...state, pricing: { ...state.pricing, price: action.payload } };
    case "SET_VALUE":
      return { ...state, pricing: { ...state.pricing, value: action.payload } };
    case "SET_MODEL":
      return { ...state, model: { ...state.model, model: action.payload } };
    case "SET_DESCRIPTION":
      return {
        ...state,
        description: { ...action.payload },
      };
    case "SET_SELECTED_PART":
      return {
        ...state,
        selection: { ...state.selection, selectedPart: action.payload },
      };
    case "SET_LEVELS":
      return { ...state, model: { ...state.model, levels: action.payload } };
    case "SET_CUMULATIVE_HEIGHT":
      return {
        ...state,
        model: { ...state.model, cumulativeHeight: action.payload },
      };
    case "SET_SELECTED_TYPE":
      return {
        ...state,
        selection: { ...state.selection, selectedType: action.payload },
      };
    case "SET_SELECTED_LENGTH":
      return {
        ...state,
        selection: { ...state.selection, selectedLength: action.payload },
      };
    case "SET_PLATFORMS_PER_LEVEL":
      return {
        ...state,
        selection: { ...state.selection, platformsPerLevel: action.payload },
      };
    case "SET_ACTIVE_VIEW":
      return {
        ...state,
        model: { ...state.model, activeView: action.payload },
      };
    case "RESET_ALL":
      return {
        ...initialState,
        model: { ...initialState.model, levels: action.payload },
        selection: {
          ...initialState.selection,
          baseType: state.selection.baseType,
        },
        description: { base: state.selection.baseType },
      };
    default:
      return state;
  }
};

// Helper functions (simplified and combined where possible)
export const handleBaseTypeChange = (
  newBaseType,
  state,
  dispatch,
  toast,
  levels
) => {
  if (newBaseType) {
    // const { levels, model } = state;
    const { model } = state;
    const defaultLength = 24;
    const defaultUrl = levelUrls[newBaseType][defaultLength];
    const defaultHeight = actualHeights[defaultLength] * model.scale;

    const updatedLevels =
      levels.length === 0
        ? [
            {
              id: `${Date.now()}`,
              url: defaultUrl,
              position: [0, -model.cumulativeHeight - defaultHeight, 0],
              height: defaultHeight,
            },
          ]
        : levels.map((lev, index) =>
            index === 0
              ? {
                  ...lev,
                  url: defaultUrl,
                  position: [0, -model.cumulativeHeight - defaultHeight, 0],
                  height: defaultHeight,
                }
              : lev
          );

    dispatch(actions.setLevels(updatedLevels));
    dispatch(actions.setCumulativeHeight(defaultHeight));
    dispatch(actions.setBaseType(newBaseType));
    toast.success(
      `${
        levels.length === 0 ? "Added" : "Updated"
      } base model to: ${newBaseType}`
    );
  }
};

export const toggleView = (view, dispatch) =>
  dispatch(actions.setActiveView(view));

export const addToCart = async (checkout, state, id, dispatch, setCheckout) => {
  if (!checkout || state.ui.isInCart || state.ui.isLoading) return;

  dispatch(actions.toggleLoading());

  const variantId = `gid://shopify/ProductVariant/${id}`;
  const lineItemsToAdd = [
    {
      variantId,
      quantity: 1,
      customAttributes: [
        {
          key: "Price after Customization",
          value: JSON.stringify(state.pricing.price),
        },
        {
          key: "Customization Details",
          value: JSON.stringify(state.description),
        },
      ],
    },
  ];

  const client = Client.buildClient({
    domain: "duralifthardware.com",
    storefrontAccessToken: process.env.REACT_APP_API_KEY,
  });

  try {
    const updatedCheckout = await client.checkout.addLineItems(
      checkout.id,
      lineItemsToAdd
    );
    setCheckout(updatedCheckout);
    dispatch(actions.toggleCart());
    window.location.href = updatedCheckout.webUrl;
  } catch (error) {
    console.error("Failed to add to cart:", error);
  } finally {
    dispatch(actions.toggleLoading());
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

export const updatePrice = (
  state,
  selectedType,
  selectedLength,
  price,
  dispatch
) => {
  const additionalPrice = priceMap[selectedType]?.[selectedLength] || 0;
  const updatedPrice = price + additionalPrice;
  dispatch(actions.setPrice(updatedPrice));
  dispatch(actions.setValue([...state.pricing.value, additionalPrice]));
};

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

export const addLevel = (state, dispatch, toast) => {
  const { selection, model, pricing, ui } = state;

  if (!selection.selectedType && !selection.baseType) {
    toast.error(
      "Please select both the base type and model type before adding levels."
    );
    return;
  }

  dispatch(actions.toggleLoading());
  dispatch(actions.setDropDown(ui.drop_down + 1));
  updatePrice(
    state,
    selection.selectedType,
    selection.selectedLength,
    pricing.price,
    dispatch
  );

  const newDescription = {
    [`drop_down_level_${ui.drop_down}`]: `${convert(
      selection.selectedType
    )} PSINGLE ${selection.selectedLength} INCH`,
  };
  dispatch(actions.setDescription(newDescription));

  const selectedLevelUrl =
    levelUrls[selection.selectedType][selection.selectedLength];
  const actualHeight = actualHeights[selection.selectedLength] * model.scale;

  const xPosition =
    selection.selectedPart < 1.53
      ? 0
      : selection.selectedPart < 3.06
      ? 1.53
      : selection.selectedPart < 4.59
      ? 3.06
      : selection.selectedPart < 6.13
      ? 4.59
      : 0;

  const newLevels = [...model.levels];
  let newCumulativeHeight = model.cumulativeHeight;

  for (let i = 0; i < selection.platformsPerLevel; i++) {
    const newPosition = [xPosition, -newCumulativeHeight - actualHeight, 0];
    newLevels.push({
      id: `${Date.now()}-${i}`,
      url: selectedLevelUrl,
      position: newPosition,
      height: actualHeight,
    });
    newCumulativeHeight += actualHeight;
  }

  dispatch(actions.setLevels(newLevels));
  dispatch(actions.setCumulativeHeight(newCumulativeHeight));
  dispatch(actions.toggleLoading());
  toast.success("Platform(s) added to the model");
};

export const removeLevel = (state, dispatch, toast) => {
  const { model, ui, description, pricing } = state;

  if (model.levels.length <= 1) {
    toast.error("No levels to remove");
    dispatch(actions.setPrice(pricing.initalPrice));
    return;
  }

  const lastLevel = model.levels[model.levels.length - 1];
  const newLevels = model.levels.slice(0, -1);
  const newCumulativeHeight = model.cumulativeHeight - lastLevel.height;
  const updatedDescription = { ...description };
  delete updatedDescription[`drop_down_level_${ui.drop_down}`];
  const newPrice = pricing.price - pricing.value[pricing.value.length - 1];
  const newValueArray = pricing.value.slice(0, -1);
  console.log("updatedDescription", updatedDescription);
  dispatch(actions.setLevels(newLevels));
  dispatch(actions.setCumulativeHeight(newCumulativeHeight));
  dispatch(actions.setPrice(newPrice));
  dispatch(actions.setValue(newValueArray));
  dispatch(actions.setDescription(updatedDescription));
  dispatch(actions.setDropDown(ui.drop_down - 1));

  toast.info("Removed the last level");
};

export const resetAll = (state, dispatch, toast) => {
  const newLevels = [state.model.levels[0]];
  dispatch(actions.resetAll(newLevels));
  dispatch(actions.setPrice(state.pricing.initalPrice));
  toast.info("Reset all settings to default");
};
