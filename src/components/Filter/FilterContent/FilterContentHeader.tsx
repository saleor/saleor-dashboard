import { Typography } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import { buttonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    container: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
      padding: theme.spacing(1, 3),
    },
    clear: {
      marginRight: theme.spacing(1),
    },
    label: {
      fontWeight: 600,
    },
  }),
  { name: "FilterContentHeader" },
);

interface FilterContentHeaderProps {
  onClear: () => void;
}

const FilterContentHeader: React.FC<FilterContentHeaderProps> = ({
  onClear,
}) => {
  const classes = useStyles({});

  return (
    <div className={classes.container}>
      <Typography className={classes.label}>
        <FormattedMessage id="zSOvI0" defaultMessage="Filters" />
      </Typography>
      <div>
        <Button
          data-test-id="clear"
          variant="secondary"
          className={classes.clear}
          onClick={onClear}
        >
          <FormattedMessage {...buttonMessages.clear} />
        </Button>
        <Button data-test-id="submit" variant="primary" type="submit">
          <FormattedMessage {...buttonMessages.done} />
        </Button>
      </div>
    </div>
  );
};

export default FilterContentHeader;
