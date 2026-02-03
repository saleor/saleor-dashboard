import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { CardTitle } from "@dashboard/components/CardTitle/CardTitle";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Grid from "@dashboard/components/Grid";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import { Savebar } from "@dashboard/components/Savebar";
import { TablePagination } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import VerticalSpacer from "@dashboard/components/VerticalSpacer";
import { configurationMenuUrl } from "@dashboard/configuration";
import { TaxClassFragment } from "@dashboard/graphql";
import { useClientPagination } from "@dashboard/hooks/useClientPagination/useClientPagination";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getById } from "@dashboard/misc";
import { parseQuery } from "@dashboard/orders/components/OrderCustomerAddressesEditDialog/utils";
import TaxPageTitle from "@dashboard/taxes/components/TaxPageTitle";
import { taxesMessages } from "@dashboard/taxes/messages";
import { TaxClassesPageFormData } from "@dashboard/taxes/types";
import { useAutofocus } from "@dashboard/taxes/utils/useAutofocus";
import { getFormErrors } from "@dashboard/utils/errors";
import getTaxesErrorMessage from "@dashboard/utils/errors/taxes";
import { Card, CardContent, TableBody, TableCell, TableHead, TextField } from "@material-ui/core";
import { PageTab, PageTabs } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui-next";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TaxInput from "../../components/TaxInput";
import TaxClassesForm from "./form";
import { useStyles } from "./styles";
import { TaxClassesMenu } from "./TaxClassesMenu";

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

const TaxClassesPage = (props: TaxClassesPageProps) => {
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
  const [query, setQuery] = useState("");
  const {
    rowNumber,
    currentPage,
    paginate,
    restartPagination,
    changeCurrentPage,
    changeRowNumber,
  } = useClientPagination();
  const currentTaxClass = useMemo(
    () => taxClasses?.find(getById(selectedTaxClassId)),
    [selectedTaxClassId, taxClasses],
  );
  const nameInputRef = useAutofocus(currentTaxClass?.id === "new", [currentTaxClass?.id]);

  useEffect(() => {
    restartPagination();
  }, [query, restartPagination]);

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
        const { data: paginatedRates, hasNextPage, hasPreviousPage } = paginate(filteredRates);
        const formErrors = getFormErrors(["name"], validationErrors);

        return (
          <DetailPageLayout gridTemplateColumns={1}>
            <TopNav title={<TaxPageTitle />} href={configurationMenuUrl} />
            <DetailPageLayout.Content>
              <Box padding={6}>
                <PageTabs value="tax-classes" onChange={handleTabChange}>
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
                  <TaxClassesMenu
                    taxClasses={taxClasses}
                    selectedTaxClassId={selectedTaxClassId}
                    onTaxClassDelete={onTaxClassDelete}
                    onCreateNew={onCreateNewButtonClick}
                  />
                  {currentTaxClass && (
                    <div>
                      <Card>
                        <CardTitle title={intl.formatMessage(taxesMessages.generalInformation)} />
                        <CardContent>
                          <TextField
                            value={data?.name}
                            onChange={change}
                            name="name"
                            data-test-id="class-name-input"
                            variant="outlined"
                            placeholder={intl.formatMessage(taxesMessages.taxRateName)}
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
                        <CardTitle title={intl.formatMessage(taxesMessages.taxClassRates)} />
                        {currentTaxClass?.countries.length === 0 ? (
                          <CardContent className={classes.supportText}>
                            <FormattedMessage
                              {...taxesMessages.noRatesInTaxClass}
                              values={{
                                tab: <b>{intl.formatMessage(taxesMessages.countriesSection)}</b>,
                              }}
                            />
                          </CardContent>
                        ) : (
                          <CardContent>
                            <ResponsiveTable
                              search={{
                                placeholder: intl.formatMessage(taxesMessages.searchTaxCountries),
                                initialValue: query,
                                onSearchChange: setQuery,
                              }}
                              filteredItemsCount={filteredRates.length}
                              footer={
                                <TablePagination
                                  rowNumber={rowNumber}
                                  onRowNumberChange={changeRowNumber}
                                  hasNextPage={hasNextPage}
                                  hasPreviousPage={hasPreviousPage}
                                  onNextPage={() => changeCurrentPage(currentPage + 1)}
                                  onPreviousPage={() => changeCurrentPage(currentPage - 1)}
                                />
                              }
                            >
                              <TableHead>
                                <TableRowLink>
                                  <TableCell>
                                    <FormattedMessage {...taxesMessages.countryNameHeader} />
                                  </TableCell>
                                  <TableCell>
                                    <FormattedMessage {...taxesMessages.taxRateHeader} />
                                  </TableCell>
                                </TableRowLink>
                              </TableHead>
                              <TableBody>
                                {paginatedRates?.map(countryRate => (
                                  <TableRowLink key={countryRate.id} data-test-id="country-rows">
                                    <TableCell>{countryRate.label}</TableCell>
                                    <TableCell>
                                      <TaxInput
                                        value={countryRate.value}
                                        change={e =>
                                          handlers.handleRateChange(countryRate.id, e.target.value)
                                        }
                                      />
                                    </TableCell>
                                  </TableRowLink>
                                ))}
                              </TableBody>
                            </ResponsiveTable>
                          </CardContent>
                        )}
                      </Card>
                      <VerticalSpacer spacing={3} />
                      <Metadata data={data} onChange={handlers.changeMetadata} />
                    </div>
                  )}
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
    </TaxClassesForm>
  );
};

export default TaxClassesPage;
