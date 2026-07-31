import { useOrderDetailsQuery } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react";

import { useOrderDetails } from "./useOrderDetails";
import { useOrderTransactionPolling } from "./useOrderTransactionPolling";

jest.mock("@dashboard/graphql");
jest.mock("./useOrderTransactionPolling");

describe("useOrderDetails", () => {
  it("fetches order details by id without loading metadata eagerly", () => {
    // Arrange
    const mockData = { order: { id: "1", name: "Test Order" } };

    (useOrderDetailsQuery as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      refetch: jest.fn(),
      startPolling: jest.fn(),
      stopPolling: jest.fn(),
    });

    // Act
    const { result } = renderHook(() => useOrderDetails("1"));

    // Assert
    expect(useOrderDetailsQuery).toHaveBeenCalledWith({
      displayLoader: true,
      variables: { id: "1" },
    });
    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
  });

  it("does not instantiate transaction polling; it exposes query controls instead", () => {
    // Arrange
    const refetch = jest.fn();
    const startPolling = jest.fn();
    const stopPolling = jest.fn();

    (useOrderDetailsQuery as jest.Mock).mockReturnValue({
      data: { order: { id: "1" } },
      loading: false,
      refetch,
      startPolling,
      stopPolling,
    });

    // Act
    const { result } = renderHook(() => useOrderDetails("1"));

    // Assert: polling is owned by TransactionOrderDetails, not this shared hook.
    expect(useOrderTransactionPolling).not.toHaveBeenCalled();
    expect(result.current.refetch).toBe(refetch);
    expect(result.current.startPolling).toBe(startPolling);
    expect(result.current.stopPolling).toBe(stopPolling);
  });
});
