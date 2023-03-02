import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardTitle from "@dashboard/components/CardTitle";
import Grid from "@dashboard/components/Grid";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import Skeleton from "@dashboard/components/Skeleton";
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
import {
  Card,
  CardContent,
  Divider,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import {
  ConfirmButtonTransitionState,
  List,
  ListHeader,
  ListItem,
  ListItemCell,
  PageTab,
  PageTabs,
  SearchIcon,
} from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TaxInput from "../../components/TaxInput";
import TaxCountriesForm from "./form";
import { useStyles } from "./styles";
import TaxCountriesMenu from "./TaxCountriesMenu";

export interface TaxCountriesPageProps {
  countryTaxesData: TaxCountryConfigurationFragment[] | undefined;
  selectedCountryId: string;
  handleTabChange: (tab: string) => void;
  openDialog: (action?: string) => void;
  onSubmit: (input: TaxClassRateInput[]) => SubmitPromise;
  onDeleteConfiguration: (countryCode: CountryCode) => SubmitPromise;
  savebarState: ConfirmButtonTransitionState;
  disabled: boolean;
}

export const TaxCountriesPage: React.FC<TaxCountriesPageProps> = props => {
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

  const [query, setQuery] = React.useState("");

  const currentCountry = React.useMemo(
    () =>
      countryTaxesData?.find(
        country => country.country.code === selectedCountryId,
      ),
    [selectedCountryId, countryTaxesData],
  );

  return (
    <TaxCountriesForm
      country={currentCountry}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ data, handlers, submit }) => {
        const filteredRates = data?.filter(
          rate => rate.label.search(new RegExp(parseQuery(query), "i")) >= 0,
        );

        return (
          <DetailPageLayout gridTemplateColumns={1}>
            <TopNav title={<TaxPageTitle />} />
            <DetailPageLayout.Content>
              <Box padding={9}>
                <PageTabs value="countries" onChange={handleTabChange}>
                  <PageTab
                    label={intl.formatMessage(taxesMessages.channelsSection)}
                    value="channels"
                  />
                  <PageTab
                    label={intl.formatMessage(taxesMessages.countriesSection)}
                    value="countries"
                  />
                  <PageTab
                    label={intl.formatMessage(taxesMessages.taxClassesSection)}
                    value="tax-classes"
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
                          intl.formatMessage(
                            taxesMessages.taxClassRatesHeader,
                            {
                              country: currentCountry?.country?.country,
                            },
                          )
                        ) : (
                          <Skeleton />
                        )
                      }
                    />
                    {countryTaxesData?.length === 0 ? (
                      <CardContent className={classes.greyText}>
                        <FormattedMessage
                          {...taxesMessages.addCountryToAccessClass}
                        />
                      </CardContent>
                    ) : (
                      <>
                        <CardContent>
                          <TextField
                            value={query}
                            variant="outlined"
                            onChange={e => setQuery(e.target.value)}
                            placeholder={intl.formatMessage(
                              taxesMessages.searchTaxClasses,
                            )}
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon />
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
                                <FormattedMessage
                                  {...taxesMessages.taxNameHeader}
                                />
                              </ListItemCell>
                              <ListItemCell className={classes.right}>
                                <FormattedMessage
                                  {...taxesMessages.taxRateHeader}
                                />
                              </ListItemCell>
                            </ListItem>
                          </ListHeader>
                          <Divider />
                          {filteredRates?.map((rate, rateIndex) => (
                            <React.Fragment key={rate.id}>
                              <ListItem
                                hover={false}
                                className={classes.noDivider}
                              >
                                <ListItemCell>{rate.label}</ListItemCell>
                                <ListItemCell>
                                  <TaxInput
                                    placeholder={data[0]?.rate}
                                    value={rate?.value}
                                    change={e =>
                                      handlers.handleRateChange(
                                        rate.id,
                                        e.target.value,
                                      )
                                    }
                                  />
                                </ListItemCell>
                              </ListItem>
                              {!isLastElement(filteredRates, rateIndex) && (
                                <Divider />
                              )}
                            </React.Fragment>
                          )) ?? <Skeleton />}
                        </List>
                      </>
                    )}
                  </Card>
                </Grid>
              </Box>
              <Savebar
                state={savebarState}
                disabled={disabled}
                onSubmit={submit}
                onCancel={() => navigate(configurationMenuUrl)}
              />
            </DetailPageLayout.Content>
          </DetailPageLayout>
        );
      }}
    </TaxCountriesForm>
  );
};

export default TaxCountriesPage;
