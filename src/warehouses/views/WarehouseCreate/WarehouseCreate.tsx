import React from "react";
import { useIntl } from "react-intl";

import WarehouseCreatePage from "@saleor/warehouses/components/WarehouseCreatePage";
import useNavigator from "@saleor/hooks/useNavigator";
import { warehouseListUrl, warehouseUrl } from "@saleor/warehouses/urls";
import { useWarehouseCreate } from "@saleor/warehouses/mutations";
import { commonMessages } from "@saleor/intl";
import useNotifier from "@saleor/hooks/useNotifier";
import { findValueInEnum, getMutationStatus } from "@saleor/misc";
import { CountryCode } from "@saleor/types/globalTypes";
import useShop from "@saleor/hooks/useShop";
import { WindowTitle } from "@saleor/components/WindowTitle";

const WarehouseCreate: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const [createWarehouse, createWarehouseOpts] = useWarehouseCreate({
    onCompleted: data => {
      if (data.createWarehouse.errors.length === 0) {
        navigate(warehouseUrl(data.createWarehouse.warehouse.id));
        notify({ text: intl.formatMessage(commonMessages.savedChanges) });
      }
    }
  });
  const createWarehouseTransitionState = getMutationStatus(createWarehouseOpts);

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          defaultMessage: "Create Warehouse",
          description: "header"
        })}
      />
      <WarehouseCreatePage
        countries={shop?.countries || []}
        disabled={createWarehouseOpts.loading}
        errors={createWarehouseOpts.data?.createWarehouse.errors || []}
        saveButtonBarState={createWarehouseTransitionState}
        onBack={() => navigate(warehouseListUrl())}
        onSubmit={data =>
          createWarehouse({
            variables: {
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

WarehouseCreate.displayName = "WarehouseCreate";
export default WarehouseCreate;
