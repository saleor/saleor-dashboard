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
  TaxClassCreateInput,
  TaxClassFragment,
  TaxClassUpdateInput,
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
  PageTab,
  PageTabs,
  SearchIcon,
} from "@saleor/macaw-ui";
import { parseQuery } from "@saleor/orders/components/OrderCustomerAddressesEditDialog/utils";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import { taxesMessages } from "@saleor/taxes/messages";
import { getDefaultTaxRateInCountry } from "@saleor/taxes/utils/utils";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TaxInput from "../../components/TaxInput";
import TaxClassesForm from "./form";
import { useStyles } from "./styles";
import TaxClassesMenu from "./TaxClassesMenu";

interface TaxClassesPageProps {
  taxClasses: TaxClassFragment[] | undefined;
  selectedTaxClassId: string;
  handleTabChange: (tab: string) => void;
  savebarState: ConfirmButtonTransitionState;
  disabled: boolean;
  onCreateNewButtonClick: () => void;
  onTaxClassDelete: (id: string) => SubmitPromise;
  onTaxClassCreate: (input: TaxClassCreateInput) => SubmitPromise;
  onTaxClassUpdate: (id: string, input: TaxClassUpdateInput) => SubmitPromise;
}

export const TaxClassesPage: React.FC<TaxClassesPageProps> = props => {
  const {
    taxClasses,
    selectedTaxClassId,
    handleTabChange,
    savebarState,
    disabled,
    onCreateNewButtonClick,
    onTaxClassDelete,
    onTaxClassCreate,
    onTaxClassUpdate,
  } = props;
  const intl = useIntl();
  const navigate = useNavigator();
  const classes = useStyles();

  const [query, setQuery] = React.useState("");

  const currentTaxClass = React.useMemo(
    () => taxClasses?.find(getById(selectedTaxClassId)),
    [selectedTaxClassId, taxClasses],
  );

  return (
    <TaxClassesForm
      taxClass={currentTaxClass}
      onTaxClassCreate={onTaxClassCreate}
      onTaxClassUpdate={onTaxClassUpdate}
      disabled={disabled}
    >
      {({ data, handlers, submit, change }) => {
        const filteredRates = data.updateTaxClassRates.filter(
          rate => rate.label.search(new RegExp(parseQuery(query), "i")) >= 0,
        );

        return (
          <Container>
            <PageHeader title={intl.formatMessage(sectionNames.taxes)} />
            <PageTabs value="tax-classes" onChange={handleTabChange}>
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
              <TaxClassesMenu
                taxClasses={taxClasses}
                selectedTaxClassId={selectedTaxClassId}
                onTaxClassDelete={onTaxClassDelete}
                onCreateNew={onCreateNewButtonClick}
              />
              <div>
                <Card>
                  <CardTitle
                    title={intl.formatMessage(taxesMessages.generalInformation)}
                  />
                  <CardContent>
                    <TextField
                      value={data?.name}
                      onChange={change}
                      name="name"
                      variant="outlined"
                      placeholder={intl.formatMessage(
                        taxesMessages.taxRateName,
                      )}
                      fullWidth
                      inputProps={{ className: classes.namePadding }}
                    />
                  </CardContent>
                </Card>
                <VerticalSpacer spacing={3} />
                <Card>
                  <CardTitle
                    title={intl.formatMessage(taxesMessages.taxClassRates)}
                  />
                  {currentTaxClass?.countries.length === 0 ? (
                    <CardContent className={classes.supportText}>
                      <FormattedMessage {...taxesMessages.noRatesInTaxClass} />
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
                          inputProps={{ className: classes.searchPadding }}
                        />
                      </CardContent>
                      <List gridTemplate={["5fr 2fr"]}>
                        <ListHeader>
                          <ListItem>
                            <ListItemCell>
                              <FormattedMessage
                                {...taxesMessages.countryNameHeader}
                              />
                            </ListItemCell>
                            <ListItemCell>
                              <FormattedMessage
                                {...taxesMessages.taxRateHeader}
                              />
                            </ListItemCell>
                          </ListItem>
                        </ListHeader>
                        {filteredRates?.map(countryRate => (
                          <ListItem key={countryRate.id} hover={false}>
                            <ListItemCell>{countryRate.label}</ListItemCell>
                            <ListItemCell>
                              <TaxInput
                                placeholder={getDefaultTaxRateInCountry().toString()}
                                value={countryRate.value}
                                change={e =>
                                  handlers.handleRateChange(
                                    countryRate.id,
                                    e.target.value,
                                  )
                                }
                              />
                            </ListItemCell>
                          </ListItem>
                        )) ?? (
                          <>
                            <Skeleton />
                            <VerticalSpacer />
                          </>
                        )}
                      </List>
                    </>
                  )}
                </Card>
              </div>
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
    </TaxClassesForm>
  );
};

export default TaxClassesPage;
