import { type LanguageCodeEnum } from "@dashboard/graphql";
import { type PaginationState } from "@dashboard/hooks/usePaginator";
import { type LanguageEntitiesUrlQueryParams } from "@dashboard/translations/urls";

export interface TranslationsEntityListProps {
  params: LanguageEntitiesUrlQueryParams;
  variables: PaginationState & { language: LanguageCodeEnum };
}
