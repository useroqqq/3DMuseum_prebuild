export interface Exhibit {
  id: string;
  title: string;
  detailedDescription?: string;
  photos: string[];
  position: { top: string; left: string };
  position3D: [number, number, number];
  isGroup?: boolean;
  groupItems?: { id: string; title: string; photo: string }[];
  isHidden?: boolean;
  parentId?: string;
}

export const exhibits: Record<string, Exhibit> = {
  "1": {
    id: "1",
    title: "Стереокомпаратор",
    photos: [
      "./images/1_1.jpg",
      "./images/1_2.jpg",
      "./images/1_3.jpg"
    ],
    position: { top: "60%", left: "20%" },
    position3D: [-2.8, 0.2, 2.8],
  },
  "2": {
    id: "2",
    title: "Стереопроектор СПР-2",
    photos: [
      "./images/2_1.jpg",
      "./images/2_2.jpg",
      "./images/2_3.jpg",
      "./images/2_4.jpg"
    ],
    position: { top: "35%", left: "25%" },
    position3D: [-1.7, 0.5, 2.8],
  },
  "3": {
    id: "3",
    title: "Фототрансформатор ФТМ",
    photos: [
      "./images/3_1.jpg",
      "./images/3_2.jpg",
	  "./images/3_3.jpg"
    ],
    position: { top: "50%", left: "40%" },
    position3D: [-0.4, 0.9, 2.8],
  },
  "4": {
    id: "4",
    title: "VisionMap A3",
    photos: [
      "./images/4_1.jpg",
      "./images/4_2.jpg"
    ],
    position: { top: "70%", left: "30%" },
    position3D: [1.8, 0.3, 3.4],
  },
  "5": {
    id: "5",
    title: "Стереометрическая камера Carl Zeiss Jena SMK 40",
    photos: [
      "./images/5_1.jpg",
      "./images/5_2.jpg"
    ],
    position: { top: "70%", left: "30%" },
    position3D: [2.5, 0.7, 3.4],
  },
  "6": {
    id: "6",
    title: "Стереометрическая камера Carl Zeiss SMK 120",
    photos: [
      "./images/6_1.jpg",
      "./images/6_2.jpg"
    ],
    position: { top: "30%", left: "30%" },
    position3D: [2.25, 1.8, 3.3],
  },
  "7": {
    id: "7",
    title: "Leica SD2000",
    photos: [
      "./images/7_1.jpg",
      "./images/7_2.jpg",
	  "./images/7_3.jpg",
	  "./images/7_4.jpg"
    ],
    position: { top: "45%", left: "85%" },
    position3D: [3.4, 0.5, 2.0],
  },
  "8": {
    id: "8",
    title: "Цифровой аэрофотоаппарат АФА-6/90",
    photos: [
      "./images/8_1.jpg",
      "./images/8_2.jpg"
    ],
    position: { top: "20%", left: "80%" },
    position3D: [2.7, 0.7, 0.7],
  },
  "9": {
    id: "9",
    title: "Зеркально-линзовый стереоскоп с параллаксометром",
    photos: [
      "./images/9_1.jpg",
      "./images/9_2.jpg"
    ],
    position: { top: "40%", left: "60%" },
    position3D: [-0.1, 0.1, 0.4],
  },
  "10": {
    id: "10",
    title: "Стереометр топографический Ф.В.Дробышева СТД-2",
    photos: [
      "./images/10_1.jpg",
      "./images/10_2.jpg",
	  "./images/10_3.jpg",
	  "./images/10_4.jpg"
    ],
    position: { top: "65%", left: "75%" },
    position3D: [-1.9, 0, 0],
  },
  "complex": {
    id: "complex",
    title: "Комплекс приборов",
    photos: ["./images/10_1.jpg"],
    position: { top: "45%", left: "85%" },
    position3D: [-1.2, 0.6, -3.2],
    isGroup: true,
    groupItems: [
      { id: "11", title: "LMK 2000", photo: "./images/11_1.jpg" },
      { id: "12", title: "UMK 10/1318", photo: "./images/12_1.jpg" },
      { id: "13", title: "Rollei 35 Metric", photo: "./images/13_1.jpg" },
      { id: "14", title: "Фототеодолит", photo: "./images/14_1.jpg" }
    ]
  },
  "11": {
    id: "11",
    title: "LMK 2000",
    photos: [
		"./images/11_1.jpg",
		"./images/11_2.jpg",
		"./images/11_3.jpg"
	],
    position: { top: "0%", left: "0%" },
    position3D: [0, 0, 0],
    isHidden: true,
    parentId: "complex",
  },
  "12": {
    id: "12",
    title: "UMK 10/1318",
    photos: [
		"./images/12_1.jpg",
		"./images/12_2.jpg",
		"./images/12_3.jpg"
	],
    position: { top: "0%", left: "0%" },
    position3D: [0, 0, 0],
    isHidden: true,
    parentId: "complex",
  },
  "13": {
    id: "13",
    title: "Rollei 35 Metric",
    photos: ["./images/13_1.jpg"],
    position: { top: "0%", left: "0%" },
    position3D: [0, 0, 0],
    isHidden: true,
    parentId: "complex",
  },
  "14": {
    id: "14",
    title: "Фототеодолит R. LECHNER",
    photos: [
		"./images/14_1.jpg",
		"./images/14_2.jpg",
		"./images/14_3.jpg"
	],
    position: { top: "0%", left: "0%" },
    position3D: [0, 0, 0],
    isHidden: true,
    parentId: "complex",
  },
  "15": {
    id: "15",
    title: "Цифровая фотограмметрическая станция",
    photos: [
      "./images/15_1.jpg",
      "./images/15_2.jpg",
	  "./images/15_3.jpg"
    ],
    position: { top: "70%", left: "30%" },
    position3D: [-4.0, 0.2, -1.9],
  },
  "16": {
    id: "16",
    title: "Стекометр",
    photos: [
      "./images/16_1.jpg",
      "./images/16_2.jpg",
	  "./images/16_3.jpg",
	  "./images/16_4.jpg"
    ],
    position: { top: "80%", left: "50%" },
    position3D: [-4.0, 0.2, -0.2],
  }
};
