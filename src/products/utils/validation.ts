export const validatePrice = (price: string | number) =>
  price === "" ||
  price === null ||
  (typeof price === "string" ? parseInt(price, 10) : price) < 0;
