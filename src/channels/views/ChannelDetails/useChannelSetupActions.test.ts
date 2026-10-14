import { type FetchResult } from "@apollo/client";
import { type CreateWarehouseForChannelFormData } from "@dashboard/channels/components/CreateWarehouseForChannelDialog/CreateWarehouseForChannelDialog";
import {
  ChannelErrorCode,
  type ChannelUpdateMutation,
  type WarehouseCreateMutation,
  type WarehouseUpdateMutation,
} from "@dashboard/graphql";
import type * as GraphqlTypes from "@dashboard/graphql/types.generated";
import { warehouse } from "@dashboard/warehouses/fixtures";
import { act, renderHook, type RenderHookResult } from "@testing-library/react";
import type * as ReactIntl from "react-intl";

import { useChannelSetupActions } from "./useChannelSetupActions";

const mockCreateWarehouse = jest.fn();
const mockUpdateWarehouse = jest.fn();
const mockUpdateChannel = jest.fn();

jest.mock("@dashboard/graphql", () => ({
  ...jest.requireActual<typeof GraphqlTypes>("@dashboard/graphql/types.generated"),
  useWarehouseCreateMutation: (): [jest.Mock, object] => [mockCreateWarehouse, {}],
  useWarehouseUpdateMutation: (): [jest.Mock, object] => [mockUpdateWarehouse, {}],
  useChannelUpdateMutation: (): [jest.Mock, object] => [mockUpdateChannel, {}],
  useCreateShippingZoneMutation: (): [jest.Mock, object] => [jest.fn(), {}],
  useCreateShippingRateMutation: (): [jest.Mock, object] => [jest.fn(), {}],
  useShippingMethodChannelListingUpdateMutation: (): [jest.Mock, object] => [jest.fn(), {}],
  ChannelDocument: {},
  ChannelShippingZonesDocument: {},
}));
jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: (): jest.Mock => jest.fn(),
}));
jest.mock("react-intl", () => ({
  ...jest.requireActual<typeof ReactIntl>("react-intl"),
  useIntl: (): { formatMessage: jest.Mock } => ({ formatMessage: jest.fn(() => "") }),
}));

const formData: CreateWarehouseForChannelFormData = {
  name: "Berlin",
  city: "Berlin",
  country: "DE",
  phone: "",
  postalCode: "10115",
  streetAddress1: "Invalidenstrasse 1",
};

const created: FetchResult<WarehouseCreateMutation> = {
  data: {
    __typename: "Mutation",
    createWarehouse: {
      __typename: "WarehouseCreate",
      errors: [],
      warehouse: { ...warehouse, id: "warehouse-1" },
    },
  },
};

const updated: FetchResult<WarehouseUpdateMutation> = {
  data: {
    __typename: "Mutation",
    updateWarehouse: { __typename: "WarehouseUpdate", errors: [], warehouse: null },
  },
};

const assignFailed: FetchResult<ChannelUpdateMutation> = {
  data: {
    __typename: "Mutation",
    channelUpdate: {
      __typename: "ChannelUpdate",
      channel: null,
      errors: [
        {
          __typename: "ChannelError",
          code: ChannelErrorCode.INVALID,
          field: null,
          message: "Assign failed",
        },
      ],
    },
  },
};

const assigned: FetchResult<ChannelUpdateMutation> = {
  data: {
    __typename: "Mutation",
    channelUpdate: { __typename: "ChannelUpdate", channel: null, errors: [] },
  },
};

type ActionsProps = { createWarehouseOpen: boolean };
type Actions = ReturnType<typeof useChannelSetupActions>;

const renderActions = (): RenderHookResult<Actions, ActionsProps> =>
  renderHook<Actions, ActionsProps>(
    ({ createWarehouseOpen }) =>
      useChannelSetupActions({
        channelId: "channel-1",
        createWarehouseOpen,
        warehouseIds: [],
        onWarehouseCreated: jest.fn(),
        onShippingCreated: jest.fn(),
        onAssigned: jest.fn(),
      }),
    { initialProps: { createWarehouseOpen: true } },
  );

describe("useChannelSetupActions handleCreateWarehouse", () => {
  beforeEach(() => jest.clearAllMocks());

  it("saves form edits to the created warehouse when retrying a failed assign", async () => {
    // Arrange
    mockCreateWarehouse.mockResolvedValueOnce(created);
    mockUpdateWarehouse.mockResolvedValueOnce(updated);
    mockUpdateChannel.mockResolvedValueOnce(assignFailed).mockResolvedValueOnce(assigned);

    const { result } = renderActions();

    await act(async () => {
      await result.current.handleCreateWarehouse(formData);
    });

    // Act
    const errors = await act(async () =>
      result.current.handleCreateWarehouse({ ...formData, name: "Berlin Mitte" }),
    );

    // Assert
    expect(errors).toEqual([]);
    expect(mockCreateWarehouse).toHaveBeenCalledTimes(1);
    expect(mockUpdateWarehouse).toHaveBeenCalledWith({
      variables: {
        id: "warehouse-1",
        input: expect.objectContaining({ name: "Berlin Mitte" }),
      },
    });
    expect(mockUpdateChannel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        variables: { id: "channel-1", input: { addWarehouses: ["warehouse-1"] } },
      }),
    );
  });

  it("only retries the assign when the form did not change", async () => {
    // Arrange
    mockCreateWarehouse.mockResolvedValueOnce(created);
    mockUpdateChannel.mockResolvedValueOnce(assignFailed).mockResolvedValueOnce(assigned);

    const { result } = renderActions();

    await act(async () => {
      await result.current.handleCreateWarehouse(formData);
    });

    // Act
    const errors = await act(async () => result.current.handleCreateWarehouse(formData));

    // Assert
    expect(errors).toEqual([]);
    expect(mockCreateWarehouse).toHaveBeenCalledTimes(1);
    expect(mockUpdateWarehouse).not.toHaveBeenCalled();
    expect(mockUpdateChannel).toHaveBeenCalledTimes(2);
  });

  it("creates a new warehouse after the dialog is reopened", async () => {
    // Arrange
    mockCreateWarehouse.mockResolvedValue(created);
    mockUpdateChannel.mockResolvedValueOnce(assignFailed).mockResolvedValueOnce(assigned);

    const { result, rerender } = renderActions();

    await act(async () => {
      await result.current.handleCreateWarehouse(formData);
    });
    rerender({ createWarehouseOpen: false });
    rerender({ createWarehouseOpen: true });

    // Act
    await act(async () => result.current.handleCreateWarehouse({ ...formData, name: "Paris" }));

    // Assert
    expect(mockCreateWarehouse).toHaveBeenCalledTimes(2);
    expect(mockUpdateWarehouse).not.toHaveBeenCalled();
  });
});
