import { Container } from "@material-ui/core";
import { AppFrame } from "@saleor/apps/components/AppFrame";
import NotFoundPage from "@saleor/components/NotFoundPage";
import PreviewPill from "@saleor/components/PreviewPill";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { MARKETPLACE_URL } from "@saleor/config";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import { marketplaceUrlResolver } from "@saleor/marketplace/marketplace-url-resolver";
import { marketplaceUrl } from "@saleor/marketplace/urls";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import useRouter from "use-react-router";

import { useStyles } from "./styles";

const getDeepPath = (path: string) => path.replace(marketplaceUrl, "");

const Component = () => {
  const classes = useStyles();
  const intl = useIntl();
  const navigate = useNavigator();
  const router = useRouter();

  const marketplaceUrl = useMemo(
    () => new URL(getDeepPath(router.location.pathname), MARKETPLACE_URL).href,
    [router.location.pathname],
  );

  if (!marketplaceUrlResolver.checkMarketplaceConfigExists()) {
    return <NotFoundPage onBack={() => navigate("/")} />;
  }

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.marketplace)} />
      <Container>
        <PreviewPill className={classes.previewPill} />
        <AppFrame
          src={marketplaceUrl}
          // Marketplace doesn't require app token nor id
          appToken=""
          appId=""
          className={classes.iframe}
        />
      </Container>
    </>
  );
};

export default Component;
