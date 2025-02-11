import { FilterAPIProvider } from "@dashboard/components/ConditionalFilter/API/FilterAPIProvider";
import { BooleanValuesHandler, Handler } from "@dashboard/components/ConditionalFilter/API/Handler";
import {
  FilterContainer,
  FilterElement,
} from "@dashboard/components/ConditionalFilter/FilterElement";

const getFilterElement = (value: FilterContainer, index: number): FilterElement => {
  const possibleFilterElement = value[index];

  if (typeof possibleFilterElement !== "string" && !Array.isArray(possibleFilterElement)) {
    return possibleFilterElement;
  }

  throw new Error("Unknown filter element used to create API handler");
};

const createAPIHandler = (selectedRow: FilterElement): Handler => {
  const rowType = selectedRow.rowType();

  if (
    rowType &&
    ["filterableInDashboard", "isVariantOnly", "valueRequired", "visibleInStorefront"].includes(
      rowType,
    ) &&
    rowType !== "attribute"
  ) {
    return new BooleanValuesHandler([
      {
        label: "Yes",
        value: "true",
        type: rowType,
        slug: "true",
      },
      {
        label: "No",
        value: "false",
        type: rowType,
        slug: "false",
      },
    ]);
  }

  throw new Error(`Unknown filter element: "${rowType}"`);
};

export const useAttributesFilterAPIProvider = (): FilterAPIProvider => {
  const fetchRightOptions = async (position: string, value: FilterContainer) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);

    const handler = createAPIHandler(filterElement);

    return handler.fetch();
  };

  const fetchLeftOptions = async () => {
    return [];
  };

  return {
    fetchRightOptions,
    fetchLeftOptions,
  };
};
