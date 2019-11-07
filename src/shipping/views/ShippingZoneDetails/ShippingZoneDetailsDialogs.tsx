import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import useNavigator from "@saleor/hooks/useNavigator";
import useShop from "@saleor/hooks/useShop";
import { maybe } from "../../../misc";
import { ShippingMethodTypeEnum } from "../../../types/globalTypes";
import ShippingZoneCountriesAssignDialog from "../../components/ShippingZoneCountriesAssignDialog";
import ShippingZoneRateDialog from "../../components/ShippingZoneRateDialog";
import { ShippingZoneDetailsFragment } from "../../types/ShippingZoneDetailsFragment";
import { shippingZoneUrl, ShippingZoneUrlQueryParams } from "../../urls";
import { ShippingZoneOperationsOutput } from "./ShippingZoneOperations";

export interface ShippingZoneDetailsDialogsProps {
  assignCountryTransitionState: ConfirmButtonTransitionState;
  createRateTransitionState: ConfirmButtonTransitionState;
  deleteRateTransitionState: ConfirmButtonTransitionState;
  deleteZoneTransitionState: ConfirmButtonTransitionState;
  id: string;
  ops: ShippingZoneOperationsOutput;
  params: ShippingZoneUrlQueryParams;
  shippingZone: ShippingZoneDetailsFragment;
  unassignCountryTransitionState: ConfirmButtonTransitionState;
  updateRateTransitionState: ConfirmButtonTransitionState;
}

const ShippingZoneDetailsDialogs: React.FC<ShippingZoneDetailsDialogsProps> = ({
  assignCountryTransitionState,
  createRateTransitionState,
  deleteRateTransitionState,
  deleteZoneTransitionState,
  id,
  ops,
  params,
  shippingZone,
  unassignCountryTransitionState,
  updateRateTransitionState
}) => {
  const navigate = useNavigator();
  const shop = useShop();
  const intl = useIntl();

  const closeModal = () => navigate(shippingZoneUrl(id), true);

  const rate = maybe(() =>
    shippingZone.shippingMethods.find(rate => rate.id === params.id)
  );

  return (
    <>
      <ShippingZoneRateDialog
        action="edit"
        confirmButtonState={updateRateTransitionState}
        defaultCurrency={maybe(() => shop.defaultCurrency)}
        disabled={ops.shippingRateUpdate.opts.loading}
        errors={maybe(
          () => ops.shippingRateUpdate.opts.data.shippingPriceUpdate.errors,
          []
        )}
        onClose={closeModal}
        onSubmit={formData =>
          ops.shippingRateUpdate.mutate({
            id: params.id,
            input: {
              maximumOrderPrice: formData.noLimits
                ? null
                : parseFloat(formData.maxValue),
              minimumOrderPrice: formData.noLimits
                ? null
                : parseFloat(formData.minValue),
              name: formData.name,
              price: formData.isFree ? 0 : parseFloat(formData.price),
              shippingZone: id,
              type: maybe(() => rate.type)
            }
          })
        }
        open={params.action === "edit-rate"}
        rate={rate}
        variant={maybe(() => rate.type)}
      />
      <ActionDialog
        confirmButtonState={deleteRateTransitionState}
        onClose={closeModal}
        onConfirm={() =>
          ops.shippingRateDelete.mutate({
            id: params.id
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
              name: maybe(() => rate.name, "...")
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <ShippingZoneRateDialog
        action="create"
        confirmButtonState={createRateTransitionState}
        defaultCurrency={maybe(() => shop.defaultCurrency)}
        disabled={ops.shippingRateCreate.opts.loading}
        errors={maybe(
          () => ops.shippingRateCreate.opts.data.shippingPriceCreate.errors,
          []
        )}
        onClose={closeModal}
        onSubmit={formData =>
          ops.shippingRateCreate.mutate({
            input: {
              maximumOrderPrice:
                params.type === ShippingMethodTypeEnum.PRICE
                  ? formData.noLimits
                    ? null
                    : parseFloat(formData.maxValue)
                  : null,
              maximumOrderWeight:
                params.type === ShippingMethodTypeEnum.WEIGHT
                  ? formData.noLimits
                    ? null
                    : parseFloat(formData.maxValue)
                  : null,

              minimumOrderPrice:
                params.type === ShippingMethodTypeEnum.PRICE
                  ? formData.noLimits
                    ? null
                    : parseFloat(formData.minValue)
                  : null,
              minimumOrderWeight:
                params.type === ShippingMethodTypeEnum.WEIGHT
                  ? formData.noLimits
                    ? null
                    : parseFloat(formData.minValue)
                  : null,
              name: formData.name,
              price: formData.isFree ? 0 : parseFloat(formData.price),
              shippingZone: id,
              type: params.type
            }
          })
        }
        open={params.action === "add-rate"}
        rate={undefined}
        variant={params.type}
      />
      <ActionDialog
        confirmButtonState={deleteZoneTransitionState}
        onClose={closeModal}
        onConfirm={() =>
          ops.shippingZoneDelete.mutate({
            id
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
              name: <strong>{maybe(() => shippingZone.name, "...")}</strong>
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <ShippingZoneCountriesAssignDialog
        confirmButtonState={assignCountryTransitionState}
        countries={maybe(() => shop.countries, [])}
        initial={maybe(
          () => shippingZone.countries.map(country => country.code),
          []
        )}
        isDefault={maybe(() => shippingZone.default, false)}
        onClose={closeModal}
        onConfirm={formData =>
          ops.shippingZoneUpdate.mutate({
            id,
            input: {
              countries: formData.countries,
              default: formData.restOfTheWorld
            }
          })
        }
        open={params.action === "assign-country"}
      />
      <ActionDialog
        confirmButtonState={unassignCountryTransitionState}
        onClose={closeModal}
        onConfirm={() =>
          ops.shippingZoneUpdate.mutate({
            id,
            input: {
              countries: shippingZone.countries
                .filter(country => country.code !== params.id)
                .map(country => country.code)
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
                  {maybe(
                    () =>
                      shippingZone.countries.find(
                        country => country.code === params.id
                      ).country,
                    "..."
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
export default ShippingZoneDetailsDialogs;
