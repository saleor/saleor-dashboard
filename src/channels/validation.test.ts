import {
  AllocationStrategyEnum,
  ChannelErrorCode,
  CountryCode,
  MarkAsPaidStrategyEnum,
  TransactionFlowStrategyEnum,
} from "@dashboard/graphql";

import { FormData } from "./components/ChannelForm";
import { validateChannelFormData } from "./validation";

describe("validateChannelFormData", () => {
  const validFormData: FormData = {
    name: "Test Channel",
    slug: "test-channel",
    currencyCode: "USD",
    defaultCountry: CountryCode.US,
    allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    shippingZonesIdsToAdd: [],
    shippingZonesIdsToRemove: [],
    warehousesIdsToAdd: [],
    warehousesIdsToRemove: [],
    shippingZonesToDisplay: [],
    warehousesToDisplay: [],
    markAsPaidStrategy: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
    deleteExpiredOrdersAfter: 30,
    allowUnpaidOrders: false,
    defaultTransactionFlowStrategy: TransactionFlowStrategyEnum.AUTHORIZATION,
    automaticallyCompleteCheckouts: false,
    automaticCompletionDelay: null,
    automaticCompletionCutOffDate: "",
    automaticCompletionCutOffTime: "",
  };

  it("should return no errors when all required fields are provided", () => {
    // Arrange
    const data: FormData = validFormData;

    // Act
    const errors = validateChannelFormData(data);

    // Assert
    expect(errors).toEqual([]);
  });

  it.each<{ field: keyof FormData }>([
    {
      field: "name" as keyof FormData,
    },
    {
      field: "slug" as keyof FormData,
    },
    {
      field: "currencyCode" as keyof FormData,
    },
    {
      field: "defaultCountry" as keyof FormData,
    },
  ])("should return error when $field is missing", ({ field }) => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      [field]: "",
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({
      __typename: "ChannelError",
      code: ChannelErrorCode.REQUIRED,
      field,
      message: null,
    });
  });

  it("should return multiple errors when multiple required fields are missing", () => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      name: "",
      slug: "",
      currencyCode: "",
      defaultCountry: "" as CountryCode,
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert
    expect(errors).toHaveLength(4);
    expect(errors).toEqual(
      expect.arrayContaining([
        {
          __typename: "ChannelError",
          code: ChannelErrorCode.REQUIRED,
          field: "name",
          message: null,
        },
        {
          __typename: "ChannelError",
          code: ChannelErrorCode.REQUIRED,
          field: "slug",
          message: null,
        },
        {
          __typename: "ChannelError",
          code: ChannelErrorCode.REQUIRED,
          field: "currencyCode",
          message: null,
        },
        {
          __typename: "ChannelError",
          code: ChannelErrorCode.REQUIRED,
          field: "defaultCountry",
          message: null,
        },
      ]),
    );
  });
});
