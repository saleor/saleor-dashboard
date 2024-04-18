import { WindowTitle } from "@dashboard/components/WindowTitle";
import { CountryCode, useWarehouseCreateMutation } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors, findValueInEnum, getMutationStatus } from "@dashboard/misc";
import WarehouseCreatePage, {
  WarehouseCreatePageFormData,
} from "@dashboard/warehouses/components/WarehouseCreatePage";
import { warehouseUrl } from "@dashboard/warehouses/urls";
import React from "react";
import { useIntl } from "react-intl";

const WarehouseCreate: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const [createWarehouse, createWarehouseOpts] = useWarehouseCreateMutation({
    onCompleted: data => {
      if (data?.createWarehouse?.errors.length === 0) {
        const warehouse = data?.createWarehouse?.warehouse;
        if (warehouse?.id) {
          navigate(warehouseUrl(warehouse.id));
        }
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
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
              streetAddress2: data.streetAddress2,
            },
            name: data.name,
          },
        },
      }),
    );

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          id: "GhcypC",
          defaultMessage: "Create Warehouse",
          description: "header",
        })}
      />
      <WarehouseCreatePage
        countries={shop?.countries || []}
        disabled={createWarehouseOpts.loading}
        errors={createWarehouseOpts.data?.createWarehouse?.errors || []}
        saveButtonBarState={createWarehouseTransitionState}
        onSubmit={handleSubmit}
      />
    </>
  );
};

WarehouseCreate.displayName = "WarehouseCreate";
export default WarehouseCreate;
