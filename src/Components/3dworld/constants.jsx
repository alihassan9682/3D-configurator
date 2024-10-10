import PS6 from "../../assets/GLBs/PSINGLE/PS6.glb";
import PS12 from "../../assets/GLBs/PSINGLE/PS12.glb";
import PS24 from "../../assets/GLBs/PSINGLE/PS24.glb";
import PD6 from "../../assets/GLBs/PDOUBLE/PD6.glb";
import PD12 from "../../assets/GLBs/PDOUBLE/PD12.glb";
import PD24 from "../../assets/GLBs/PDOUBLE/PD24.glb";
import PT6 from "../../assets/GLBs/PTRIPLE/PT6.glb";
import PT12 from "../../assets/GLBs/PTRIPLE/PT12.glb";
import PT24 from "../../assets/GLBs/PTRIPLE/PT24.glb";
import PTL6 from "../../assets/GLBs/PTRIPLEL/PTL6.glb";
import PTL12 from "../../assets/GLBs/PTRIPLEL/PTL12.glb";
import PTL24 from "../../assets/GLBs/PTRIPLEL/PTL24.glb";
import PQ6 from "../../assets/GLBs/PQUAD/PQ6.glb";
import PQ12 from "../../assets/GLBs/PQUAD/PQ12.glb";
import PQ24 from "../../assets/GLBs/PQUAD/PQ24.glb";
import PQL6 from "../../assets/GLBs/PQUADL/PQL6.glb";
import PQL12 from "../../assets/GLBs/PQUADL/PQL12.glb";
import PQL24 from "../../assets/GLBs/PQUADL/PQL24.glb";


export const actualHeights = {
  6: 6,
  12: 12,
  24: 24,
};
export const priceMap = {
  PSINGLE: { 24: 97.94, 12: 80.94, 6: 70.94 },
  PDOUBLE: { 24: 195.94, 12: 180.94, 6: 170.94 },
  PTRIPLE: { 24: 190.89, 12: 240.46, 6: 230.46 },
  PTRIPLE_L: { 24: 240.54, 12: 257.58, 6: 257.58 },
  PQUAD: { 24: 351.35, 12: 351.35, 6: 250.56 },
  PQUAD_L: { 24: 376.86, 12: 351.35, 6: 351.35 },
};

export const levelUrls = {
  PSINGLE: {
    6: PS6,
    12: PS12,
    24: PS24,
  },
  PDOUBLE: {
    6: PD6,
    12: PD12,
    24: PD24,
  },
  PTRIPLE: {
    6: PT6,
    12: PT12,
    24: PT24,
  },
  PTRIPLE_L: {
    6: PTL6,
    12: PTL12,
    24: PTL24,
  },
  PQUAD: {
    6: PQ6,
    12: PQ12,
    24: PQ24,
  },
  PQUAD_L: {
    6: PQL6,
    12: PQL12,
    24: PQL24,
  },
};


export const baseTypeOptions = [
  {
    id: 1,
    value: "",
    label: "Select Base Type",
  },
  {
    id: 2,
    value: "PSINGLE",
    label: "PSINGLE",
  },
  {
    id: 8542404804827,
    value: "PDOUBLE",
    label: "PDOUBLE",
    varaintID: 45649839292635,
    price: 195.94,
  },
  {
    id: 8542545903835,
    value: "PTRIPLE",
    label: "PTRIPLE",
    varaintID: 45650105696475,
    price: 251.46,
  },
  {
    id: 8542553833691,
    value: "PTRIPLE_L",
    label: "PTRIPLE_L",
    varaintID: 45650119459035,
    price: 257.85,
  },
  {
    id: 8651522113755,
    value: "PQUAD",
    label: "PQUAD",
    varaintID: 45920037339355,
    price: 357.68,
  },
  {
    id: 8652301172955,
    value: "PQUAD_L",
    label: "PQUAD_L",
    varaintID: 45922991538395,
    price: 365.72,
  },
];


export const conditionalOptions = {
  PSINGLE: [{ value: "PSINGLE", label: "1" }],
  PDOUBLE: [
    { value: "PSINGLE", label: "1" },
    { value: "PDOUBLE", label: "2" },
  ],
  PTRIPLE: [
    { value: "PSINGLE", label: "1" },
    { value: "PDOUBLE", label: "2" },
    { value: "PTRIPLE", label: "3" },
  ],
  PTRIPLE_L: [
    { value: "PSINGLE", label: "1" },
    { value: "PDOUBLE", label: "2" },
    { value: "PTRIPLE", label: "3" },
    { value: "PTRIPLE_L", label: "3L" },
  ],
  PQUAD: [
    { value: "PSINGLE", label: "1" },
    { value: "PDOUBLE", label: "2" },
    { value: "PTRIPLE", label: "3" },
    { value: "PTRIPLE_L", label: "3L" },
    { value: "PQUAD", label: "4" },
  ],
  PQUAD_L: [
    { value: "PSINGLE", label: "1" },
    { value: "PDOUBLE", label: "2" },
    { value: "PTRIPLE", label: "3" },
    { value: "PTRIPLE_L", label: "3L" },
    { value: "PQUAD", label: "4" },
    { value: "PQUAD_L", label: "4L" },
  ],
};
