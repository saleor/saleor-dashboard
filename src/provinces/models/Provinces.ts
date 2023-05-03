export default interface IProvinces {
  id: string;
  name: string;
  priority: string;
  cities: ICities[];
}

export interface ICities {
  id: string;
  provinceId: string;
  name: string;
  priority: string;
}
