import { OrderLineFragment } from "@dashboard/graphql";
import { FormsetData } from "@dashboard/hooks/useFormset";

import { LineItemData } from "../components/OrderReturnPage/form";
import { getItemPriceAndQuantity } from "./data";

const mockedOrderLines = [
  {
    unitPrice: {
      __typename: "TaxedMoney",
      gross: {
        __typename: "Money",
        amount: 10.5,
        currency: "EUR",
      },
      net: {
        __typename: "Money",
        amount: 10.5,
        currency: "EUR",
      },
    },
  },
] as unknown as Array<OrderLineFragment & { orderLineId?: string }>;
const mockedItemQuantities: FormsetData<LineItemData, number> = [
  {
    data: {
      isFulfillment: true,
      isRefunded: false,
      orderLineId: "T3JkZXJMaW5lOmZjNzRlNDliLWQyNTItNDVhYS1hMWU0LWQ2MGU5MzFiNjNlOA==",
    },
    id: "RnVsZmlsbG1lbnRMaW5lOjU1Ng==",
    label: "",
    value: 1,
  },
  {
    data: {
      isFulfillment: true,
      isRefunded: false,
      orderLineId: "T3JkZXJMaW5lOmZjNzRlNDliLWQyNTItNDVhYS1hMWU0LWQ2MGU5MzFiNjNlOA==",
    },
    id: "RnVsZmlsbG1lbnRMaW5lOjU1Nw==",
    label: "",
    value: 0,
  },
];

describe("getItemPriceAndQuantity", () => {
  it("returns undefined unitPrice when ID is not found", () => {
    // Arrange
    const orderLines = mockedOrderLines;
    const itemsQuantities = mockedItemQuantities;
    const id = "RnVsZmlsbG1lbnRMaW5lOjU1Ng==";
    // Act
    const result = getItemPriceAndQuantity({ orderLines, itemsQuantities, id });
    // Assert
    expect(result).toEqual({
      selectedQuantity: 1,
      unitPrice: undefined,
    });
  });
});
