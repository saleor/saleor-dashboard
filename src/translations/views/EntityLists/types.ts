import { LanguageCodeEnum } from "@dashboard/graphql";
import { PaginationState } from "@dashboard/hooks/usePaginator";
import { LanguageEntitiesUrlQueryParams } from "@dashboard/translations/urls";

export interface TranslationsEntityListProps {
  params: LanguageEntitiesUrlQueryParams;
  variables: PaginationState & { language: LanguageCodeEnum };
}
