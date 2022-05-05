import { Container } from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import { CountryListQuery } from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { sectionNames } from "@saleor/intl";
import { Backlink, ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { maybe } from "../../../misc";
import CountryList from "../CountryList";
import TaxConfiguration from "../TaxConfiguration";

export interface TaxesConfigurationFormData {
  includeTax: boolean;
  showGross: boolean;
  chargeTaxesOnShipping: boolean;
}
export interface CountryListPageProps {
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  shop: CountryListQuery["shop"];
  onBack: () => void;
  onRowClick: (code: string) => void;
  onSubmit: (data: TaxesConfigurationFormData) => SubmitPromise;
  onTaxFetch: () => void;
}

const CountryListPage: React.FC<CountryListPageProps> = ({
  disabled,
  saveButtonBarState,
  shop,
  onBack,
  onRowClick,
  onSubmit,
  onTaxFetch
}) => {
  const intl = useIntl();

  const initialForm: TaxesConfigurationFormData = {
    chargeTaxesOnShipping: maybe(() => shop.chargeTaxesOnShipping, false),
    includeTax: maybe(() => shop.includeTaxesInPrices, false),
    showGross: maybe(() => shop.displayGrossPrices, false)
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
              {intl.formatMessage(sectionNames.configuration)}
            </Backlink>
            <PageHeader
              title={intl.formatMessage({
                id: "lnQAos",
                defaultMessage: "Taxes",
                description: "header"
              })}
            />
            <Grid variant="inverted">
              <div>
                <TaxConfiguration
                  data={data}
                  disabled={disabled}
                  onChange={event => change(event)}
                  onTaxFetch={onTaxFetch}
                />
              </div>
              <div>
                <CountryList
                  countries={maybe(() => shop.countries)}
                  onRowClick={onRowClick}
                />
              </div>
            </Grid>
          </Container>
          <Savebar
            disabled={isSaveDisabled}
            state={saveButtonBarState}
            onCancel={onBack}
            onSubmit={submit}
          />
        </>
      )}
    </Form>
  );
};
CountryListPage.displayName = "CountryListPage";
export default CountryListPage;
