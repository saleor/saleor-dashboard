import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { filter } from "fuzzaldrin";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Checkbox from "@saleor/components/Checkbox";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
// tslint:disable no-submodule-imports
import { ShopInfo_shop_countries } from "@saleor/components/Shop/types/ShopInfo";
import { buttonMessages } from "@saleor/intl";

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

const useStyles = makeStyles(
  theme => ({
    checkboxCell: {
      paddingLeft: 0
    },
    container: {
      maxHeight: 500
    },
    heading: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2)
    },
    wideCell: {
      width: "100%"
    }
  }),
  { name: "DiscountCountrySelectDialog" }
);
const DiscountCountrySelectDialog: React.FC<
  DiscountCountrySelectDialogProps
> = props => {
  const {
    confirmButtonState,
    onClose,
    countries,
    open,
    initial,
    onConfirm
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  const initialForm: FormData = {
    allCountries: true,
    countries: initial,
    query: ""
  };
  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <Form initial={initialForm} onSubmit={onConfirm}>
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
              </DialogContent>
              <Hr />
              <DialogContent className={classes.container}>
                <Typography className={classes.heading} variant="subtitle1">
                  <FormattedMessage
                    defaultMessage="Countries A to Z"
                    description="country selection"
                  />
                </Typography>
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
                  color="primary"
                  variant="contained"
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
