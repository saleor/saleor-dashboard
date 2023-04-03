export const getSeparatorWidth = (paddingValue: string) =>
  // Separato should cover the whole width of the container,
  // as the container has padding we have to add it to the width
  // because container is move to the left by padding value
  `calc(100% + ${paddingValue})`;
