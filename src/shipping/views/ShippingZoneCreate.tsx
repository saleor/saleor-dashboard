// @ts-strict-ignore
import { useCreateShippingZoneMutation, useShopCountriesQuery } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors } from "@dashboard/misc";
import { mapCountriesToCountriesCodes } from "@dashboard/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import ShippingZoneCreatePage, {
  ShippingZoneCreateFormData,
} from "../components/ShippingZoneCreatePage";
import { shippingZoneUrl } from "../urls";

const ShippingZoneCreate = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();
  const { data: restWorldCountries } = useShopCountriesQuery({
    variables: {
      filter: {
        attachedToShippingZones: false,
      },
    },
  });
  const [createShippingZone, createShippingZoneOpts] = useCreateShippingZoneMutation({
    onCompleted: data => {
      if (data.shippingZoneCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        navigate(shippingZoneUrl(data.shippingZoneCreate.shippingZone.id));
      }
    },
  });
  const handleSubmit = (data: ShippingZoneCreateFormData) =>
    extractMutationErrors(
      createShippingZone({
        variables: {
          input: data,
        },
      }),
    );

  return (
    <ShippingZoneCreatePage
      countries={shop?.countries || []}
      restWorldCountries={mapCountriesToCountriesCodes(restWorldCountries?.shop?.countries) || []}
      disabled={createShippingZoneOpts.loading}
      errors={createShippingZoneOpts.data?.shippingZoneCreate.errors || []}
      onSubmit={handleSubmit}
      saveButtonBarState={createShippingZoneOpts.status}
    />
  );
};

export default ShippingZoneCreate;
