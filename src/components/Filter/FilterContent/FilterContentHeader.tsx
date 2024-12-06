import { Button } from "@dashboard/components/Button";
import { buttonMessages } from "@dashboard/intl";
import { makeStyles } from "@saleor/macaw-ui";
import { Text, vars } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    container: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      padding: theme.spacing(1, 3),
      backgroundColor: vars.colors.background.default1,
      borderBottom: `1px solid ${vars.colors.border.default1}`,
      zIndex: 1,
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

const FilterContentHeader = ({ onClear }: FilterContentHeaderProps) => {
  const classes = useStyles({});

  return (
    <div className={classes.container}>
      <Text className={classes.label}>
        <FormattedMessage id="zSOvI0" defaultMessage="Filters" />
      </Text>
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
