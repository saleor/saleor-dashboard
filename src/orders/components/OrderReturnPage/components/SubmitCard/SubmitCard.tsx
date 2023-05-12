import CardTitle from "@dashboard/components/CardTitle";
import {
  ConfirmButton,
  ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { submitCardMessages } from "./messages";
import { useSubmitCardStyles } from "./styles";

interface SubmitCardProps {
  disabled: boolean;
  onSubmit: () => void;
  submitStatus: ConfirmButtonTransitionState;
}

export const SubmitCard = ({
  disabled,
  onSubmit,
  submitStatus,
}: SubmitCardProps) => {
  const intl = useIntl();
  const classes = useSubmitCardStyles();

  return (
    <div>
      <Card>
        <CardTitle title={intl.formatMessage(submitCardMessages.cardTitle)} />
        <CardContent>
          <Typography>
            <FormattedMessage {...submitCardMessages.descrption} />
          </Typography>
          <div className={classes.submitButtonWrapper}>
            <ConfirmButton
              data-test-id="return-submit-button"
              transitionState={submitStatus}
              disabled={disabled}
              variant="primary"
              onClick={onSubmit}
            >
              <FormattedMessage {...submitCardMessages.submitButton} />
            </ConfirmButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
