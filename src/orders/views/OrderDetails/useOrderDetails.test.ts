import { useOrderDetailsQuery } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react";

import { useOrderDetails } from "./useOrderDetails";

jest.mock("@dashboard/graphql");

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
});
