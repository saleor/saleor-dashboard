import { Row } from "./types";

export const getItemConstraint = (constraint: Row["constraint"]) => ({
  // eslint-disable-next-line @typescript-eslint/key-spacing, @typescript-eslint/no-unnecessary-boolean-literal-compare
  disableRemoveButton: constraint?.removable === false,
  disableLeftOperator: constraint?.disabled?.includes("left") ?? false,
  disableCondition: constraint?.disabled?.includes("condition") ?? false,
  disableRightOperator: constraint?.disabled?.includes("right") ?? false,
});
