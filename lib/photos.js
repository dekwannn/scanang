// Foto dari Unsplash (Unsplash License: gratis dipakai, atribusi dianjurkan).
// Di-hotlink dari images.unsplash.com sesuai pedoman Unsplash.
const P = {
  tanahLot: {
    id: "photo-1766854269605-bd06cb72217e",
    alt: "Tanah Lot temple on a rock in the sea at sunset",
    page: "https://unsplash.com/photos/OQRkj2erTPI",
  },
  canang: {
    id: "photo-1542897903-c9e9a8a0fd48",
    alt: "Two canang sari offerings on a stone step",
    page: "https://unsplash.com/photos/MdYpe6abOWI",
  },
  flowers: {
    id: "photo-1565970141239-7836886ade57",
    alt: "Offerings full of colourful flowers",
    page: "https://unsplash.com/photos/JCWt72QbGo4",
  },
  procession: {
    id: "photo-1542897730-cc0c1dd8b73b",
    alt: "Women carrying offerings on their heads during a ceremony",
    page: "https://unsplash.com/photos/vqR8ejL6Oe8",
  },
  parade: {
    id: "photo-1542897643-cfccd88c7127",
    alt: "A ceremonial procession on a village street",
    page: "https://unsplash.com/photos/QZaYfCbnjig",
  },
  prayer: {
    id: "photo-1631813991050-477dc7f7e2f6",
    alt: "A Balinese woman praying with a flower in her hair",
    page: "https://unsplash.com/photos/fbEaAix6Yus",
  },
  penjor: {
    id: "photo-1745739193800-5348719b9eb8",
    alt: "A penjor bamboo pole decorated against a blue sky",
    page: "https://unsplash.com/photos/UedhHG8qBKs",
  },
  gate: {
    id: "photo-1546661869-9fcc17ef46aa",
    alt: "A split temple gate (candi bentar) under white clouds",
    page: "https://unsplash.com/photos/dHGqv8ftwLM",
  },
  whiteCeremony: {
    id: "photo-1609130787305-826ad0e60af7",
    alt: "Worshippers dressed in white at a temple ceremony",
    page: "https://unsplash.com/photos/xQAifvvQaJI",
  },
  lakeTemple: {
    id: "photo-1524675053444-52c3ca294ad2",
    alt: "Multi-tiered meru shrine on the shore of a lake",
    page: "https://unsplash.com/photos/ioJVccFmWxE",
  },
  barong: {
    id: "photo-1773563009056-d7b3f33588f7",
    alt: "A Barong costume during a festival",
    page: "https://unsplash.com/photos/KnMLTIPhUAM",
  },
  templeDoor: {
    id: "photo-1687563458366-65e27fad1d00",
    alt: "An ornate carved temple doorway",
    page: "https://unsplash.com/photos/CqqwM74VOyA",
  },
};

export const img = (key, w = 1200, h) =>
  `https://images.unsplash.com/${P[key].id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=75`;

export const photo = (key) => P[key];
export const PHOTOS = P;
