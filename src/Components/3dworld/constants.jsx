export const actualHeights = {
  6: 6,
  12: 12,
  24: 24,
};

export const levelUrls = {
  PSINGLE: {
    6: "https://res.cloudinary.com/drf2qiei6/image/upload/v1736167817/PS6_hccju0.glb",
    12: "https://res.cloudinary.com/drf2qiei6/image/upload/v1736167824/PS12_pnlh44.glb",
    24: "https://res.cloudinary.com/drf2qiei6/image/upload/v1736167834/PS24_dowmsz.glb",
  },
  PDOUBLE: {
    6: "https://res.cloudinary.com/drf2qiei6/image/upload/v1736167705/PD6_ofe1e0.glb",
    12: "https://res.cloudinary.com/drf2qiei6/image/upload/v1736167767/PD12_l7mbj8.glb",
    24: "https://res.cloudinary.com/drf2qiei6/image/upload/v1736167777/PD24_fffpfn.glb",
  },
  PTRIPLE: {
    6: "https://res.cloudinary.com/drf2qiei6/image/upload/v1736168792/PT6_ivplo4.glb",
    12: "https://res.cloudinary.com/drf2qiei6/image/upload/v1736168799/PT12_nysblg.glb",
    24: "https://res.cloudinary.com/drf2qiei6/image/upload/v1736169052/PT24_izqnvs.glb",
  },
  PTRIPLE_L: {
    6: "https://res.cloudinary.com/drf2qiei6/image/upload/v1736167976/PTL6_cahog5.glb",
    12: "https://res.cloudinary.com/drf2qiei6/image/upload/v1736167991/PTL12_ikbeeg.glb",
    24: "https://res.cloudinary.com/drf2qiei6/image/upload/v1736167999/PTL24_dqwi1q.glb",
  },
  PQUAD: {
    6: "https://res.cloudinary.com/drf2qiei6/image/upload/v1736167868/PQ6_gp7bpd.glb",
    12: "https://res.cloudinary.com/drf2qiei6/image/upload/v1736167874/PQ12_zmjkjm.glb",
    24: "https://res.cloudinary.com/drf2qiei6/image/upload/v1736167887/PQ24_t4whun.glb",
  },
  PQUAD_L: {
    6: "https://res.cloudinary.com/drf2qiei6/image/upload/v1736167920/PQL6_jbkkyu.glb",
    12: "https://res.cloudinary.com/drf2qiei6/image/upload/v1736167930/PQL12_smzhu5.glb",
    24: "https://res.cloudinary.com/drf2qiei6/image/upload/v1736167938/PQL24_a6k8vf.glb",
  },
};
export const baseTypeOptions = [
  {
    id: 8699606597851,
    value: "PSINGLE",
    label: "PSINGLE",
    varaintID: 46073618464987,
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
    { value: "PQUAD_L", label: "4L" },
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
