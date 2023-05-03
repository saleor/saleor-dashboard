import IProvinces from "@dashboard/provinces/models/Provinces";

const provinceList: IProvinces[] = [
  {
    id: 1,
    name: "تهران",
    priority: "1",
    cities: [
      { id: "111", provinceId: 1, name: "شهریار", priority: "1" },
      { id: "222", provinceId: 1, name: "ری", priority: "2" },
    ],
  },
  {
    id: 2,
    name: "اصفهان",
    priority: "1",
    cities: [
      { id: "111", provinceId: 2, name: "شهرضا", priority: "1" },
      { id: "222", provinceId: 2, name: "نجف آباد", priority: "2" },
    ],
  },
  {
    id: 3,
    name: "یزد",
    priority: "1",
    cities: [
      { id: "111", provinceId: 3, name: "میبد", priority: "1" },
      { id: "222", provinceId: 3, name: "تفت", priority: "2" },
    ],
  },
  {
    id: 4,
    name: "فارس",
    priority: "1",
    cities: [
      { id: "111", provinceId: 4, name: "فسا", priority: "1" },
      { id: "222", provinceId: 4, name: "شیراز", priority: "2" },
    ],
  },
];

export default provinceList;
