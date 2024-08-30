import {
  SearchCategoriesQuery,
  SearchCollectionsQuery,
  SearchPagesQuery,
} from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { MenuItemType } from "@dashboard/navigation/components/MenuItemDialog/types";
import { RelayToFlat } from "@dashboard/types";
import { Option } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface UseOptionsProps {
  collections: RelayToFlat<SearchCollectionsQuery["search"]>;
  categories: RelayToFlat<SearchCategoriesQuery["search"]>;
  pages: RelayToFlat<SearchPagesQuery["search"]>;
}

export const useOptions = ({ pages, categories, collections }: UseOptionsProps) => {
  const intl = useIntl();

  const baseOptions: Option[] = [
    {
      value: "category",
      label: intl.formatMessage(sectionNames.categories),
    },
    {
      value: "collection",
      label: intl.formatMessage(sectionNames.collections),
    },
    {
      value: "page",
      label: intl.formatMessage(sectionNames.pages),
    },
    {
      value: "link",
      label: intl.formatMessage({
        id: "H1L1cc",
        defaultMessage: "URL",
        description: "url",
      }),
    },
  ] satisfies Array<{ value: MenuItemType; label: string }>;

  const categoriesOptions = categories?.map(category => ({
    value: category.id,
    label: category.name,
  }));
  const collectionsOptions = collections?.map(collection => ({
    value: collection.id,
    label: collection.name,
  }));
  const pagesOptions = pages?.map(page => ({
    value: page.id,
    label: page.title,
  }));

  const subOptions: Record<Exclude<MenuItemType, "link">, Option[]> = {
    category: categoriesOptions ?? [],
    collection: collectionsOptions ?? [],
    page: pagesOptions ?? [],
  };

  return {
    baseOptions,
    subOptions,
  };
};
