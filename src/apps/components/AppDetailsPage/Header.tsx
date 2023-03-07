import { AppPaths } from "@dashboard/apps/urls";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { AppQuery } from "@dashboard/graphql";
import { Button } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";

import DeactivatedText from "../DeactivatedText";
import HeaderOptions from "./HeaderOptions";
import messages from "./messages";

interface HeaderProps {
  data: AppQuery["app"];
  navigateToApp: () => void;
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
  onAppDeleteOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({
  data,
  navigateToApp,
  onAppActivateOpen,
  onAppDeactivateOpen,
  onAppDeleteOpen,
}) => (
  <>
    <TopNav
      href={AppPaths.appListPath}
      title={
        <>
          {data?.name} {!data?.isActive && <DeactivatedText />}
        </>
      }
    >
      <Button onClick={navigateToApp} variant="primary" data-tc="open-app">
        <FormattedMessage {...messages.openApp} />
      </Button>
    </TopNav>
    <HeaderOptions
      data={data}
      onAppActivateOpen={onAppActivateOpen}
      onAppDeactivateOpen={onAppDeactivateOpen}
      onAppDeleteOpen={onAppDeleteOpen}
    />
  </>
);
export default Header;
