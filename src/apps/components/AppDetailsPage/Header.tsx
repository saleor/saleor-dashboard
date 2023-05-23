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
  /**
   * App is null with first render so fallback with HTML-safe fallback
   */
  const backButtonTarget = data?.id ? AppUrls.resolveAppUrl(data.id) : "#";

  return (
    <>
      <TopNav
        href={backButtonTarget}
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
