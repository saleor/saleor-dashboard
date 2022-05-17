import { AppFrame } from "@saleor/apps/components/AppFrame";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { MARKETPLACE_URI } from "@saleor/config";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import { useStyles } from "./styles";

const Component = () => {
  const classes = useStyles();
  const intl = useIntl();
  const navigate = useNavigator();

  if (!MARKETPLACE_URI) {
    return <NotFoundPage onBack={() => navigate("/")} />;
  }

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.marketplace)} />
      <AppFrame
        src={MARKETPLACE_URI}
        // Marketplace doesn't require app token nor id
        appToken=""
        appId=""
        className={classes.iframe}
      />
    </>
  );
};

export default Component;
