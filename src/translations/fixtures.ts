import { LanguageCodeEnum, LanguageFragment } from "@dashboard/graphql";

export const languages: LanguageFragment[] = [
  {
    __typename: "LanguageDisplay",
    code: LanguageCodeEnum.DE,
    language: "niemiecki",
  },
  {
    __typename: "LanguageDisplay",
    code: LanguageCodeEnum.EN,
    language: "angielski",
  },
  {
    __typename: "LanguageDisplay",
    code: LanguageCodeEnum.ES,
    language: "hiszpański",
  },
  {
    __typename: "LanguageDisplay",
    code: LanguageCodeEnum.PL,
    language: "polski",
  },
];
