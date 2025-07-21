export function toFixed(num: string | number, fixed: number): string {
  if (num === "" || num === null) {
    return "";
  }

  const re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  const matches = num.toString().match(re);

  return matches && matches.length > 0 ? matches[0] : "";
}
