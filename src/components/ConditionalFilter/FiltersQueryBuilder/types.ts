export enum QueryApiType {
  WHERE = "where",
  FILTER = "filter",
}

export type StaticQueryPart = string | boolean | Record<string, unknown>;
