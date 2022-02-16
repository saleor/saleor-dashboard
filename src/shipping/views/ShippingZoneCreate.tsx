import { useShopCountries } from "@saleor/components/Shop/query";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { mapCountriesToCountriesCodes } from "@saleor/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import ShippingZoneCreatePage from "../components/ShippingZoneCreatePage";
import { useShippingZoneCreate } from "../mutations";
import { shippingZonesListUrl, shippingZoneUrl } from "../urls";

const ShippingZoneCreate: React.FC<{}> = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const { data: restWorldCountries } = useShopCountries({
    variables: {
      filter: {
        attachedToShippingZones: false
      }
    }
  });

  const [createShippingZone, createShippingZoneOpts] = useShippingZoneCreate({
    onCompleted: data => {
      if (data.shippingZoneCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        navigate(shippingZoneUrl(data.shippingZoneCreate.shippingZone.id));
      }
    }
  });

  return (
    <ShippingZoneCreatePage
      countries={shop?.countries || []}
      restWorldCountries={
        mapCountriesToCountriesCodes(restWorldCountries?.shop?.countries) || []
      }
      disabled={createShippingZoneOpts.loading}
      errors={createShippingZoneOpts.data?.shippingZoneCreate.errors || []}
      onBack={() => navigate(shippingZonesListUrl())}
      onSubmit={formData =>
        createShippingZone({
          variables: {
            input: formData
          }
        })
      }
      saveButtonBarState={createShippingZoneOpts.status}
    />
  );
};
export default ShippingZoneCreate;
