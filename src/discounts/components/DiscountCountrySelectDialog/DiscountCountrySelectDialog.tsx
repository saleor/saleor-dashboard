import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography
} from "@material-ui/core";
import Checkbox from "@saleor/components/Checkbox";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { ShopInfo_shop_countries } from "@saleor/components/Shop/types/ShopInfo";
import { buttonMessages } from "@saleor/intl";
import { Button } from "@saleor/macaw-ui";
import useScrollableDialogStyle from "@saleor/styles/useScrollableDialogStyle";
import { filter } from "fuzzaldrin";
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
  countries: ShopInfo_shop_countries[];
  initial: string[];
  open: boolean;
  onClose: () => void;
  onConfirm: (data: FormData) => void;
}

const DiscountCountrySelectDialog: React.FC<DiscountCountrySelectDialogProps> = props => {
  const {
    confirmButtonState,
    onClose,
    countries,
    open,
    initial,
    onConfirm
  } = props;
  const classes = useStyles(props);
  const scrollableDialogClasses = useScrollableDialogStyle();

  const intl = useIntl();

  const initialForm: FormData = {
    allCountries: true,
    countries: initial,
    query: ""
  };
  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <Form
        initial={initialForm}
        onSubmit={onConfirm}
        className={scrollableDialogClasses.form}
      >
        {({ data, change }) => {
          const countrySelectionMap = countries.reduce((acc, country) => {
            acc[country.code] = !!data.countries.find(
              selectedCountries => selectedCountries === country.code
            );
            return acc;
          }, {});

          return (
            <>
              <DialogTitle>
                <FormattedMessage
                  defaultMessage="Assign Countries"
                  description="dialog header"
                />
              </DialogTitle>
              <DialogContent>
                <Typography>
                  <FormattedMessage defaultMessage="Choose countries, you want voucher to be limited to, from the list below" />
                </Typography>
                <FormSpacer />
                <TextField
                  name="query"
                  value={data.query}
                  onChange={event => change(event, () => fetch(data.query))}
                  label={intl.formatMessage({
                    defaultMessage: "Filter Countries",
                    description: "search box label"
                  })}
                  placeholder={intl.formatMessage({
                    defaultMessage: "Search by country name",
                    description: "search box placeholder"
                  })}
                  fullWidth
                />
                <FormSpacer />
                <Hr />
                <FormSpacer />
                <Typography variant="subtitle1">
                  <FormattedMessage
                    defaultMessage="Countries A to Z"
                    description="country selection"
                  />
                </Typography>
              </DialogContent>
              <DialogContent className={scrollableDialogClasses.scrollArea}>
                <ResponsiveTable>
                  <TableBody>
                    {filter(countries, data.query, {
                      key: "country"
                    }).map(country => {
                      const isChecked = countrySelectionMap[country.code];

                      return (
                        <TableRow key={country.code}>
                          <TableCell className={classes.wideCell}>
                            {country.country}
                          </TableCell>
                          <TableCell
                            padding="checkbox"
                            className={classes.checkboxCell}
                          >
                            <Checkbox
                              checked={isChecked}
                              onChange={() =>
                                isChecked
                                  ? change({
                                      target: {
                                        name: "countries" as keyof FormData,
                                        value: data.countries.filter(
                                          selectedCountries =>
                                            selectedCountries !== country.code
                                        )
                                      }
                                    } as any)
                                  : change({
                                      target: {
                                        name: "countries" as keyof FormData,
                                        value: [...data.countries, country.code]
                                      }
                                    } as any)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </ResponsiveTable>
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose}>
                  <FormattedMessage {...buttonMessages.back} />
                </Button>
                <ConfirmButton
                  transitionState={confirmButtonState}
                  type="submit"
                >
                  <FormattedMessage
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
