export const getBooleanFromString = (value: string): boolean | undefined => {
  if (["true", "false"].includes(value)) {
    return value === "true" ? true : false;
  }

  return undefined;
};
