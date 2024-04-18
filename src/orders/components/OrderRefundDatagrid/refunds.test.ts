import { OrderDetailsFragment } from "@dashboard/graphql";
import { intlMock } from "@test/intl";

import { manualRefundsExtractor } from "./refunds";

describe("manualRefundsExtractor", () => {
  it("returns undefined when order is not provided", () => {
    // Arrange
    const order = undefined;
    const intl = intlMock;

    // Act
    const result = manualRefundsExtractor(order, intl);

    // Assert
    expect(result).toBeUndefined();
  });

  it("returns empty array when transactions have no events", () => {
    // Arrange
    const intl = intlMock;
    const order = {
      transactions: [
        {
          events: [],
        },
      ],
      grantedRefunds: [],
    } as unknown as OrderDetailsFragment;

    // Act
    const result = manualRefundsExtractor(order, intl);

    // Assert
    expect(result).toEqual([]);
  });

  it("returns DatagridRefund objects for supported refund events", () => {
    // Arrange
    const intl = intlMock;
    const order = {
      transactions: [
        {
          events: [
            {
              id: "1",
              type: "REFUND_SUCCESS",
              amount: 100,
              createdAt: "2022-08-22T10:40:22.226875+00:00",
              createdBy: {
                __typename: "User",
                email: "john.doe@example.com",
              },
            },
          ],
        },
      ],
      grantedRefunds: [],
    } as unknown as OrderDetailsFragment;

    // Act
    const result = manualRefundsExtractor(order, intl);

    // Assert
    expect(result).toEqual([
      {
        id: "1",
        type: "manual",
        status: "SUCCESS",
        amount: 100,
        createdAt: "2022-08-22T10:40:22.226875+00:00",
        user: {
          email: "john.doe@example.com",
        },
        reason: "Manual refund",
      },
    ]);
  });

  it("filters out refunds that are already granted", () => {
    // Arrange
    const intl = intlMock;
    const order = {
      transactions: [
        {
          events: [
            {
              id: "1",
              type: "REFUND_SUCCESS",
              amount: 100,
              createdAt: "2022-08-22T10:40:22.226875+00:00",
              createdBy: {
                email: "john.doe@example.com",
              },
            },
          ],
        },
      ],
      grantedRefunds: [
        {
          transactionEvents: [
            {
              id: "1",
            },
          ],
        },
      ],
    } as unknown as OrderDetailsFragment;

    // Act
    const result = manualRefundsExtractor(order, intl);

    // Assert
    expect(result).toEqual([]);
  });
});
