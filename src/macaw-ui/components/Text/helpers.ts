export const convertSizeToScale = (
  size: "small" | "medium" | "large" | undefined
) => {
  switch (size) {
    case "small":
      return 1;
    case "medium":
      return 2;
    case "large":
      return 3;
    default:
      return 2;
  }
};
