import { FlagValue } from "./FlagContent";

interface FlagDefinition {
  name: string;
  displayName: string;
  description: string;
  content: {
    enabled: boolean;
    payload?: string;
  };
}

const AVAILABLE_FLAGS = [
  /*
  Before use any flag pleease an entry within this array,
  so the TS will infer the types, example: 

  {
    name: "flag1",
    displayName: "Flag 1",
    description: "some description",
    content: { enabled: false, value: "default" },
  } as const,
  */

  {
    name: "product_filters",
    displayName: "Product filters",
    description: "New filters on product listing page",
    content: { enabled: false, payload: "" },
  } as const,
] satisfies FlagDefinition[];

type TypedEntry = (typeof AVAILABLE_FLAGS)[number];
type GeneralEntry = TypedEntry extends never ? FlagDefinition : TypedEntry;
export type Entry = TypedEntry;
export type Name = TypedEntry["name"];
export type FlagList = Record<Name, FlagValue>;
export type GeneralFlagList = TypedEntry extends never
  ? Record<string, FlagValue>
  : FlagList;

const toFlagValue = (p: GeneralFlagList, c: GeneralEntry) => {
  p[c.name] = new FlagValue(c.content.enabled, c.content.payload);
  return p;
};

export const isSupported = (name: string): name is Name =>
  AVAILABLE_FLAGS.some(
    (e: FlagDefinition) => e.name === name || `FF_${e.name}` === name,
  );

export const asFlagValue = () =>
  AVAILABLE_FLAGS.reduce(toFlagValue, {} as FlagList);

export const asFlagInfoArray = (list: GeneralFlagList) =>
  AVAILABLE_FLAGS.map((el: GeneralEntry) => ({
    ...el,
    content: list[el.name],
  }));
