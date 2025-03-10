import {
  FormData,
  VoucherCreatePageTab,
} from "@dashboard/discounts/components/VoucherCreatePage/types";
import {
  CategoryWithTotalProductsFragment,
  CollectionWithTotalProductsFragment,
  CountryWithCodeFragment,
  SearchProductFragment,
} from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { useMemo } from "react";

export const useSpecificItemsAssign = ({
  data,
  onChange,
}: {
  data: {
    categories: FormData["categories"];
    collections: FormData["collections"];
    products: FormData["products"];
    countries: FormData["countries"];
  };
  onChange: (e: ChangeEvent) => void;
}) => {
  const countriesMap = useMemo(
    () =>
      data.countries.reduce(
        (allChannelsCount, country) => {
          allChannelsCount[country.code] = country;

          return allChannelsCount;
        },
        {} as Record<string, CountryWithCodeFragment>,
      ),
    [data.countries],
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
      | string
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
        selectedData = data.countries.map(country => countriesMap[country]);
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
      | string
    >,
    type: keyof VoucherCreatePageTab | "countries",
    callback?: () => void,
  ) => {
    onChange({
      target: {
        name: type,
        value: [...(data[type] ?? []), ...items],
      },
    });
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
        value: (selectedData as Array<{ id: string }>)?.filter(
          item => !selectedItems.includes(item.id),
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
