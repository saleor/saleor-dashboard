import VerticalSpacer from "@dashboard/apps/components/VerticalSpacer";
import CardTitle from "@dashboard/components/CardTitle";
import Container from "@dashboard/components/Container";
import Grid from "@dashboard/components/Grid";
import Metadata from "@dashboard/components/Metadata";
import PageHeader from "@dashboard/components/PageHeader";
import Savebar from "@dashboard/components/Savebar";
import Skeleton from "@dashboard/components/Skeleton";
import { configurationMenuUrl } from "@dashboard/configuration";
import { TaxClassFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getById } from "@dashboard/misc";
import { parseQuery } from "@dashboard/orders/components/OrderCustomerAddressesEditDialog/utils";
import TaxPageTitle from "@dashboard/taxes/components/TaxPageTitle";
import { taxesMessages } from "@dashboard/taxes/messages";
import { TaxClassesPageFormData } from "@dashboard/taxes/types";
import { useAutofocus } from "@dashboard/taxes/utils/useAutofocus";
import { isLastElement } from "@dashboard/taxes/utils/utils";
import { getFormErrors } from "@dashboard/utils/errors";
import getTaxesErrorMessage from "@dashboard/utils/errors/taxes";
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
  onTaxClassCreate: (data: TaxClassesPageFormData) => SubmitPromise;
  onTaxClassUpdate: (data: TaxClassesPageFormData) => SubmitPromise;
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

  const nameInputRef = useAutofocus(currentTaxClass?.id === "new", [
    currentTaxClass?.id,
  ]);

  return (
    <TaxClassesForm
      taxClass={currentTaxClass}
      onTaxClassCreate={onTaxClassCreate}
      onTaxClassUpdate={onTaxClassUpdate}
      disabled={disabled}
    >
      {({ data, validationErrors, handlers, submit, change }) => {
        const filteredRates = data.updateTaxClassRates.filter(
          rate => rate.label.search(new RegExp(parseQuery(query), "i")) >= 0,
        );

        const formErrors = getFormErrors(["name"], validationErrors);

        return (
          <Container>
            <PageHeader title={<TaxPageTitle />} />
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
              {taxClasses?.length !== 0 && (
                <div>
                  <Card>
                    <CardTitle
                      title={intl.formatMessage(
                        taxesMessages.generalInformation,
                      )}
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
                        inputRef={nameInputRef}
                        error={!!formErrors.name}
                        helperText={getTaxesErrorMessage(formErrors.name, intl)}
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
                        <FormattedMessage
                          {...taxesMessages.noRatesInTaxClass}
                          values={{
                            tab: (
                              <b>
                                {intl.formatMessage(
                                  taxesMessages.countriesSection,
                                )}
                              </b>
                            ),
                          }}
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
                              <ListItemCell className={classes.right}>
                                <FormattedMessage
                                  {...taxesMessages.taxRateHeader}
                                />
                              </ListItemCell>
                            </ListItem>
                          </ListHeader>
                          <Divider />
                          {filteredRates?.map(
                            (countryRate, countryRateIndex) => (
                              <React.Fragment key={countryRate.id}>
                                <ListItem
                                  hover={false}
                                  className={classes.noDivider}
                                >
                                  <ListItemCell>
                                    {countryRate.label}
                                  </ListItemCell>
                                  <ListItemCell>
                                    <TaxInput
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
                                {!isLastElement(
                                  filteredRates,
                                  countryRateIndex,
                                ) && <Divider />}
                              </React.Fragment>
                            ),
                          ) ?? (
                            <>
                              <Skeleton />
                              <VerticalSpacer />
                            </>
                          )}
                        </List>
                      </>
                    )}
                  </Card>
                  <VerticalSpacer spacing={3} />
                  <Metadata data={data} onChange={handlers.changeMetadata} />
                </div>
              )}
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
