export const validatePrice = (price: string | number) =>
  price === "" || (typeof price === "string" ? parseInt(price, 10) : price) < 0;
