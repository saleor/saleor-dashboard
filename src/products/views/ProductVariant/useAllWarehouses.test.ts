import { ChannelPriceData } from "@dashboard/channels/utils";
import { useFetchAllWarehouses } from "@dashboard/hooks/useFetchAllWarehouse";

import { useAllWarehouses } from "./useAllWarehouses";

jest.mock("@dashboard/hooks/useFetchAllWarehouse");
describe("useAllWarehouses", () => {
  it("should skip query when no channels and return empty array", () => {
    // Arrange
    const mockedUseFetchAllWarehouses = jest.fn();
    (useFetchAllWarehouses as jest.Mock).mockImplementation(mockedUseFetchAllWarehouses);

    // Act
    const result = useAllWarehouses([]);

    // Assert
    expect(result).toEqual([]);
    expect(mockedUseFetchAllWarehouses).toHaveBeenCalledWith({
      displayLoader: true,
      skip: true,
      variables: {
        filter: {
          channels: [],
        },
        first: 100,
      },
    });
  });
  it("should run query when channels provided", () => {
    // Arrange
    const mockedUseFetchAllWarehouses = jest.fn(() => ({
      data: {
        warehouses: {
          edges: [
            {
              node: {
                id: "1",
              },
            },
          ],
        },
      },
    }));
    (useFetchAllWarehouses as jest.Mock).mockImplementation(mockedUseFetchAllWarehouses);

    // Act
    const result = useAllWarehouses([
      {
        id: "1",
      },
    ] as ChannelPriceData[]);

    // Assert
    expect(result).toEqual([{ id: "1" }]);
    expect(mockedUseFetchAllWarehouses).toHaveBeenCalledWith({
      displayLoader: true,
      skip: false,
      variables: {
        filter: {
          channels: ["1"],
        },
        first: 100,
      },
    });
  });
});
