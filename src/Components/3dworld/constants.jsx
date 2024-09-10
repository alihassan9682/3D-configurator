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
  { value: "", label: "Select Base Type" },
  { value: "PSINGLE", label: "PSINGLE" },
  { value: "PDOUBLE", label: "PDOUBLE" },
  { value: "PTRIPLE", label: "PTRIPLE" },
  { value: "PTRIPLE_L", label: "PTRIPLE_L" },
  { value: "PQUAD", label: "PQUAD" },
  { value: "PQUAD_L", label: "PQUAD_L" },
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
