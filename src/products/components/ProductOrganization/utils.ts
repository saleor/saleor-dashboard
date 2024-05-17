export const getApproxTextWidth = (text?: string) => {
  if (!text || text.length === 0) {
    return "1rem";
  }

  if (text.length < 5) {
    return `calc(${text.length}ch + 1rem)`;
  }

  return `calc(${text.length}ch + 0.5rem)`;
};
