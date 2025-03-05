import { useChannelReorderWarehousesMutation, WarehouseFragment } from "@dashboard/graphql";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import { useChannelWarehousesReorder } from "./useChannelWarehouseReorder";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
}));

jest.mock("@dashboard/graphql", () => ({
  useChannelReorderWarehousesMutation: jest.fn(() => [jest.fn(), {}]),
}));
describe("channels / ChannelDetails / useChannelWarehousesReorder", () => {
  it("should handle channel warehouses reorder", async () => {
    // Arrange
    const mockedReorderWarehousesMutation = jest.fn();

    (useChannelReorderWarehousesMutation as jest.Mock).mockImplementation(() => [
      mockedReorderWarehousesMutation,
      {},
    ]);

    const channelId = "1";
    const warehouses = [
      { id: "1", name: "Warehouse 1" },
      { id: "2", name: "Warehouse 2" },
      { id: "3", name: "Warehouse 3" },
    ] as WarehouseFragment[];
    const warehousesToDisplay = [
      { id: "3", name: "Warehouse 3" },
      { id: "1", name: "Warehouse 1" },
      { id: "2", name: "Warehouse 2" },
    ] as WarehouseFragment[];
    const moves = [{ id: "3", sortOrder: -2 }];

    const { reorderChannelWarehouses } = renderHook(() => useChannelWarehousesReorder()).result
      .current;

    // Act
    await act(async () => {
      await reorderChannelWarehouses({ warehousesToDisplay, warehouses, channelId });
    });

    // Assert
    expect(mockedReorderWarehousesMutation).toHaveBeenCalledWith({
      variables: { channelId, moves },
    });
  });

  it("should not handle warehouses reorder when zero moves", async () => {
    // Arrange
    const mockedReorderWarehousesMutation = jest.fn();

    (useChannelReorderWarehousesMutation as jest.Mock).mockImplementation(() => [
      mockedReorderWarehousesMutation,
      {},
    ]);

    const channelId = "1";
    const warehouses = [
      { id: "1", name: "Warehouse 1" },
      { id: "2", name: "Warehouse 2" },
      { id: "3", name: "Warehouse 3" },
    ] as WarehouseFragment[];
    const warehousesToDisplay = [
      { id: "1", name: "Warehouse 1" },
      { id: "2", name: "Warehouse 2" },
      { id: "3", name: "Warehouse 3" },
    ] as WarehouseFragment[];

    const { reorderChannelWarehouses } = renderHook(() => useChannelWarehousesReorder()).result
      .current;

    // Act
    await act(async () => {
      await reorderChannelWarehouses({ warehousesToDisplay, warehouses, channelId });
    });

    // Assert
    expect(mockedReorderWarehousesMutation).not.toHaveBeenCalled();
  });
});
