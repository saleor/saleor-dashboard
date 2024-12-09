// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import CountryList from "@dashboard/components/CountryList";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { CountryFragment, ShippingErrorFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { shippingZonesListUrl } from "@dashboard/shipping/urls";
import { useState } from "react";
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
    id: "55LMJv",
    defaultMessage: "Countries",
    description: "country list header",
  },
  createZone: {
    id: "6fxdUO",
    defaultMessage: "Create New Shipping Zone",
    description: "section header",
  },
  noCountriesAssigned: {
    id: "y7mfbl",
    defaultMessage: "Currently, there are no countries assigned to this shipping zone",
  },
});

export interface ShippingZoneCreatePageProps {
  countries: CountryFragment[];
  restWorldCountries: string[];
  disabled: boolean;
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit: (data: ShippingZoneCreateFormData) => SubmitPromise;
}

const ShippingZoneCreatePage = ({
  countries,
  restWorldCountries,
  disabled,
  errors,
  onSubmit,
  saveButtonBarState,
}: ShippingZoneCreatePageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const [isModalOpened, setModalStatus] = useState(false);
  const toggleModal = () => setModalStatus(!isModalOpened);
  const initialForm: ShippingZoneCreateFormData = {
    countries: [],
    description: "",
    name: "",
  };

  return (
    <Form confirmLeave initial={initialForm} onSubmit={onSubmit} disabled={disabled}>
      {({ change, data, isSaveDisabled, submit }) => (
        <DetailPageLayout gridTemplateColumns={1}>
          <TopNav href={shippingZonesListUrl()} title={intl.formatMessage(messages.createZone)} />
          <DetailPageLayout.Content>
            <div>
              <ShippingZoneInfo data={data} disabled={disabled} errors={errors} onChange={change} />
              <CardSpacer />
              <CountryList
                countries={data.countries.map(selectedCountry =>
                  countries.find(country => country.code === selectedCountry),
                )}
                disabled={disabled}
                emptyText={intl.formatMessage(messages.noCountriesAssigned)}
                onCountryAssign={toggleModal}
                onCountryUnassign={countryCode =>
                  change({
                    target: {
                      name: "countries",
                      value: data.countries.filter(country => country !== countryCode),
                    },
                  } as any)
                }
                title={intl.formatMessage(messages.countries)}
              />
            </div>

            <ShippingZoneCountriesAssignDialog
              open={isModalOpened}
              onConfirm={formData => {
                change({
                  target: {
                    name: "countries",
                    value: formData.countries,
                  },
                } as any);
                toggleModal();
              }}
              confirmButtonState="default"
              countries={countries}
              restWorldCountries={restWorldCountries}
              initial={data.countries}
              onClose={toggleModal}
            />
          </DetailPageLayout.Content>
          <Savebar>
            <Savebar.Spacer />
            <Savebar.CancelButton onClick={() => navigate(shippingZonesListUrl())} />
            <Savebar.ConfirmButton
              transitionState={saveButtonBarState}
              onClick={submit}
              disabled={isSaveDisabled}
            />
          </Savebar>
        </DetailPageLayout>
      )}
    </Form>
  );
};

ShippingZoneCreatePage.displayName = "ShippingZoneCreatePage";
export default ShippingZoneCreatePage;
