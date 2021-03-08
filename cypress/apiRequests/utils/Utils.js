export const getValueWithDefault = (condition, value, defaultValue = "") =>
  condition ? value : defaultValue;
