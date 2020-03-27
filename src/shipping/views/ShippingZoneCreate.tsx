import React from "react";
import { useIntl } from "react-intl";

import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { maybe } from "../../misc";
import ShippingZoneCreatePage from "../components/ShippingZoneCreatePage";
import { TypedCreateShippingZone } from "../mutations";
import { CreateShippingZone } from "../types/CreateShippingZone";
import { shippingZonesListUrl, shippingZoneUrl } from "../urls";

const ShippingZoneCreate: React.FC<{}> = () => {
  const navigate = useNavigator();
  const pushMessage = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const onShippingZoneCreate = (data: CreateShippingZone) => {
    if (data.shippingZoneCreate.errors.length === 0) {
      pushMessage({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(shippingZoneUrl(data.shippingZoneCreate.shippingZone.id));
    }
  };
  return (
    <TypedCreateShippingZone onCompleted={onShippingZoneCreate}>
      {(createShippingZone, createShippingZoneOpts) => (
        <ShippingZoneCreatePage
          countries={maybe(() => shop.countries, [])}
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
      )}
    </TypedCreateShippingZone>
  );
};
export default ShippingZoneCreate;
