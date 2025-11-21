// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { CardTitle } from "@dashboard/components/CardTitle/CardTitle";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Grid from "@dashboard/components/Grid";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import VerticalSpacer from "@dashboard/components/VerticalSpacer";
import { configurationMenuUrl } from "@dashboard/configuration";
import {
  CountryCode,
  TaxClassRateInput,
  TaxCountryConfigurationFragment,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { parseQuery } from "@dashboard/orders/components/OrderCustomerAddressesEditDialog/utils";
import TaxPageTitle from "@dashboard/taxes/components/TaxPageTitle";
import { taxesMessages } from "@dashboard/taxes/messages";
import { isLastElement } from "@dashboard/taxes/utils/utils";
import { Card, CardContent, Divider, InputAdornment, TextField } from "@material-ui/core";
import {
  List,
  ListHeader,
  ListItem,
  ListItemCell,
  PageTab,
  PageTabs,
  SearchIcon,
} from "@saleor/macaw-ui";
import { Box, Skeleton } from "@saleor/macaw-ui-next";
import { Fragment, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TaxInput from "../../components/TaxInput";
import TaxCountriesForm from "./form";
import { useStyles } from "./styles";
import TaxCountriesMenu from "./TaxCountriesMenu";

interface TaxCountriesPageProps {
  countryTaxesData: TaxCountryConfigurationFragment[] | undefined;
  selectedCountryId: string;
  handleTabChange: (tab: string) => void;
  openDialog: (action?: string) => void;
  onSubmit: (input: TaxClassRateInput[]) => SubmitPromise;
  onDeleteConfiguration: (countryCode: CountryCode) => SubmitPromise;
  savebarState: ConfirmButtonTransitionState;
  disabled: boolean;
}

const TaxCountriesPage = (props: TaxCountriesPageProps) => {
  const {
    countryTaxesData,
    selectedCountryId,
    handleTabChange,
    openDialog,
    onSubmit,
    onDeleteConfiguration,
    savebarState,
    disabled,
  } = props;
  const intl = useIntl();
  const classes = useStyles();
  const navigate = useNavigator();
  const [query, setQuery] = useState("");
  const currentCountry = useMemo(
    () => countryTaxesData?.find(country => country.country.code === selectedCountryId),
    [selectedCountryId, countryTaxesData],
  );

  return (
    <TaxCountriesForm country={currentCountry} onSubmit={onSubmit} disabled={disabled}>
      {({ data, handlers, submit }) => {
        const filteredRates = data?.filter(
          rate => rate.label.search(new RegExp(parseQuery(query), "i")) >= 0,
        );

        return (
          <DetailPageLayout gridTemplateColumns={1}>
            <TopNav title={<TaxPageTitle />} href={configurationMenuUrl} />
            <DetailPageLayout.Content>
              <Box padding={6}>
                <PageTabs value="countries" onChange={handleTabChange}>
                  <PageTab
                    label={intl.formatMessage(taxesMessages.channelsSection)}
                    value="channels"
                    data-test-id="channels-tab"
                  />
                  <PageTab
                    label={intl.formatMessage(taxesMessages.countriesSection)}
                    value="countries"
                    data-test-id="countries-tab"
                  />
                  <PageTab
                    label={intl.formatMessage(taxesMessages.taxClassesSection)}
                    value="tax-classes"
                    data-test-id="tax-classes-tab"
                  />
                </PageTabs>
                <VerticalSpacer spacing={2} />
                <Grid variant="inverted">
                  <TaxCountriesMenu
                    configurations={countryTaxesData}
                    selectedCountryId={selectedCountryId}
                    onCountryDelete={onDeleteConfiguration}
                    onCountryAdd={() => openDialog("add-country")}
                  />
                  <Card>
                    <CardTitle
                      title={
                        currentCountry ? (
                          intl.formatMessage(taxesMessages.taxClassRatesHeader, {
                            country: currentCountry?.country?.country,
                          })
                        ) : (
                          <Skeleton />
                        )
                      }
                    />
                    {countryTaxesData?.length === 0 ? (
                      <CardContent className={classes.greyText}>
                        <FormattedMessage {...taxesMessages.addCountryToAccessClass} />
                      </CardContent>
                    ) : (
                      <>
                        <CardContent>
                          <TextField
                            data-test-id="search-tax-class-input"
                            value={query}
                            variant="outlined"
                            onChange={e => setQuery(e.target.value)}
                            placeholder={intl.formatMessage(taxesMessages.searchTaxClasses)}
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                  />
                                </InputAdornment>
                              ),
                            }}
                            inputProps={{ className: classes.inputPadding }}
                          />
                        </CardContent>
                        <List gridTemplate={["5fr 2fr"]}>
                          <ListHeader>
                            <ListItem>
                              <ListItemCell>
                                <FormattedMessage {...taxesMessages.taxNameHeader} />
                              </ListItemCell>
                              <ListItemCell className={classes.right}>
                                <FormattedMessage {...taxesMessages.taxRateHeader} />
                              </ListItemCell>
                            </ListItem>
                          </ListHeader>
                          <Divider />
                          {filteredRates?.map((rate, rateIndex) => (
                            <Fragment key={rate.id}>
                              <ListItem
                                hover={false}
                                className={classes.noDivider}
                                data-test-id={rate.label}
                              >
                                <ListItemCell>{rate.label}</ListItemCell>
                                <ListItemCell>
                                  <TaxInput
                                    placeholder={data[0]?.rate}
                                    value={rate?.value}
                                    change={e => handlers.handleRateChange(rate.id, e.target.value)}
                                  />
                                </ListItemCell>
                              </ListItem>
                              {!isLastElement(filteredRates, rateIndex) && <Divider />}
                            </Fragment>
                          )) ?? <Skeleton />}
                        </List>
                      </>
                    )}
                  </Card>
                </Grid>
              </Box>
              <Savebar>
                <Savebar.Spacer />
                <Savebar.CancelButton onClick={() => navigate(configurationMenuUrl)} />
                <Savebar.ConfirmButton
                  transitionState={savebarState}
                  onClick={submit}
                  disabled={disabled}
                />
              </Savebar>
            </DetailPageLayout.Content>
          </DetailPageLayout>
        );
      }}
    </TaxCountriesForm>
  );
};

export default TaxCountriesPage;
