export function toFixed(num: string | number, fixed: number) {
  if (num === "" || num === null) {
    return "";
  }

  const re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(re)[0];
}
