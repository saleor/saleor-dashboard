import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import {
  extractMutationErrors,
  findValueInEnum,
  getMutationStatus
} from "@saleor/misc";
import { CountryCode } from "@saleor/types/globalTypes";
import WarehouseCreatePage, {
  WarehouseCreatePageFormData
} from "@saleor/warehouses/components/WarehouseCreatePage";
import { useWarehouseCreate } from "@saleor/warehouses/mutations";
import { warehouseListUrl, warehouseUrl } from "@saleor/warehouses/urls";
import React from "react";
import { useIntl } from "react-intl";

const WarehouseCreate: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const [createWarehouse, createWarehouseOpts] = useWarehouseCreate({
    onCompleted: data => {
      if (data.createWarehouse.errors.length === 0) {
        navigate(warehouseUrl(data.createWarehouse.warehouse.id));
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
      }
    }
  });
  const createWarehouseTransitionState = getMutationStatus(createWarehouseOpts);

  const handleSubmit = (data: WarehouseCreatePageFormData) =>
    extractMutationErrors(
      createWarehouse({
        variables: {
          input: {
            address: {
              companyName: data.companyName,
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
    );

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
        onSubmit={handleSubmit}
      />
    </>
  );
};

WarehouseCreate.displayName = "WarehouseCreate";
export default WarehouseCreate;
