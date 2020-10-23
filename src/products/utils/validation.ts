export const validatePrice = (price: string) =>
  price === "" || parseInt(price, 10) < 0;

export const validateCostPrice = (price: string) =>
  price !== "" && parseInt(price, 10) < 0;
