import { Typography } from "@material-ui/core";
import React, { ChangeEvent } from "react";

import CardSpacer from "../CardSpacer";
import ControlledCheckbox from "../ControlledCheckbox";
import { useTypeDeleteWarningDialogStyles as useStyles } from "./styles";

interface DeleteWarningDialogConsentContentProps {
  description: string | React.ReactNode[];
  consentLabel: string;
  isConsentChecked: boolean;
  onConsentChange: (value: boolean) => void;
}

const DeleteWarningDialogConsentContent: React.FC<DeleteWarningDialogConsentContentProps> = ({
  description,
  consentLabel,
  isConsentChecked,
  onConsentChange,
}) => {
  const classes = useStyles();

  const handleConsentChange = ({ target }: ChangeEvent<any>) =>
    onConsentChange(target.value);

  return (
    <>
      <Typography>{description}</Typography>
      <CardSpacer />
      {consentLabel && (
        <ControlledCheckbox
          name="delete-assigned-items-consent"
          checked={isConsentChecked}
          onChange={handleConsentChange}
          label={
            <Typography className={classes.consentLabel}>
              {consentLabel}
            </Typography>
          }
        />
      )}
    </>
  );
};

export default DeleteWarningDialogConsentContent;
