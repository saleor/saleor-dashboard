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
              pspReference: "psp1",
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
              pspReference: "psp1",
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

  it("groups events by pspReference and takes the latest status", () => {
    // Arrange
    const intl = intlMock;
    const order = {
      transactions: [
        {
          events: [
            {
              id: "1",
              type: "REFUND_REQUEST",
              amount: 100,
              createdAt: "2022-08-22T10:40:22.226875+00:00",
              createdBy: {
                __typename: "User",
                email: "john.doe@example.com",
              },
              pspReference: "psp1",
            },
            {
              id: "2",
              type: "REFUND_SUCCESS",
              amount: 100,
              createdAt: "2022-08-23T10:40:22.226875+00:00",
              createdBy: {
                __typename: "User",
                email: "jane.doe@example.com",
              },
              pspReference: "psp1",
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
        id: "2",
        type: "manual",
        status: "SUCCESS",
        amount: 100,
        createdAt: "2022-08-23T10:40:22.226875+00:00",
        user: {
          email: "jane.doe@example.com",
        },
        reason: "Manual refund",
      },
    ]);
  });

  it("handles multiple pspReferences correctly", () => {
    // Arrange
    const intl = intlMock;
    const order = {
      transactions: [
        {
          events: [
            {
              id: "1",
              type: "REFUND_REQUEST",
              amount: 50,
              createdAt: "2022-08-22T10:40:22.226875+00:00",
              createdBy: {
                __typename: "User",
                email: "john.doe@example.com",
              },
              pspReference: "psp1",
            },
            {
              id: "2",
              type: "REFUND_SUCCESS",
              amount: 50,
              createdAt: "2022-08-23T10:40:22.226875+00:00",
              createdBy: {
                __typename: "User",
                email: "jane.doe@example.com",
              },
              pspReference: "psp1",
            },
            {
              id: "3",
              type: "REFUND_FAILURE",
              amount: 100,
              createdAt: "2022-08-22T11:40:22.226875+00:00",
              createdBy: {
                __typename: "User",
                email: "john.doe@example.com",
              },
              pspReference: "psp2",
            },
            {
              id: "4",
              type: "REFUND_REQUEST",
              amount: 100,
              createdAt: "2022-08-23T12:40:22.226875+00:00",
              createdBy: {
                __typename: "User",
                email: "jane.doe@example.com",
              },
              pspReference: "psp2",
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
        id: "2",
        type: "manual",
        status: "SUCCESS",
        amount: 50,
        createdAt: "2022-08-23T10:40:22.226875+00:00",
        user: {
          email: "jane.doe@example.com",
        },
        reason: "Manual refund",
      },
      {
        id: "4",
        type: "manual",
        status: "PENDING",
        amount: 100,
        createdAt: "2022-08-23T12:40:22.226875+00:00",
        user: {
          email: "jane.doe@example.com",
        },
        reason: "Manual refund",
      },
    ]);
  });
  it("uses createdBy from previous event if latest event has no createdBy", () => {
    // Arrange
    const intl = intlMock;
    const order = {
      transactions: [
        {
          events: [
            {
              id: "1",
              type: "REFUND_REQUEST",
              amount: 100,
              createdAt: "2022-08-22T10:40:22.226875+00:00",
              createdBy: {
                __typename: "User",
                email: "john.doe@example.com",
              },
              pspReference: "psp1",
            },
            {
              id: "2",
              type: "REFUND_FAILURE",
              amount: 100,
              createdAt: "2022-08-23T10:40:22.226875+00:00",
              createdBy: null,
              pspReference: "psp1",
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
        id: "2",
        type: "manual",
        status: "FAILURE",
        amount: 100,
        createdAt: "2022-08-23T10:40:22.226875+00:00",
        user: {
          email: "john.doe@example.com",
        },
        reason: "Manual refund",
      },
    ]);
  });
});
