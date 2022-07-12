import {
  useCreateShippingZoneMutation,
  useShopCountriesQuery,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { extractMutationErrors } from "@saleor/misc";
import { mapCountriesToCountriesCodes } from "@saleor/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import ShippingZoneCreatePage, {
  ShippingZoneCreateFormData,
} from "../components/ShippingZoneCreatePage";
import { shippingZoneUrl } from "../urls";

const ShippingZoneCreate: React.FC<{}> = () => {
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

  const [
    createShippingZone,
    createShippingZoneOpts,
  ] = useCreateShippingZoneMutation({
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
      restWorldCountries={
        mapCountriesToCountriesCodes(restWorldCountries?.shop?.countries) || []
      }
      disabled={createShippingZoneOpts.loading}
      errors={createShippingZoneOpts.data?.shippingZoneCreate.errors || []}
      onSubmit={handleSubmit}
      saveButtonBarState={createShippingZoneOpts.status}
    />
  );
};
export default ShippingZoneCreate;
