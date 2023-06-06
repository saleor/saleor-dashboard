import { AppUrls } from "@dashboard/apps/urls";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { AppQuery } from "@dashboard/graphql";
import React from "react";

import DeactivatedText from "../DeactivatedText";
import HeaderOptions from "./HeaderOptions";

interface HeaderProps {
  data: AppQuery["app"];
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
  onAppDeleteOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({
  data,
  onAppActivateOpen,
  onAppDeactivateOpen,
  onAppDeleteOpen,
}) => {
  const getBackButtonUrl = () => {
    /**
     * App is null with first render so fallback with HTML-safe fallback
     */
    if (!data?.id) {
      return "#";
    }

    const isAppActive = data.isActive;

    return isAppActive
      ? AppUrls.resolveAppUrl(data.id)
      : AppUrls.resolveAppListUrl();
  };

  return (
    <>
      <TopNav
        href={getBackButtonUrl()}
        title={
          <>
            {data?.name} {!data?.isActive && <DeactivatedText />}
          </>
        }
      />
      <HeaderOptions
        data={data}
        onAppActivateOpen={onAppActivateOpen}
        onAppDeactivateOpen={onAppDeactivateOpen}
        onAppDeleteOpen={onAppDeleteOpen}
      />
    </>
  );
};
export default Header;
