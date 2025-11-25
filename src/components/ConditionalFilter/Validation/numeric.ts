import { FilterElement } from "../FilterElement";

const isTooLong = (value: string, row: number) => {
  if (value.length > 25) {
    return {
      row,
      rightText: "The value is too long.",
    };
  }

  return false;
};

export const validateFilterElementToBeNumeric = (element: FilterElement, row: number) => {
  const { value } = element.condition.selected;

  if (Array.isArray(value) && value.length === 2) {
    const [sLte, sGte] = value as [string, string];
    const errorsLte = isTooLong(sLte, row);
    const errorsGte = isTooLong(sLte, row);

    if (errorsLte) return errorsGte;

    if (errorsGte) return errorsGte;

    const lte = parseFloat(sLte);
    const gte = parseFloat(sGte);

    if (lte > gte) {
      return {
        row,
        rightText: "The value must be higher",
      };
    }
  }

  if (typeof value === "string") {
    return isTooLong(value, row);
  }

  return false;
};
