/** Function used to check for exhaustiveness and to ignore "unused variable" error

@example For usage example see:
src/orders/components/OrderGrantRefundPage/reducer.ts
*/
export function exhaustiveCheck(x: never) {
  return x;
}

export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

type Truthy<T> = T extends false | "" | 0 | null | undefined ? never : T; // from lodash

export function truthy<T>(value: T): value is Truthy<T> {
  return !!value;
}
