import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  CountryCode,
  useWarehouseDeleteMutation,
  useWarehouseDetailsQuery,
  useWarehouseUpdateMutation,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import {
  extractMutationErrors,
  findValueInEnum,
  getMutationStatus,
  getStringOrPlaceholder,
} from "@saleor/misc";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import WarehouseDeleteDialog from "@saleor/warehouses/components/WarehouseDeleteDialog";
import WarehouseDetailsPage, {
  WarehouseDetailsPageFormData,
} from "@saleor/warehouses/components/WarehouseDetailsPage";
import {
  warehouseListUrl,
  warehouseUrl,
  WarehouseUrlQueryParams,
} from "@saleor/warehouses/urls";
import React from "react";
import { useIntl } from "react-intl";

export interface WarehouseDetailsProps {
  id: string;
  params: WarehouseUrlQueryParams;
}

const WarehouseDetails: React.FC<WarehouseDetailsProps> = ({ id, params }) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const { data, loading } = useWarehouseDetailsQuery({
    displayLoader: true,
    variables: { id },
  });
  const [updateWarehouse, updateWarehouseOpts] = useWarehouseUpdateMutation({
    onCompleted: data => {
      if (data.updateWarehouse.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });
  const updateWarehouseTransitionState = getMutationStatus(updateWarehouseOpts);

  const [deleteWarehouse, deleteWarehouseOpts] = useWarehouseDeleteMutation({
    onCompleted: data => {
      if (data.deleteWarehouse.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        navigate(warehouseListUrl());
      }
    },
  });
  const deleteWarehouseTransitionState = getMutationStatus(deleteWarehouseOpts);

  const [openModal, closeModal] = createDialogActionHandlers(
    navigate,
    params => warehouseUrl(id, params),
    params,
  );

  if (data?.warehouse === null) {
    return <NotFoundPage onBack={() => navigate(warehouseListUrl())} />;
  }

  const handleSubmit = async (data: WarehouseDetailsPageFormData) =>
    extractMutationErrors(
      updateWarehouse({
        variables: {
          id,
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
            isPrivate: data.isPrivate,
            clickAndCollectOption: data.clickAndCollectOption,
          },
        },
      }),
    );

  return (
    <>
      <WindowTitle title={data?.warehouse?.name} />
      <WarehouseDetailsPage
        countries={shop?.countries || []}
        disabled={loading || updateWarehouseOpts.loading}
        errors={updateWarehouseOpts.data?.updateWarehouse.errors || []}
        saveButtonBarState={updateWarehouseTransitionState}
        warehouse={data?.warehouse}
        onDelete={() => openModal("delete")}
        onSubmit={handleSubmit}
      />
      <WarehouseDeleteDialog
        confirmButtonState={deleteWarehouseTransitionState}
        name={getStringOrPlaceholder(data?.warehouse?.name)}
        onClose={closeModal}
        onConfirm={() =>
          deleteWarehouse({
            variables: { id },
          })
        }
        open={params.action === "delete"}
      />
    </>
  );
};

WarehouseDetails.displayName = "WarehouseDetails";
export default WarehouseDetails;
