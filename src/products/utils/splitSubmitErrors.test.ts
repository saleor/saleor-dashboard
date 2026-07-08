import { ProductErrorCode } from "@dashboard/graphql";
import { createIntl } from "react-intl";

import {
  getProductSubmitErrorNotificationMessages,
  splitProductSubmitErrors,
} from "./splitSubmitErrors";

const intl = createIntl({ locale: "en", messages: {} });

describe("splitProductSubmitErrors", () => {
  it("splits channel listing errors from product errors", () => {
    // Arrange
    const channelError = {
      __typename: "ProductChannelListingError" as const,
      code: ProductErrorCode.PRODUCT_WITHOUT_CATEGORY,
      field: "isPublished",
      message: "Product category not set",
      channels: ["channel-1"],
    };
    const productError = {
      __typename: "ProductError" as const,
      code: ProductErrorCode.REQUIRED,
      field: "name",
      message: "Name is required",
      attributes: [],
    };

    // Act
    const result = splitProductSubmitErrors([channelError, productError]);

    // Assert
    expect(result.channelsErrors).toEqual([channelError]);
    expect(result.productErrors).toEqual([productError]);
  });

  it("keeps datagrid errors out of inline product and channel buckets", () => {
    // Arrange
    const datagridError = {
      __typename: "DatagridError" as const,
      error: ProductErrorCode.REQUIRED,
      variantId: "variant-1",
      type: "variantData" as const,
    };

    // Act
    const result = splitProductSubmitErrors([datagridError]);

    // Assert
    expect(result.productErrors).toEqual([]);
    expect(result.channelsErrors).toEqual([]);
  });
});

describe("getProductSubmitErrorNotificationMessages", () => {
  it("deduplicates toast messages and skips inline channel errors", () => {
    // Arrange
    const channelErrors = [
      {
        __typename: "ProductChannelListingError" as const,
        code: ProductErrorCode.PRODUCT_WITHOUT_CATEGORY,
        field: "isPublished",
        message: "Product category not set",
        channels: ["channel-1"],
      },
      {
        __typename: "ProductChannelListingError" as const,
        code: ProductErrorCode.PRODUCT_WITHOUT_CATEGORY,
        field: "isPublished",
        message: "Product category not set",
        channels: ["channel-2"],
      },
    ];
    const productError = {
      __typename: "ProductError" as const,
      code: ProductErrorCode.REQUIRED,
      field: "name",
      message: "Name is required",
      attributes: [],
    };

    // Act
    const messages = getProductSubmitErrorNotificationMessages(
      [...channelErrors, productError],
      intl,
    );

    // Assert
    expect(messages).toHaveLength(1);
    expect(messages[0]).toBeTruthy();
  });
});
