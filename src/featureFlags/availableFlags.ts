import { FlagContent } from "./FlagContent";

const AVAILABLE_FLAGS = [
  {
    name: "flag1",
    displayName: "Flag 1",
    description: "some description",
    content: { enabled: false, value: "default" },
  },
  {
    name: "flag2",
    displayName: "Flag 2",
    description: "some description",
    content: { enabled: false, value: "" },
  },
] as const;

export type Entry = (typeof AVAILABLE_FLAGS)[number];
export type Name = Entry["name"];
export type FlagList = Record<Name, FlagContent>;

const toFlagContent = (p: FlagList, c: Entry) => {
  p[c.name] = new FlagContent(c.content.enabled, c.content.value);
  return p;
};

export const asFlagContent = () =>
  AVAILABLE_FLAGS.reduce(toFlagContent, {} as FlagList);

export const asFlagInfoArray = (list: FlagList) =>
  AVAILABLE_FLAGS.map(el => ({
    ...el,
    content: list[el.name],
  }));
