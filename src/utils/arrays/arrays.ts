import difference from "lodash/difference";
import intersection from "lodash/intersection";

export const arrayDiff = (before: string[], after: string[]) => ({
  added: difference(after, before),
  removed: difference(before, after),
  common: intersection(before, after),
});
