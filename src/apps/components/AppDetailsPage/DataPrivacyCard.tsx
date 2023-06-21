// @ts-strict-ignore
import CardTitle from "@dashboard/components/CardTitle";
import ExternalLink from "@dashboard/components/ExternalLink";
import Skeleton from "@dashboard/components/Skeleton";
import { Card, CardContent } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "./messages";
import { useStyles } from "./styles";

interface DataPrivacyCardProps {
  dataPrivacyUrl?: string | null;
  loading: boolean;
}

const DataPrivacyCard: React.FC<DataPrivacyCardProps> = ({
  dataPrivacyUrl,
  loading,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  if (!dataPrivacyUrl && !loading) {
    return null;
  }

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.dataPrivacyTitle)} />
      <CardContent>
        {!loading ? (
          <ExternalLink
            className={classes.linkContainer}
            href={dataPrivacyUrl}
            target="_blank"
          >
            <FormattedMessage {...messages.dataPrivacyDescription} />
          </ExternalLink>
        ) : (
          <Skeleton />
        )}
      </CardContent>
    </Card>
  );
};
export default DataPrivacyCard;
