import { Backlink } from "@saleor/components/Backlink";
import { Container } from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import { configurationMenuUrl } from "@saleor/configuration";
import { CountryListQuery } from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
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
  onSubmit: (data: TaxesConfigurationFormData) => SubmitPromise;
  onTaxFetch: () => void;
}

const CountryListPage: React.FC<CountryListPageProps> = ({
  disabled,
  saveButtonBarState,
  shop,
  onSubmit,
  onTaxFetch,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const initialForm: TaxesConfigurationFormData = {
    chargeTaxesOnShipping: maybe(() => shop.chargeTaxesOnShipping, false),
    includeTax: maybe(() => shop.includeTaxesInPrices, false),
    showGross: maybe(() => shop.displayGrossPrices, false),
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
            <Backlink href={configurationMenuUrl}>
              {intl.formatMessage(sectionNames.configuration)}
            </Backlink>
            <PageHeader
              title={intl.formatMessage({
                id: "lnQAos",
                defaultMessage: "Taxes",
                description: "header",
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
                <CountryList countries={maybe(() => shop.countries)} />
              </div>
            </Grid>
          </Container>
          <Savebar
            disabled={isSaveDisabled}
            state={saveButtonBarState}
            onCancel={() => navigate(configurationMenuUrl)}
            onSubmit={submit}
          />
        </>
      )}
    </Form>
  );
};
CountryListPage.displayName = "CountryListPage";
export default CountryListPage;
