export interface Flag {
  value: string | number | boolean;
  enabled: boolean;
}

export interface FlagWithName extends Flag {
  name: string;
}

export type FlagsResults<T extends readonly string[]> = {
  [Key in T[number]]: Flag;
};
