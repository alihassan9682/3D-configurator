import {
  heroReducer,
  initialState,
  addLevel,
  toggleView,
  resetAll,
  removeLevel,
  handleBaseTypeChange,
  addToCart,
  // actions,
} from "./HeroReducer";
import ModelViewer from "./exporterForAR";
import ARView from "./ARView";
import logo from "../../assets/logos/dura.webp";
import { TbAugmentedReality, TbView360Number } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCartFlatbed } from "react-icons/fa6";
import { GrPowerReset } from "react-icons/gr";
import { MdAddCircleOutline } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import Client from "shopify-buy";
import { MdRotate90DegreesCw } from "react-icons/md";

import {
  actualHeights,
  levelUrls,
  baseTypeOptions,
  conditionalOptions,
  priceMap
} from "./constants";
export {
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
  Client,
  actualHeights,
  levelUrls,
  baseTypeOptions,
  conditionalOptions,
  heroReducer,
  initialState,
  addLevel,
  toggleView,
  resetAll,
  removeLevel,
  handleBaseTypeChange,
  addToCart,
  MdRotate90DegreesCw,
  priceMap
  // actions,
};