import { MenuItem, Select } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    label: {
      fontSize: 14,
    },
    select: {
      "& div": {
        "&:focus": {
          background: "none",
        },
        color: theme.palette.primary.main,
        marginLeft: theme.spacing(1),
      },
      "& svg": {
        color: theme.palette.primary.main,
      },
      "&:after, &:before, &:hover": {
        border: "none !important",
      },
    },
  }),
  {
    name: "RowNumberSelect",
  },
);

interface RowNumberSelectProps {
  choices: number[];
  className?: string;
  rowNumber: number;
  onChange(value: number);
}

const RowNumberSelect: React.FC<RowNumberSelectProps> = ({
  className,
  choices,
  rowNumber,
  onChange,
}) => {
  const classes = useStyles({});

  return (
    <div className={className}>
      <span className={classes.label}>
        <FormattedMessage id="fNFEkh" defaultMessage="No of Rows:" />
      </span>
      <Select
        data-test-id="row-number-select"
        className={classes.select}
        value={rowNumber}
        onChange={event => onChange(event.target.value as number)}
      >
        {choices.length > 0 &&
          choices.map(choice => (
            <MenuItem
              value={choice}
              key={choice}
              data-test-id="row-number-option"
            >
              {choice}
            </MenuItem>
          ))}
      </Select>
    </div>
  );
};

export default RowNumberSelect;
