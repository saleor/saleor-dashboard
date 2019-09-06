import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Calendar from "../../icons/Calendar";
import FormSpacer from "../FormSpacer";
import PriceField from "../PriceField";
import SingleSelectField from "../SingleSelectField";
import { FieldType, IFilterItem } from "./types";

export interface FilterElementProps<TFilterKeys = string> {
  className?: string;
  filter: IFilterItem<TFilterKeys>;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

const useStyles = makeStyles({
  calendar: {
    margin: 8
  },
  input: {
    padding: "20px 12px 17px"
  }
});

export interface FilterElementProps<TFilterKeys = string> {
  className?: string;
  currencySymbol: string;
  filter: IFilterItem<TFilterKeys>;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

const FilterElement: React.FC<FilterElementProps> = ({
  currencySymbol,
  className,
  filter,
  onChange,
  value
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  if (filter.data.type === FieldType.date) {
    return (
      <TextField
        className={className}
        fullWidth
        type="date"
        onChange={event => onChange(event.target.value)}
        value={value}
        InputProps={{
          classes: {
            input: classes.input
          },
          startAdornment: <Calendar className={classes.calendar} />
        }}
      />
    );
  } else if (filter.data.type === FieldType.rangeDate) {
    return (
      <>
        <Typography>
          <FormattedMessage defaultMessage="from" />
        </Typography>
        <TextField
          className={className}
          fullWidth
          type="date"
          value={value[0]}
          onChange={event => onChange([event.target.value, value[1]])}
          InputProps={{
            classes: {
              input: classes.input
            },
            startAdornment: <Calendar className={classes.calendar} />
          }}
        />
        <FormSpacer />
        <Typography>
          <FormattedMessage defaultMessage="to" />
        </Typography>
        <TextField
          className={className}
          fullWidth
          type="date"
          value={value[1]}
          onChange={event => onChange([value[0], event.target.value])}
          InputProps={{
            classes: {
              input: classes.input
            },
            startAdornment: <Calendar className={classes.calendar} />
          }}
        />
      </>
    );
  } else if (filter.data.type === FieldType.range) {
    return (
      <>
        <Typography>
          <FormattedMessage defaultMessage="from" />
        </Typography>
        <TextField
          className={className}
          fullWidth
          value={value[0]}
          onChange={event => onChange([event.target.value, value[1]])}
          type="number"
          InputProps={{
            classes: {
              input: classes.input
            }
          }}
        />
        <FormSpacer />
        <Typography>
          <FormattedMessage defaultMessage="to" />
        </Typography>
        <TextField
          className={className}
          fullWidth
          value={value[1]}
          onChange={event => onChange([value[0], event.target.value])}
          type="number"
          InputProps={{
            classes: {
              input: classes.input
            }
          }}
        />
      </>
    );
  } else if (filter.data.type === FieldType.rangePrice) {
    return (
      <>
        <Typography>
          <FormattedMessage defaultMessage="from" />
        </Typography>
        <PriceField
          currencySymbol={currencySymbol}
          className={className}
          value={value[0]}
          onChange={event => onChange([event.target.value, value[1]])}
          InputProps={{
            classes: {
              input: classes.input
            }
          }}
        />
        <FormSpacer />
        <Typography>
          <FormattedMessage defaultMessage="to" />
        </Typography>
        <PriceField
          currencySymbol={currencySymbol}
          className={className}
          value={value[1]}
          onChange={event => onChange([value[0], event.target.value])}
          InputProps={{
            classes: {
              input: classes.input
            }
          }}
        />
      </>
    );
  } else if (filter.data.type === FieldType.select) {
    return (
      <SingleSelectField
        choices={filter.data.options.map(option => ({
          ...option,
          value: option.value.toString()
        }))}
        selectProps={{
          className,
          inputProps: {
            className: classes.input
          }
        }}
        value={value as string}
        placeholder={intl.formatMessage({
          defaultMessage: "Select Filter..."
        })}
        onChange={event => onChange(event.target.value)}
      />
    );
  } else if (filter.data.type === FieldType.price) {
    return (
      <PriceField
        currencySymbol={currencySymbol}
        className={className}
        label={filter.data.fieldLabel}
        onChange={event => onChange(event.target.value)}
        InputProps={{
          classes: {
            input: !filter.data.fieldLabel && classes.input
          }
        }}
        value={value as string}
      />
    );
  } else if (filter.data.type === FieldType.hidden) {
    onChange(filter.data.value);
    return <input type="hidden" value={value} />;
  }
  return (
    <TextField
      className={className}
      fullWidth
      label={filter.data.fieldLabel}
      InputProps={{
        classes: {
          input: !filter.data.fieldLabel && classes.input
        }
      }}
      onChange={event => onChange(event.target.value)}
      value={value as string}
    />
  );
};
FilterElement.displayName = "FilterElement";
export default FilterElement;
