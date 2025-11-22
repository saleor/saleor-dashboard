import { LanguageCodeEnum, LanguageFragment } from "@dashboard/graphql";

export const languages: LanguageFragment[] = [
  {
    __typename: "LanguageDisplay",
    code: "DE",
    language: "niemiecki",
  },
  {
    __typename: "LanguageDisplay",
    code: "EN",
    language: "angielski",
  },
  {
    __typename: "LanguageDisplay",
    code: "ES",
    language: "hiszpański",
  },
  {
    __typename: "LanguageDisplay",
    code: "PL",
    language: "polski",
  },
];
