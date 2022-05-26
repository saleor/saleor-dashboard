import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import BackButton from "@saleor/components/BackButton";
import Checkbox from "@saleor/components/Checkbox";
import ConfirmButton from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { CountryWithCodeFragment } from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
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
  countries: CountryWithCodeFragment[];
  initial: string[];
  open: boolean;
  onClose: () => void;
  onConfirm: (data: FormData) => SubmitPromise;
}

const DiscountCountrySelectDialog: React.FC<DiscountCountrySelectDialogProps> = props => {
  const {
    confirmButtonState,
    onClose,
    countries,
    open,
    initial,
    onConfirm,
  } = props;
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
      <Form
        initial={initialForm}
        onSubmit={onConfirm}
        className={scrollableDialogClasses.form}
      >
        {({ data, change }) => {
          const countrySelectionMap = countries.reduce((acc, country) => {
            acc[country.code] = !!data.countries.find(
              selectedCountries => selectedCountries === country.code,
            );
            return acc;
          }, {});

          return (
            <>
              <DialogTitle>
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
                  onChange={event =>
                    change(event /* TO BE CHECKED: () => fetch(data.query)*/)
                  }
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
                    {filter(countries, data.query, {
                      key: "country",
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
                                            selectedCountries !== country.code,
                                        ),
                                      },
                                    } as any)
                                  : change({
                                      target: {
                                        name: "countries" as keyof FormData,
                                        value: [
                                          ...data.countries,
                                          country.code,
                                        ],
                                      },
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
                <BackButton onClick={onClose} />
                <ConfirmButton
                  transitionState={confirmButtonState}
                  type="submit"
                >
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
