import { SkuSchema } from "./constants";

export const containsDot = (value: string) => value.includes(".");

export const parseSkuSchema = (skuValue: string) => SkuSchema.parse(+skuValue);
