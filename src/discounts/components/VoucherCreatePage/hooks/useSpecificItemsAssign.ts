import {
  FormData,
  VoucherCreatePageTab,
  VoucherCreateProductVariant,
} from "@dashboard/discounts/components/VoucherCreatePage/types";
import {
  CategoryWithTotalProductsFragment,
  CollectionWithTotalProductsFragment,
  CountryWithCodeFragment,
  SearchProductFragment,
} from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import uniqBy from "lodash/uniqBy";
import { useMemo } from "react";

export interface SpecificItemsData {
  categories: FormData["categories"];
  collections: FormData["collections"];
  products: FormData["products"];
  countries: FormData["countries"];
  variants: FormData["variants"];
}

export const useSpecificItemsAssign = ({
  data,
  onChange,
  countries,
}: {
  data: SpecificItemsData;
  countries: CountryWithCodeFragment[];
  onChange: (e: ChangeEvent) => void;
}) => {
  const countriesMap = useMemo(
    () =>
      countries.reduce(
        (allChannelsCount, country) => {
          allChannelsCount[country.code] = country;

          return allChannelsCount;
        },
        {} as Record<string, CountryWithCodeFragment>,
      ),
    [countries],
  );

  const handleItemUnassign = (
    id: string,
    type: VoucherCreatePageTab | "countries",
    callback?: () => void,
  ) => {
    let selectedData: Array<
      | CategoryWithTotalProductsFragment
      | CollectionWithTotalProductsFragment
      | SearchProductFragment
      | CountryWithCodeFragment
      | VoucherCreateProductVariant
    >;

    switch (type) {
      case "categories":
        selectedData = data.categories.filter(item => item.id !== id);
        break;
      case "collections":
        selectedData = data.collections.filter(item => item.id !== id);
        break;
      case "products":
        selectedData = data.products.filter(item => item.id !== id);
        break;
      case "countries":
        selectedData = data.countries.filter(item => item.code !== id);
        break;
      case "variants":
        selectedData = data.variants.filter(item => item.id !== id);
        break;
      default:
        selectedData = [];
    }

    onChange({
      target: {
        name: type,
        value: selectedData,
      },
    });

    callback?.();
  };

  const handleItemAssign = (
    items: Array<
      | CategoryWithTotalProductsFragment
      | CollectionWithTotalProductsFragment
      | SearchProductFragment
      | VoucherCreateProductVariant
      | string
    >,
    type: VoucherCreatePageTab | "countries",
    callback?: () => void,
  ) => {
    if (type === "countries") {
      const combinedData = [
        ...data.countries,
        ...(items as string[]).map(country => countriesMap[country]),
      ];

      onChange({
        target: {
          name: type,
          value: uniqBy(combinedData, "code"),
        },
      });
    } else {
      const combinedData = uniqBy([...(data[type] ?? []), ...items], "id");

      onChange({
        target: {
          name: type,
          value: combinedData,
        },
      });
    }

    callback?.();
  };

  const handleBulkUnassign = (
    type: VoucherCreatePageTab | "countries",
    selectedItems: string[],
    callback?: () => void,
  ) => {
    const selectedData = data[type];

    if (!selectedData) {
      return;
    }

    onChange({
      target: {
        name: type,
        value: (selectedData as Array<{ id: string; code?: string }>)?.filter(
          item => !selectedItems.includes(type === "countries" ? item.code! : item.id),
        ),
      },
    });

    callback?.();
  };

  return {
    assignItem: handleItemAssign,
    unassignItem: handleItemUnassign,
    bulkUnassign: handleBulkUnassign,
  };
};
