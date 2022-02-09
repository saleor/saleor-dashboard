import { Button, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    button: {
      letterSpacing: 2,
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(3),
      padding: 0
    }
  }),
  { name: "MaximalButton" }
);

interface MaximalButtonProps {
  onClick: () => void;
}

const MaximalButton: React.FC<MaximalButtonProps> = ({ onClick }) => {
  const classes = useStyles({});

  return (
    <Button
      className={classes.button}
      onClick={onClick}
      data-test-id="set-maximal-quantity-unfulfilled-button"
    >
      <FormattedMessage
        defaultMessage="Set maximal quantities"
        description="button"
      />
    </Button>
  );
};

export default MaximalButton;
