export interface Flag {
  value: string | number | boolean;
  enabled: boolean;
}

export type FlagsResults<T extends readonly string[]> = {
  [Key in T[number]]: Flag;
};
