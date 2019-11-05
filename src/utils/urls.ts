import { stringify } from "qs";

export function stringifyQs(params: object): string {
  return stringify(params, {
    indices: false
  });
}
