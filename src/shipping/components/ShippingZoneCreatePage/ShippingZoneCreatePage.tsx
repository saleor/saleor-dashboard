import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import CountryList from "@saleor/components/CountryList";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import { CountryFragment, ShippingErrorFragment } from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { sectionNames } from "@saleor/intl";
import { Backlink, ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import ShippingZoneCountriesAssignDialog from "../ShippingZoneCountriesAssignDialog";
import ShippingZoneInfo from "../ShippingZoneInfo";

export interface ShippingZoneCreateFormData {
  countries: string[];
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
  noCountriesAssigned: {
    defaultMessage:
      "Currently, there are no countries assigned to this shipping zone"
  }
});

export interface ShippingZoneCreatePageProps {
  countries: CountryFragment[];
  restWorldCountries: string[];
  disabled: boolean;
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: ShippingZoneCreateFormData) => SubmitPromise;
}

const ShippingZoneCreatePage: React.FC<ShippingZoneCreatePageProps> = ({
  countries,
  restWorldCountries,
  disabled,
  errors,
  onBack,
  onSubmit,
  saveButtonBarState
}) => {
  const intl = useIntl();
  const [isModalOpened, setModalStatus] = React.useState(false);
  const toggleModal = () => setModalStatus(!isModalOpened);

  const initialForm: ShippingZoneCreateFormData = {
    countries: [],
    description: "",
    name: ""
  };

  return (
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ change, data, isSaveDisabled, submit }) => (
        <>
          <Container>
            <Backlink onClick={onBack}>
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
                  emptyText={intl.formatMessage(messages.noCountriesAssigned)}
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
              disabled={isSaveDisabled}
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
                  value: formData.countries
                }
              } as any);
              toggleModal();
            }}
            confirmButtonState="default"
            countries={countries}
            restWorldCountries={restWorldCountries}
            initial={data.countries}
            onClose={toggleModal}
          />
        </>
      )}
    </Form>
  );
};
ShippingZoneCreatePage.displayName = "ShippingZoneCreatePage";
export default ShippingZoneCreatePage;
