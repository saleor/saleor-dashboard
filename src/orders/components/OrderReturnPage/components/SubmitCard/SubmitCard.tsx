import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import ConfirmButton from "@saleor/components/ConfirmButton";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
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
