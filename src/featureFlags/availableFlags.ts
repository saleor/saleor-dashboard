import { FlagContent } from "./FlagContent";

interface FlagDefinition {
  name: string;
  displayName: string;
  description: string;
  content: {
    enabled: boolean;
    value?: string;
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
    name: "flag1",
    displayName: "Flag 1",
    description: "some description",
    content: { enabled: false, value: "default" },
  } as const,
] satisfies FlagDefinition[];

type TypedEntry = (typeof AVAILABLE_FLAGS)[number];

export type Entry = TypedEntry extends never ? FlagDefinition : TypedEntry;
export type Name = TypedEntry extends never ? string : TypedEntry["name"];
export type FlagList = Name extends never
  ? Record<string, FlagContent>
  : Record<Name, FlagContent>;

const toFlagContent = (p: FlagList, c: Entry) => {
  p[c.name] = new FlagContent(c.content.enabled, c.content.value);
  return p;
};

export const isSupported = (name: string): name is Name =>
  AVAILABLE_FLAGS.some(
    (e: FlagDefinition) => e.name === name || `FF_${e.name}` === name,
  );

export const asFlagContent = () =>
  AVAILABLE_FLAGS.reduce(toFlagContent, {} as FlagList);

export const asFlagInfoArray = (list: FlagList) =>
  AVAILABLE_FLAGS.map((el: Entry) => ({
    ...el,
    content: list[el.name],
  }));
