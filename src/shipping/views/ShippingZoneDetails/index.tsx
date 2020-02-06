import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import useWarehouseSearch from "@saleor/searches/useWarehouseSearch";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import {
  useShippingRateCreate,
  useShippingRateUpdate,
  useShippingRateDelete,
  useShippingZoneDelete,
  useShippingZoneUpdate,
  useAassignShippingZoneToWarehouse
} from "@saleor/shipping/mutations";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import ShippingZoneRateDialog from "@saleor/shipping/components/ShippingZoneRateDialog";
import useShop from "@saleor/hooks/useShop";
import ShippingZoneCountriesAssignDialog from "@saleor/shipping/components/ShippingZoneCountriesAssignDialog";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { getStringOrPlaceholder } from "../../../misc";
import { ShippingMethodTypeEnum } from "../../../types/globalTypes";
import ShippingZoneDetailsPage, {
  FormData
} from "../../components/ShippingZoneDetailsPage";
import { useShippingZone } from "../../queries";
import {
  shippingZonesListUrl,
  shippingZoneUrl,
  ShippingZoneUrlQueryParams,
  ShippingZoneUrlDialog
} from "../../urls";
import {
  getCreateShippingRateVariables,
  getUpdateShippingRateVariables
} from "./data";

export interface ShippingZoneDetailsProps {
  id: string;
  params: ShippingZoneUrlQueryParams;
}

const ShippingZoneDetails: React.FC<ShippingZoneDetailsProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();

  const { result: searchWarehousesOpts } = useWarehouseSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const [assignToWarehouse] = useAassignShippingZoneToWarehouse({});

  const { data, loading } = useShippingZone({
    displayLoader: true,
    variables: { id }
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    ShippingZoneUrlDialog,
    ShippingZoneUrlQueryParams
  >(navigate, params => shippingZoneUrl(id, params), params);
  const rate = data?.shippingZone?.shippingMethods.find(
    rate => rate.id === params.id
  );

  const [createShippingRate, createShippingRateOpts] = useShippingRateCreate({
    onCompleted: data => {
      if (data.shippingPriceCreate.errors.length === 0) {
        notify({
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        closeModal();
      }
    }
  });

  const [updateShippingRate, updateShippingRateOpts] = useShippingRateUpdate({
    onCompleted: data => {
      if (data.shippingPriceUpdate.errors.length === 0) {
        notify({
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        closeModal();
      }
    }
  });

  const [deleteShippingRate, deleteShippingRateOpts] = useShippingRateDelete({
    onCompleted: data => {
      if (data.shippingPriceDelete.errors.length === 0) {
        notify({
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        closeModal();
      }
    }
  });

  const [deleteShippingZone, deleteShippingZoneOpts] = useShippingZoneDelete({
    onCompleted: data => {
      if (data.shippingZoneDelete.errors.length === 0) {
        notify({
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        navigate(shippingZonesListUrl(), true);
      }
    }
  });

  const [updateShippingZone, updateShippingZoneOpts] = useShippingZoneUpdate({
    onCompleted: data => {
      if (data.shippingZoneUpdate.errors.length === 0) {
        notify({
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        closeModal();
      }
    }
  });

  const handleSubmit = (data: FormData) => {
    updateShippingZone({
      variables: {
        id,
        input: {
          name: data.name
        }
      }
    });
    assignToWarehouse({
      variables: {
        shippingZoneId: id,
        warehouseId: data.warehouse
      }
    });
  };

  if (data?.shippingZone === null) {
    return <NotFoundPage onBack={() => navigate(shippingZonesListUrl())} />;
  }

  return (
    <>
      <ShippingZoneDetailsPage
        disabled={loading}
        errors={updateShippingZoneOpts.data?.shippingZoneUpdate.errors || []}
        onBack={() => navigate(shippingZonesListUrl())}
        onCountryAdd={() => openModal("assign-country")}
        onCountryRemove={code =>
          openModal("unassign-country", {
            id: code
          })
        }
        onDelete={() => openModal("remove")}
        onPriceRateAdd={() =>
          openModal("add-rate", {
            type: ShippingMethodTypeEnum.PRICE
          })
        }
        onPriceRateEdit={rateId =>
          openModal("edit-rate", {
            id: rateId
          })
        }
        onRateRemove={rateId =>
          openModal("remove-rate", {
            id: rateId
          })
        }
        onSubmit={handleSubmit}
        onWeightRateAdd={() =>
          openModal("add-rate", {
            type: ShippingMethodTypeEnum.WEIGHT
          })
        }
        onWeightRateEdit={rateId =>
          openModal("edit-rate", {
            id: rateId
          })
        }
        saveButtonBarState={updateShippingZoneOpts.status}
        shippingZone={data?.shippingZone}
        warehouses={
          searchWarehousesOpts.data?.search.edges.map(edge => edge.node) || []
        }
      />
      <ShippingZoneRateDialog
        action="edit"
        confirmButtonState={updateShippingRateOpts.status}
        defaultCurrency={shop?.defaultCurrency}
        disabled={updateShippingRateOpts.loading}
        errors={updateShippingRateOpts.data?.shippingPriceUpdate.errors || []}
        onClose={closeModal}
        onSubmit={data =>
          updateShippingRate({
            variables: getUpdateShippingRateVariables(data, params, id)
          })
        }
        open={params.action === "edit-rate"}
        rate={rate}
        variant={rate?.type}
      />
      <ActionDialog
        confirmButtonState={deleteShippingRateOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          deleteShippingRate({
            variables: {
              id: params.id
            }
          })
        }
        open={params.action === "remove-rate"}
        title={intl.formatMessage({
          defaultMessage: "Delete Shipping Method",
          description: "dialog header"
        })}
        variant="delete"
      >
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Are you sure you want to delete {name}?"
            description="delete shipping method"
            id="shippingZoneDetailsDialogsDeleteShippingMethod"
            values={{
              name: getStringOrPlaceholder(rate?.name)
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <ShippingZoneRateDialog
        action="create"
        confirmButtonState={createShippingRateOpts.status}
        defaultCurrency={shop?.defaultCurrency}
        disabled={createShippingRateOpts.loading}
        errors={createShippingRateOpts.data?.shippingPriceCreate.errors || []}
        onClose={closeModal}
        onSubmit={data =>
          createShippingRate({
            variables: getCreateShippingRateVariables(data, params, id)
          })
        }
        open={params.action === "add-rate"}
        rate={undefined}
        variant={params.type}
      />
      <ActionDialog
        confirmButtonState={deleteShippingZoneOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          deleteShippingZone({
            variables: {
              id
            }
          })
        }
        open={params.action === "remove"}
        title={intl.formatMessage({
          defaultMessage: "Delete Shipping Zone",
          description: "dialog header"
        })}
        variant="delete"
      >
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Are you sure you want to delete {name}?"
            description="delete shipping zone"
            id="shippingZoneDetailsDialogsDeleteShippingZone"
            values={{
              name: (
                <strong>
                  {getStringOrPlaceholder(data?.shippingZone.name)}
                </strong>
              )
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <ShippingZoneCountriesAssignDialog
        confirmButtonState={updateShippingZoneOpts.status}
        countries={shop?.countries || []}
        initial={
          data?.shippingZone?.countries.map(country => country.code) || []
        }
        isDefault={data?.shippingZone?.default}
        onClose={closeModal}
        onConfirm={formData =>
          updateShippingZone({
            variables: {
              id,
              input: {
                countries: formData.countries,
                default: formData.restOfTheWorld
              }
            }
          })
        }
        open={params.action === "assign-country"}
      />
      <ActionDialog
        confirmButtonState={updateShippingZoneOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          updateShippingZone({
            variables: {
              id,
              input: {
                countries: data.shippingZone.countries
                  .filter(country => country.code !== params.id)
                  .map(country => country.code)
              }
            }
          })
        }
        open={params.action === "unassign-country"}
        title={intl.formatMessage({
          defaultMessage: "Delete from Shipping Zone",
          description: "unassign country, dialog header"
        })}
        variant="delete"
      >
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Are you sure you want to delete {countryName} from this shipping zone?"
            description="unassign country"
            values={{
              countryName: (
                <strong>
                  {getStringOrPlaceholder(
                    data?.shippingZone?.countries.find(
                      country => country.code === params.id
                    )?.country
                  )}
                </strong>
              )
            }}
          />
        </DialogContentText>
      </ActionDialog>
    </>
  );
};
export default ShippingZoneDetails;
