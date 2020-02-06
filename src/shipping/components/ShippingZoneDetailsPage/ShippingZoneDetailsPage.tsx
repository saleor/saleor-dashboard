import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import CountryList from "@saleor/components/CountryList";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ShippingErrorFragment } from "@saleor/shipping/types/ShippingErrorFragment";
import createMultiAutocompleteSelectHandler from "@saleor/utils/handlers/multiAutocompleteSelectChangeHandler";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { maybe } from "../../../misc";
import { ShippingMethodTypeEnum } from "../../../types/globalTypes";
import {
  ShippingZoneDetailsFragment,
  ShippingZoneDetailsFragment_warehouses
} from "../../types/ShippingZoneDetailsFragment";
import ShippingZoneInfo from "../ShippingZoneInfo";
import ShippingZoneRates from "../ShippingZoneRates";
import ShippingZoneWarehouses from "../ShippingZoneWarehouses";

export interface FormData {
  name: string;
  warehouses: string[];
}

export interface ShippingZoneDetailsPageProps {
  disabled: boolean;
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  shippingZone: ShippingZoneDetailsFragment;
  warehouses: ShippingZoneDetailsFragment_warehouses[];
  onBack: () => void;
  onCountryAdd: () => void;
  onCountryRemove: (code: string) => void;
  onDelete: () => void;
  onPriceRateAdd: () => void;
  onPriceRateEdit: (id: string) => void;
  onRateRemove: (rateId: string) => void;
  onSubmit: (data: FormData) => void;
  onWeightRateAdd: () => void;
  onWeightRateEdit: (id: string) => void;
}

function warehouseToChoice(
  warehouse: Record<"id" | "name", string>
): MultiAutocompleteChoiceType {
  return {
    label: warehouse.name,
    value: warehouse.id
  };
}

const ShippingZoneDetailsPage: React.FC<ShippingZoneDetailsPageProps> = ({
  disabled,
  errors,
  onBack,
  onCountryAdd,
  onCountryRemove,
  onDelete,
  onPriceRateAdd,
  onPriceRateEdit,
  onRateRemove,
  onSubmit,
  onWeightRateAdd,
  onWeightRateEdit,
  saveButtonBarState,
  shippingZone,
  warehouses
}) => {
  const intl = useIntl();

  const initialForm: FormData = {
    name: shippingZone?.name || "",
    warehouses: shippingZone?.warehouses.map(warehouse => warehouse.id) || []
  };
  const [warehouseDisplayValues, setWarehouseDisplayValues] = useStateFromProps(
    shippingZone?.warehouses.map(warehouseToChoice)
  );

  const warehouseChoices = warehouses.map(warehouseToChoice);

  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ change, data, hasChanged, submit }) => {
        const handleWarehouseChange = createMultiAutocompleteSelectHandler(
          change,
          setWarehouseDisplayValues,
          warehouseDisplayValues,
          warehouseChoices
        );

        return (
          <Container>
            <AppHeader onBack={onBack}>
              <FormattedMessage defaultMessage="Shipping" />
            </AppHeader>
            <PageHeader title={shippingZone?.name} />
            <Grid>
              <div>
                <ShippingZoneInfo
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
                <CardSpacer />
                <CountryList
                  countries={shippingZone?.countries}
                  disabled={disabled}
                  emptyText={maybe(
                    () =>
                      shippingZone.default
                        ? intl.formatMessage({
                            defaultMessage:
                              "This is default shipping zone, which means that it covers all of the countries which are not assigned to other shipping zones"
                          })
                        : intl.formatMessage({
                            defaultMessage:
                              "Currently, there are no countries assigned to this shipping zone"
                          }),
                    "..."
                  )}
                  onCountryAssign={onCountryAdd}
                  onCountryUnassign={onCountryRemove}
                  title={intl.formatMessage({
                    defaultMessage: "Countries"
                  })}
                />
                <CardSpacer />
                <ShippingZoneRates
                  disabled={disabled}
                  onRateAdd={onPriceRateAdd}
                  onRateEdit={onPriceRateEdit}
                  onRateRemove={onRateRemove}
                  rates={maybe(() =>
                    shippingZone.shippingMethods.filter(
                      method => method.type === ShippingMethodTypeEnum.PRICE
                    )
                  )}
                  variant="price"
                />
                <CardSpacer />
                <ShippingZoneRates
                  disabled={disabled}
                  onRateAdd={onWeightRateAdd}
                  onRateEdit={onWeightRateEdit}
                  onRateRemove={onRateRemove}
                  rates={maybe(() =>
                    shippingZone.shippingMethods.filter(
                      method => method.type === ShippingMethodTypeEnum.WEIGHT
                    )
                  )}
                  variant="weight"
                />
              </div>
              <div>
                <ShippingZoneWarehouses
                  data={data}
                  displayValue={warehouseDisplayValues}
                  hasMore={false}
                  loading={false}
                  onChange={handleWarehouseChange}
                  onFetchMore={() => undefined}
                  warehouses={warehouseChoices}
                />
              </div>
            </Grid>
            <SaveButtonBar
              disabled={disabled || !hasChanged}
              onCancel={onBack}
              onDelete={onDelete}
              onSave={submit}
              state={saveButtonBarState}
            />
          </Container>
        );
      }}
    </Form>
  );
};
ShippingZoneDetailsPage.displayName = "ShippingZoneDetailsPage";
export default ShippingZoneDetailsPage;
