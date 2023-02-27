import { AppFrame } from '@dashboard/apps/components/AppFrame';
import NotFoundPage from '@dashboard/components/NotFoundPage';
import PreviewPill from '@dashboard/components/PreviewPill';
import { WindowTitle } from '@dashboard/components/WindowTitle';
import { MARKETPLACE_URL } from '@dashboard/config';
import useNavigator from '@dashboard/hooks/useNavigator';
import { sectionNames } from '@dashboard/intl';
import { marketplaceUrlResolver } from '@dashboard/marketplace/marketplace-url-resolver';
import { marketplaceUrl } from '@dashboard/marketplace/urls';
import { Container } from '@material-ui/core';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import useRouter from 'use-react-router';

import { useStyles } from './styles';

const getDeepPath = (path: string) => path.replace(marketplaceUrl, '');

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
    return <NotFoundPage onBack={() => navigate('/')} />;
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
