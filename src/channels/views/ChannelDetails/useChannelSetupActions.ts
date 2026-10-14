import { type CreateShippingForChannelFormData } from "@dashboard/channels/components/CreateShippingForChannelDialog/CreateShippingForChannelDialog";
import { type CreateWarehouseForChannelFormData } from "@dashboard/channels/components/CreateWarehouseForChannelDialog/CreateWarehouseForChannelDialog";
import {
  type ShippingErrorFragment,
  ShippingMethodTypeEnum,
  useChannelUpdateMutation,
  useCreateShippingRateMutation,
  useCreateShippingZoneMutation,
  useShippingMethodChannelListingUpdateMutation,
  useWarehouseCreateMutation,
  useWarehouseUpdateMutation,
  WarehouseErrorCode,
  type WarehouseErrorFragment,
} from "@dashboard/graphql";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen/useModalDialogOpen";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors, getMutationStatus } from "@dashboard/misc";
import {
  type WarehouseInputFromForm,
  warehouseInputFromForm,
} from "@dashboard/warehouses/warehouseInputFromForm";
import { useRef } from "react";
import { useIntl } from "react-intl";

import { getChannelDetailsRefetchQueries } from "./channelRefetchQueries";

interface UseChannelSetupActionsArgs {
  channelId: string;
  /** The create-warehouse dialog starts with an empty form, so it also starts a new warehouse. */
  createWarehouseOpen: boolean;
  warehouseIds: string[];
  onWarehouseCreated: () => void;
  onShippingCreated: () => void;
  onAssigned: () => void;
}

export const useChannelSetupActions = ({
  channelId,
  createWarehouseOpen,
  warehouseIds,
  onWarehouseCreated,
  onShippingCreated,
  onAssigned,
}: UseChannelSetupActionsArgs) => {
  const intl = useIntl();
  const notify = useNotifier();
  const notifyUnexpectedError = (): void => {
    notify({
      status: "error",
      text: intl.formatMessage(commonMessages.somethingWentWrong),
    });
  };

  const [createWarehouse, createWarehouseOpts] = useWarehouseCreateMutation();
  const [updateWarehouse, updateWarehouseOpts] = useWarehouseUpdateMutation();
  /** Created but not yet assigned, with the input it was last saved with. */
  const pendingWarehouse = useRef<{ id: string; input: WarehouseInputFromForm } | null>(null);

  // Any way of reopening (close button, browser Back, a link) must not reuse an earlier warehouse.
  useModalDialogOpen(createWarehouseOpen, {
    onOpen: () => {
      pendingWarehouse.current = null;
    },
  });

  const [updateChannel, updateChannelOpts] = useChannelUpdateMutation();
  const [createShippingZone, createShippingZoneOpts] = useCreateShippingZoneMutation();
  const [createShippingRate, createShippingRateOpts] = useCreateShippingRateMutation();
  const [updateShippingMethodListing, updateShippingMethodListingOpts] =
    useShippingMethodChannelListingUpdateMutation();

  const handleCreateWarehouse = async (
    data: CreateWarehouseForChannelFormData,
  ): Promise<WarehouseErrorFragment[]> => {
    try {
      const input = warehouseInputFromForm(data);
      const pending = pendingWarehouse.current;
      let warehouseId: string;

      if (!pending) {
        const createResult = await createWarehouse({ variables: { input } });
        const createErrors = createResult.data?.createWarehouse?.errors ?? [];

        if (createErrors.length) {
          return createErrors;
        }

        const createdId = createResult.data?.createWarehouse?.warehouse?.id;

        if (!createdId) {
          return [];
        }

        warehouseId = createdId;
        pendingWarehouse.current = { id: warehouseId, input };
      } else {
        warehouseId = pending.id;

        // A retry after a failed assign must not drop edits made since the create.
        if (JSON.stringify(pending.input) !== JSON.stringify(input)) {
          const updateResult = await updateWarehouse({ variables: { id: warehouseId, input } });
          const updateErrors = updateResult.data?.updateWarehouse?.errors ?? [];

          if (updateErrors.length) {
            return updateErrors;
          }

          pendingWarehouse.current = { id: warehouseId, input };
        }
      }

      const assignErrors = await extractMutationErrors(
        updateChannel({
          variables: {
            id: channelId,
            input: {
              addWarehouses: [warehouseId],
            },
          },
          refetchQueries: getChannelDetailsRefetchQueries(channelId),
        }),
      );

      if (assignErrors.length) {
        return [
          {
            __typename: "WarehouseError",
            code: WarehouseErrorCode.INVALID,
            field: null,
            message:
              assignErrors[0]?.message ||
              intl.formatMessage({
                id: "kwS+Nw",
                defaultMessage: "Warehouse was created but could not be assigned to this channel",
              }),
          },
        ];
      }

      notify({
        status: "success",
        text: intl.formatMessage({
          id: "g9PCqW",
          defaultMessage: "Warehouse created and assigned",
        }),
      });
      pendingWarehouse.current = null;
      onWarehouseCreated();

      return [];
    } catch {
      return [
        {
          __typename: "WarehouseError",
          code: WarehouseErrorCode.INVALID,
          field: null,
          message: intl.formatMessage(commonMessages.somethingWentWrong),
        },
      ];
    }
  };

  const handleCreateShipping = async (
    data: CreateShippingForChannelFormData,
    countryCode: string,
  ): Promise<ShippingErrorFragment[]> => {
    try {
      const zoneResult = await createShippingZone({
        variables: {
          input: {
            name: data.zoneName,
            countries: [countryCode],
            addChannels: [channelId],
            addWarehouses: warehouseIds,
          },
        },
      });
      const zoneErrors = zoneResult.data?.shippingZoneCreate?.errors ?? [];

      if (zoneErrors.length) {
        return zoneErrors;
      }

      const zoneId = zoneResult.data?.shippingZoneCreate?.shippingZone?.id;

      if (!zoneId) {
        return [];
      }

      const rateResult = await createShippingRate({
        variables: {
          input: {
            name: data.rateName,
            shippingZone: zoneId,
            type: ShippingMethodTypeEnum.PRICE,
          },
        },
      });
      const rateErrors = rateResult.data?.shippingPriceCreate?.errors ?? [];

      if (rateErrors.length) {
        return rateErrors;
      }

      const rateId = rateResult.data?.shippingPriceCreate?.shippingMethod?.id;

      if (!rateId) {
        return [];
      }

      const listingResult = await updateShippingMethodListing({
        variables: {
          id: rateId,
          input: {
            addChannels: [
              {
                channelId,
                price: data.price,
              },
            ],
          },
        },
        refetchQueries: getChannelDetailsRefetchQueries(channelId),
      });
      const listingErrors = listingResult.data?.shippingMethodChannelListingUpdate?.errors ?? [];

      if (listingErrors.length) {
        notify({
          status: "error",
          text:
            listingErrors[0]?.message ||
            intl.formatMessage({
              id: "nOGSLQ",
              defaultMessage: "Could not set the shipping rate price for this channel",
            }),
        });

        return [];
      }

      notify({
        status: "success",
        text: intl.formatMessage({
          id: "5R7tCW",
          defaultMessage: "Shipping zone and rate created",
        }),
      });
      onShippingCreated();

      return [];
    } catch {
      notifyUnexpectedError();

      return [];
    }
  };

  const handleAssignWarehouse = async (warehouseIdsToAdd: string[]) => {
    if (warehouseIdsToAdd.length === 0) {
      return;
    }

    const errors = await extractMutationErrors(
      updateChannel({
        variables: {
          id: channelId,
          input: {
            addWarehouses: warehouseIdsToAdd,
          },
        },
        refetchQueries: getChannelDetailsRefetchQueries(channelId),
      }),
    ).catch(() => {
      notifyUnexpectedError();

      return null;
    });

    if (!errors) {
      return;
    }

    if (errors.length) {
      notify({
        status: "error",
        text:
          errors[0]?.message ||
          intl.formatMessage({
            id: "XqwYc0",
            defaultMessage: "Could not assign warehouse to this channel",
          }),
      });

      return;
    }

    notify({
      status: "success",
      text: intl.formatMessage(
        {
          id: "PKjitS",
          defaultMessage: "{count, plural, one {Warehouse assigned} other {# warehouses assigned}}",
        },
        { count: warehouseIdsToAdd.length },
      ),
    });
    onAssigned();
  };

  const handleAssignShippingZone = async (shippingZoneIdsToAdd: string[]) => {
    if (shippingZoneIdsToAdd.length === 0) {
      return;
    }

    const errors = await extractMutationErrors(
      updateChannel({
        variables: {
          id: channelId,
          input: {
            addShippingZones: shippingZoneIdsToAdd,
          },
        },
        refetchQueries: getChannelDetailsRefetchQueries(channelId),
      }),
    ).catch(() => {
      notifyUnexpectedError();

      return null;
    });

    if (!errors) {
      return;
    }

    if (errors.length) {
      notify({
        status: "error",
        text:
          errors[0]?.message ||
          intl.formatMessage({
            id: "rpVzFU",
            defaultMessage: "Could not assign shipping zone to this channel",
          }),
      });

      return;
    }

    notify({
      status: "success",
      text: intl.formatMessage(
        {
          id: "lEpYOj",
          defaultMessage:
            "{count, plural, one {Shipping zone assigned} other {# shipping zones assigned}}",
        },
        { count: shippingZoneIdsToAdd.length },
      ),
    });
    onAssigned();
  };

  const warehouseLoading =
    createWarehouseOpts.loading || updateWarehouseOpts.loading || updateChannelOpts.loading;
  const shippingLoading =
    createShippingZoneOpts.loading ||
    createShippingRateOpts.loading ||
    updateShippingMethodListingOpts.loading;

  return {
    handleCreateWarehouse,
    handleCreateShipping,
    handleAssignWarehouse,
    handleAssignShippingZone,
    createWarehouseConfirmState: warehouseLoading
      ? ("loading" as const)
      : getMutationStatus(createWarehouseOpts),
    createShippingConfirmState: shippingLoading
      ? ("loading" as const)
      : getMutationStatus(createShippingZoneOpts),
    assignConfirmState: updateChannelOpts.loading
      ? ("loading" as const)
      : getMutationStatus(updateChannelOpts),
  };
};
