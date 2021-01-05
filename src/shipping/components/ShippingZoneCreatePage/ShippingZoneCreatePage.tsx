import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import CountryList from "@saleor/components/CountryList";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { CountryFragment } from "@saleor/fragments/types/CountryFragment";
import { ShippingErrorFragment } from "@saleor/fragments/types/ShippingErrorFragment";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import ShippingZoneCountriesAssignDialog from "../ShippingZoneCountriesAssignDialog";
import ShippingZoneInfo from "../ShippingZoneInfo";

export interface FormData {
  countries: string[];
  default: boolean;
  description: string;
  name: string;
}

const MAX_DESCRIPTION_LENGTH = 300;

const useStyles = makeStyles(
  {
    label: {
      flex: 1
    },
    labelContainer: {
      "& span": {
        paddingRight: 30
      },
      display: "flex"
    }
  },
  { name: "ShippingZoneCreatePage" }
);

const messages = defineMessages({
  countries: {
    defaultMessage: "Countries",
    description: "countries"
  },
  createZone: {
    defaultMessage: "Create New Shipping Zone",
    description: "header"
  },
  defaultZone: {
    defaultMessage:
      "This is default shipping zone, which means that it covers all of the countries which are not assigned to other shipping zones",
    description: "default shipping zone"
  },
  description: {
    defaultMessage: "Description",
    description: "description"
  },
  descriptionMessage: {
    defaultMessage: "Description of a shipping zone.",
    description: "field placeholder"
  },
  noCountriesAssigned: {
    defaultMessage:
      "Currently, there are no countries assigned to this shipping zone",
    description: "no countries assigned to zone"
  },
  shipping: {
    defaultMessage: "Shipping",
    description: "shipping"
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
  const classes = useStyles({});
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
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.shipping)}
            </AppHeader>
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
                <TextField
                  error={data.description.length > MAX_DESCRIPTION_LENGTH}
                  name={"description"}
                  label={
                    <div className={classes.labelContainer}>
                      <div className={classes.label}>
                        <FormattedMessage {...messages.description} />
                      </div>
                      {data.description?.length > 0 && (
                        <span>
                          <FormattedMessage
                            defaultMessage="{numberOfCharacters} of {maxCharacters} characters"
                            description="character limit"
                            values={{
                              maxCharacters: MAX_DESCRIPTION_LENGTH,
                              numberOfCharacters: data.description.length
                            }}
                          />
                        </span>
                      )}
                    </div>
                  }
                  InputProps={{
                    inputProps: {
                      maxLength: MAX_DESCRIPTION_LENGTH
                    }
                  }}
                  value={data.description}
                  onChange={change}
                  disabled={disabled}
                  fullWidth
                  multiline
                  placeholder={intl.formatMessage(messages.descriptionMessage)}
                  rows={10}
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
            <SaveButtonBar
              disabled={disabled || !hasChanged}
              onCancel={onBack}
              onSave={submit}
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
