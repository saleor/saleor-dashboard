// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import Checkbox from "@dashboard/components/Checkbox";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import Hr from "@dashboard/components/Hr";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { CountryWithCodeFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { fuzzySearch } from "@dashboard/misc";
import useScrollableDialogStyle from "@dashboard/styles/useScrollableDialogStyle";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableBody,
  TableCell,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

interface FormData {
  allCountries: boolean;
  countries: string[];
  query: string;
}

export interface DiscountCountrySelectDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  countries: CountryWithCodeFragment[];
  initial: string[];
  open: boolean;
  onClose: () => void;
  onConfirm: (data: FormData) => SubmitPromise;
}

const DiscountCountrySelectDialog: React.FC<DiscountCountrySelectDialogProps> = props => {
  const { confirmButtonState, onClose, countries, open, initial, onConfirm } = props;
  const classes = useStyles(props);
  const scrollableDialogClasses = useScrollableDialogStyle();
  const intl = useIntl();
  const initialForm: FormData = {
    allCountries: true,
    countries: initial,
    query: "",
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <Form initial={initialForm} onSubmit={onConfirm} className={scrollableDialogClasses.form}>
        {({ data, change }) => {
          const countrySelectionMap = countries.reduce((acc, country) => {
            acc[country.code] = !!data.countries.find(
              selectedCountries => selectedCountries === country.code,
            );

            return acc;
          }, {});

          return (
            <>
              <DialogTitle disableTypography>
                <FormattedMessage
                  id="cvVIV/"
                  defaultMessage="Assign Countries"
                  description="dialog header"
                />
              </DialogTitle>
              <DialogContent>
                <Typography>
                  <FormattedMessage
                    id="dWK/Ck"
                    defaultMessage="Choose countries, you want voucher to be limited to, from the list below"
                  />
                </Typography>
                <FormSpacer />
                <TextField
                  name="query"
                  value={data.query}
                  onChange={event => change(event)}
                  label={intl.formatMessage({
                    id: "8EGagh",
                    defaultMessage: "Filter Countries",
                    description: "search box label",
                  })}
                  placeholder={intl.formatMessage({
                    id: "dGqEJ9",
                    defaultMessage: "Search by country name",
                    description: "search box placeholder",
                  })}
                  fullWidth
                />
                <FormSpacer />
                <Hr />
                <FormSpacer />
                <Typography variant="subtitle1">
                  <FormattedMessage
                    id="wgA48T"
                    defaultMessage="Countries A to Z"
                    description="country selection"
                  />
                </Typography>
              </DialogContent>
              <DialogContent className={scrollableDialogClasses.scrollArea}>
                <ResponsiveTable>
                  <TableBody>
                    {fuzzySearch(countries, data.query, ["country"]).map(country => {
                      const isChecked = countrySelectionMap[country.code];

                      return (
                        <TableRowLink key={country.code}>
                          <TableCell className={classes.wideCell}>{country.country}</TableCell>
                          <TableCell padding="checkbox" className={classes.checkboxCell}>
                            <Checkbox
                              checked={isChecked}
                              onChange={() =>
                                isChecked
                                  ? change({
                                      target: {
                                        name: "countries" as keyof FormData,
                                        value: data.countries.filter(
                                          selectedCountries => selectedCountries !== country.code,
                                        ),
                                      },
                                    } as any)
                                  : change({
                                      target: {
                                        name: "countries" as keyof FormData,
                                        value: [...data.countries, country.code],
                                      },
                                    } as any)
                              }
                            />
                          </TableCell>
                        </TableRowLink>
                      );
                    })}
                  </TableBody>
                </ResponsiveTable>
              </DialogContent>
              <DialogActions>
                <BackButton onClick={onClose} />
                <ConfirmButton transitionState={confirmButtonState} type="submit">
                  <FormattedMessage
                    id="zZCCqz"
                    defaultMessage="Assign countries"
                    description="button"
                  />
                </ConfirmButton>
              </DialogActions>
            </>
          );
        }}
      </Form>
    </Dialog>
  );
};

DiscountCountrySelectDialog.displayName = "DiscountCountrySelectDialog";
export default DiscountCountrySelectDialog;
