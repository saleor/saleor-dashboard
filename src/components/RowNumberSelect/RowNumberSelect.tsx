import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { ListSettings } from "../../types";

const useStyles = makeStyles(
  theme => ({
    label: {
      fontSize: 14
    },
    select: {
      "& div": {
        "&:focus": {
          background: "none"
        },
        color: theme.palette.primary.main,
        marginLeft: theme.spacing(1)
      },
      "& svg": {
        color: theme.palette.primary.main
      },
      "&:after, &:before, &:hover": {
        border: "none !important"
      }
    }
  }),
  {
    name: "RowNumberSelect"
  }
);

interface RowNumberSelectProps {
  choices: number[];
  className?: string;
  settings: ListSettings;
  onChange(key: keyof ListSettings, value: any);
}

const RowNumberSelect: React.FC<RowNumberSelectProps> = ({
  className,
  choices,
  settings,
  onChange
}) => {
  const classes = useStyles({});

  return (
    <div className={className}>
      <span className={classes.label}>
        <FormattedMessage defaultMessage="No of Rows:" />
      </span>
      <Select
        data-test-id="rowNumberSelect"
        className={classes.select}
        value={settings.rowNumber}
        onChange={event => onChange("rowNumber", event.target.value)}
      >
        {choices.length > 0 &&
          choices.map(choice => (
            <MenuItem
              value={choice}
              key={choice}
              data-test-id="rowNumberOption"
            >
              {choice}
            </MenuItem>
          ))}
      </Select>
    </div>
  );
};

export default RowNumberSelect;
