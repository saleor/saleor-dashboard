import { type CreateShippingForChannelFormData } from "@dashboard/channels/components/CreateShippingForChannelDialog/CreateShippingForChannelDialog";
import { type CreateWarehouseForChannelFormData } from "@dashboard/channels/components/CreateWarehouseForChannelDialog/CreateWarehouseForChannelDialog";
import {
  CountryCode,
  type ShippingErrorFragment,
  ShippingMethodTypeEnum,
  useChannelUpdateMutation,
  useCreateShippingRateMutation,
  useCreateShippingZoneMutation,
  useShippingMethodChannelListingUpdateMutation,
  useWarehouseCreateMutation,
  type WarehouseErrorFragment,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors, findValueInEnum, getMutationStatus } from "@dashboard/misc";
import { useIntl } from "react-intl";

import { getChannelDetailsRefetchQueries } from "./channelRefetchQueries";

interface UseChannelSetupActionsArgs {
  channelId: string;
  warehouseIds: string[];
  onWarehouseCreated: () => void;
  onShippingCreated: () => void;
  onAssigned: () => void;
}

export const useChannelSetupActions = ({
  channelId,
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
  const [updateChannel, updateChannelOpts] = useChannelUpdateMutation();
  const [createShippingZone, createShippingZoneOpts] = useCreateShippingZoneMutation();
  const [createShippingRate, createShippingRateOpts] = useCreateShippingRateMutation();
  const [updateShippingMethodListing, updateShippingMethodListingOpts] =
    useShippingMethodChannelListingUpdateMutation();

  const handleCreateWarehouse = async (
    data: CreateWarehouseForChannelFormData,
  ): Promise<WarehouseErrorFragment[]> => {
    try {
      const createResult = await createWarehouse({
        variables: {
          input: {
            name: data.name,
            address: {
              companyName: data.companyName,
              city: data.city,
              cityArea: data.cityArea,
              country: findValueInEnum(data.country, CountryCode),
              countryArea: data.countryArea,
              phone: data.phone,
              postalCode: data.postalCode,
              streetAddress1: data.streetAddress1,
              streetAddress2: data.streetAddress2,
            },
          },
        },
      });
      const createErrors = createResult.data?.createWarehouse?.errors ?? [];

      if (createErrors.length) {
        return createErrors;
      }

      const warehouseId = createResult.data?.createWarehouse?.warehouse?.id;

      if (!warehouseId) {
        return [];
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
        notify({
          status: "error",
          text:
            assignErrors[0]?.message ||
            intl.formatMessage({
              id: "kwS+Nw",
              defaultMessage: "Warehouse was created but could not be assigned to this channel",
            }),
        });

        return [];
      }

      notify({
        status: "success",
        text: intl.formatMessage({
          id: "g9PCqW",
          defaultMessage: "Warehouse created and assigned",
        }),
      });
      onWarehouseCreated();

      return [];
    } catch {
      notifyUnexpectedError();

      return [];
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

  const warehouseLoading = createWarehouseOpts.loading || updateChannelOpts.loading;
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
