import { LanguageCodeEnum } from "@saleor/graphql";
import { PaginationState } from "@saleor/hooks/usePaginator";
import { LanguageEntitiesUrlQueryParams } from "@saleor/translations/urls";

export interface TranslationsEntityListProps {
  params: LanguageEntitiesUrlQueryParams;
  variables: PaginationState & { language: LanguageCodeEnum };
}
