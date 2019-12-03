import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    spacer: {
      marginTop: theme.spacing(3)
    }
  }),
  { name: "FormSpacer" }
);

interface FormSpacerProps {
  children?: React.ReactNode;
}

export const FormSpacer: React.FC<FormSpacerProps> = props => {
  const { children } = props;

  const classes = useStyles(props);

  return <div className={classes.spacer}>{children}</div>;
};

FormSpacer.displayName = "FormSpacer";
export default FormSpacer;
