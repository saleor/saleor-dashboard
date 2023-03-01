import CardTitle from "@dashboard/components/CardTitle";
import Skeleton from "@dashboard/components/Skeleton";
import { Card, CardContent } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import ReactMarkdown from "react-markdown";

import messages from "./messages";

interface AboutCardProps {
  aboutApp?: string | null;
  loading: boolean;
}

const AboutCard: React.FC<AboutCardProps> = ({ aboutApp, loading }) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.aboutAppTitle)} />
      <CardContent>
        {!loading ? <ReactMarkdown source={aboutApp ?? ""} /> : <Skeleton />}
      </CardContent>
    </Card>
  );
};
export default AboutCard;
