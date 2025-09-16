import { AVAILABLE_FLAGS as GENERATED_FLAGS } from "./../../.featureFlags/generated";
import { FlagValue } from "./FlagContent";

export interface FlagDefinition {
  name: string;
  displayName: string;
  component: () => JSX.Element;
  visible: boolean;
  content: {
    enabled: boolean;
    payload?: string;
  };
}

const AVAILABLE_FLAGS = GENERATED_FLAGS;

type TypedEntry = (typeof AVAILABLE_FLAGS)[number];
type GeneralEntry = TypedEntry extends never ? FlagDefinition : TypedEntry;
export type Name = TypedEntry["name"];
export type FlagList = Record<Name, FlagValue>;
export type GeneralFlagList = TypedEntry extends never ? Record<string, FlagValue> : FlagList;

const toFlagValue = (p: GeneralFlagList, c: GeneralEntry) => {
  p[c.name] = new FlagValue(c.content.enabled, c.content.payload);

  return p;
};

export const isSupported = (name: string): name is Name =>
  AVAILABLE_FLAGS.some((e: FlagDefinition) => e.name === name || `FF_${e.name}` === name);

export const asFlagValue = () => AVAILABLE_FLAGS.reduce(toFlagValue, {} as FlagList);

export const asFlagInfoArray = (list: GeneralFlagList) =>
  AVAILABLE_FLAGS.map((el: GeneralEntry) => ({
    ...el,
    content: list[el.name],
  }));

export const flagInfoToFlagList = (flagInfos: FlagDefinition[]): FlagList => {
  return flagInfos.reduce((prev, curr) => {
    prev[curr.name as Name] = new FlagValue(curr.content.enabled, curr.content.payload);

    return prev;
  }, {} as FlagList);
};
