export const getSeparatorWidth = (paddingValue: string) =>
  // Separator should cover the whole width of the container,
  // as the container has padding we have to add it to the width
  // because container is moved to the left by the padding value
  `calc(100% + ${paddingValue})`;
