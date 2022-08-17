import {
  Card,
  CardContent,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import Skeleton from "@saleor/components/Skeleton";
import { configurationMenuUrl } from "@saleor/configuration";
import {
  CountryCode,
  TaxClassRateInput,
  TaxCountryConfigurationFragment,
} from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import {
  ConfirmButtonTransitionState,
  List,
  ListHeader,
  ListItem,
  ListItemCell,
  makeStyles,
  PageTab,
  PageTabs,
  SearchIcon,
} from "@saleor/macaw-ui";
import { parseQuery } from "@saleor/orders/components/OrderCustomerAddressesEditDialog/utils";
import { taxesMessages } from "@saleor/taxes/messages";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TaxInput from "../../components/TaxInput";
import TaxCountriesForm from "./form";
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

const useStyles = makeStyles(
  theme => ({
    inputPadding: {
      padding: "16px 0 16px 0",
    },
    greyText: {
      color: theme.palette.text.hint,
    },
  }),
  { name: "TaxCountriesPage" },
);

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
          <Container>
            <PageHeader title={intl.formatMessage(sectionNames.taxes)} />
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
                  title={intl.formatMessage(taxesMessages.taxClassRatesHeader)}
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
                          <ListItemCell>
                            <FormattedMessage
                              {...taxesMessages.taxRateHeader}
                            />
                          </ListItemCell>
                        </ListItem>
                      </ListHeader>
                      {filteredRates?.map(rate => (
                        <ListItem key={rate.id} hover={false}>
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
                      )) ?? <Skeleton />}
                    </List>
                  </>
                )}
              </Card>
            </Grid>
            <Savebar
              state={savebarState}
              disabled={disabled}
              onSubmit={submit}
              onCancel={() => navigate(configurationMenuUrl)}
            />
          </Container>
        );
      }}
    </TaxCountriesForm>
  );
};

export default TaxCountriesPage;
