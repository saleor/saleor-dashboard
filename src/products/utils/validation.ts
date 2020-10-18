export const validatePrice = (price: string | number) =>
  price === "" ||
  price === null ||
  (typeof price === "string" ? parseInt(price, 10) : price) < 0;

export const validateCostPrice = (price: string | number) =>
  (typeof price === "string" && price !== "" ? parseInt(price, 10) : price) < 0;
