// @ts-strict-ignore

export const getByName = (nameToCompare: string) => (obj: { name: string }) =>
  obj.name === nameToCompare;
