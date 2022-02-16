import { LanguageCodeEnum } from "@saleor/graphql";

import { ShopInfo_shop_languages } from "../components/Shop/types/ShopInfo";

export const languages: ShopInfo_shop_languages[] = [
  {
    __typename: "LanguageDisplay",
    code: LanguageCodeEnum.DE,
    language: "niemiecki"
  },
  {
    __typename: "LanguageDisplay",
    code: LanguageCodeEnum.EN,
    language: "angielski"
  },
  {
    __typename: "LanguageDisplay",
    code: LanguageCodeEnum.ES,
    language: "hiszpański"
  },
  {
    __typename: "LanguageDisplay",
    code: LanguageCodeEnum.PL,
    language: "polski"
  }
];
