import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import CountryList from "@saleor/components/CountryList";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import { CountryFragment } from "@saleor/fragments/types/CountryFragment";
import { ShippingErrorFragment } from "@saleor/fragments/types/ShippingErrorFragment";
import { sectionNames } from "@saleor/intl";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import ShippingZoneCountriesAssignDialog from "../ShippingZoneCountriesAssignDialog";
import ShippingZoneInfo from "../ShippingZoneInfo";

export interface FormData {
  countries: string[];
  default: boolean;
  description: string;
  name: string;
}

const messages = defineMessages({
  countries: {
    defaultMessage: "Countries",
    description: "country list header"
  },
  createZone: {
    defaultMessage: "Create New Shipping Zone",
    description: "section header"
  },
  defaultZone: {
    defaultMessage:
      "This is default shipping zone, which means that it covers all of the countries which are not assigned to other shipping zones"
  },
  noCountriesAssigned: {
    defaultMessage:
      "Currently, there are no countries assigned to this shipping zone"
  }
});

export interface ShippingZoneCreatePageProps {
  countries: CountryFragment[];
  disabled: boolean;
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: FormData) => void;
}

const ShippingZoneCreatePage: React.FC<ShippingZoneCreatePageProps> = ({
  countries,
  disabled,
  errors,
  onBack,
  onSubmit,
  saveButtonBarState
}) => {
  const intl = useIntl();
  const [isModalOpened, setModalStatus] = React.useState(false);
  const toggleModal = () => setModalStatus(!isModalOpened);

  const initialForm: FormData = {
    countries: [],
    default: false,
    description: "",
    name: ""
  };

  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ change, data, hasChanged, submit }) => (
        <>
          <Container>
            <Backlink onBack={onBack}>
              {intl.formatMessage(sectionNames.shipping)}
            </Backlink>
            <PageHeader title={intl.formatMessage(messages.createZone)} />
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
                  countries={data.countries.map(selectedCountry =>
                    countries.find(country => country.code === selectedCountry)
                  )}
                  disabled={disabled}
                  emptyText={
                    data.default
                      ? intl.formatMessage(messages.defaultZone)
                      : intl.formatMessage(messages.noCountriesAssigned)
                  }
                  onCountryAssign={toggleModal}
                  onCountryUnassign={countryCode =>
                    change({
                      target: {
                        name: "countries",
                        value: data.countries.filter(
                          country => country !== countryCode
                        )
                      }
                    } as any)
                  }
                  title={intl.formatMessage(messages.countries)}
                />
              </div>
            </Grid>
            <Savebar
              disabled={disabled || !hasChanged}
              onCancel={onBack}
              onSubmit={submit}
              state={saveButtonBarState}
            />
          </Container>
          <ShippingZoneCountriesAssignDialog
            open={isModalOpened}
            onConfirm={formData => {
              change({
                target: {
                  name: "countries",
                  value: formData.restOfTheWorld ? [] : formData.countries
                }
              } as any);
              toggleModal();
            }}
            confirmButtonState="default"
            countries={countries}
            initial={data.countries}
            isDefault={data.default}
            onClose={toggleModal}
          />
        </>
      )}
    </Form>
  );
};
ShippingZoneCreatePage.displayName = "ShippingZoneCreatePage";
export default ShippingZoneCreatePage;
