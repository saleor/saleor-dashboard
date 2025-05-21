export enum SizePropertyEnum {
  CHEST_CIRCUMFERENCE = "CHEST_CIRCUMFERENCE",
  WAIST_CIRCUMFERENCE = "WAIST_CIRCUMFERENCE",
  HIPS_CIRCUMFERENCE = "HIPS_CIRCUMFERENCE",
  LENGTH = "LENGTH",
}

export enum ClothingSize {
  xs = "xs",
  s = "s",
  m = "m",
  l = "l",
  xl = "xl",
  xxl = "xxl",
}

export type TSizeTable = Partial<Record<ClothingSize, Record<string, number | null> | undefined>>;

export enum ProductSizeErrorCode {
  REQUIRED = "REQUIRED",
}

export type ProductSizeTableError = {
  __typename: "ProductSizeTableError";
  field: SizePropertyEnum | "size";
  code: ProductSizeErrorCode;
  size: ClothingSize;
  message: string;
};
