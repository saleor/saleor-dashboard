export interface Flag {
  value: string;
  enabled: boolean;
}

export interface FlagWithName extends Flag {
  name: string;
}

export type FlagsResults<T extends readonly string[]> = {
  [Key in T[number]]: Flag;
};
