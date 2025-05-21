export enum ProductMaterialEnum {
  COTTON = "COTTON",
  POLYESTER = "POLYESTER",
  WOOL = "WOOL",
  NYLON = "NYLON",
}

export type ProductMaterialsComposition = Partial<Record<ProductMaterialEnum, string>>;

export enum ProductMaterialErrorCode {
  NO_MATERIAL_PROVIDED = "NO_MATERIAL_PROVIDED",
  INVALID_PERCENTAGE = "INVALID_PERCENTAGE",
  EMPTY_PERCENTAGE_VALUE = "EMPTY_PERCENTAGE_VALUE",
}

export type ProductMaterialError = {
  __typename: "ProductMaterialError";
  code: ProductMaterialErrorCode;
  field: string;
  message: string;
};
