import React from "react";
import { useIntl } from "react-intl";

import WarehouseDetailsPage from "@saleor/warehouses/components/WarehouseDetailsPage";
import useNavigator from "@saleor/hooks/useNavigator";
import {
  warehouseListUrl,
  WarehouseUrlQueryParams
} from "@saleor/warehouses/urls";
import { useWarehouseDetails } from "@saleor/warehouses/queries";
import { commonMessages } from "@saleor/intl";
import useNotifier from "@saleor/hooks/useNotifier";
import { maybe, findValueInEnum, getMutationStatus } from "@saleor/misc";
import { CountryCode } from "@saleor/types/globalTypes";
import useShop from "@saleor/hooks/useShop";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { useWarehouseUpdate } from "@saleor/warehouses/mutations";
import { shippingZoneUrl } from "@saleor/shipping/urls";

export interface WarehouseDetailsProps {
  id: string;
  params: WarehouseUrlQueryParams;
}

const WarehouseDetails: React.FC<WarehouseDetailsProps> = ({ id, params }) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const { data, loading } = useWarehouseDetails({
    displayLoader: true,
    require: ["warehouse"],
    variables: { id }
  });
  const [updateWarehouse, updateWarehouseOpts] = useWarehouseUpdate({
    onCompleted: data => {
      if (data.updateWarehouse.errors.length === 0) {
        notify({ text: intl.formatMessage(commonMessages.savedChanges) });
      }
    }
  });
  const updateWarehouseTransitionState = getMutationStatus(updateWarehouseOpts);

  return (
    <>
      <WindowTitle title={maybe(() => data.warehouse.name)} />
      <WarehouseDetailsPage
        onBack={() => navigate(warehouseListUrl())}
        disabled={loading || updateWarehouseOpts.loading}
        errors={maybe(
          () => updateWarehouseOpts.data.updateWarehouse.errors,
          []
        )}
        saveButtonBarState={updateWarehouseTransitionState}
        shop={shop}
        warehouse={maybe(() => data.warehouse)}
        onShippingZoneClick={id => navigate(shippingZoneUrl(id))}
        onSubmit={data =>
          updateWarehouse({
            variables: {
              id,
              input: {
                address: {
                  city: data.city,
                  cityArea: data.cityArea,
                  country: findValueInEnum(data.country, CountryCode),
                  countryArea: data.countryArea,
                  phone: data.phone,
                  postalCode: data.postalCode,
                  streetAddress1: data.streetAddress1,
                  streetAddress2: data.streetAddress2
                },
                name: data.name
              }
            }
          })
        }
      />
    </>
  );
};

WarehouseDetails.displayName = "WarehouseDetails";
export default WarehouseDetails;
