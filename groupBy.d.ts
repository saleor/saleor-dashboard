/*
  This file is a workaround to fix the type error when using the `groupBy` method.
  The `groupBy` method is not available in the `ObjectConstructor` interface in Typescript < 5.4.

  TODO: Remove this file when we upgrade to Typescript >= 5.4.
*/

interface ObjectConstructor {
  groupBy<K extends PropertyKey, T>(
    items: Iterable<T>,
    keySelector: (item: T, index: number) => K,
  ): Partial<Record<K, T[]>>;
}

interface MapConstructor {
  groupBy<K, T>(items: Iterable<T>, keySelector: (item: T, index: number) => K): Map<K, T[]>;
}
