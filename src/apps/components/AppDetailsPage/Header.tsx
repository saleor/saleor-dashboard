import { AppUrls } from "@dashboard/apps/urls";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { AppQuery } from "@dashboard/graphql";
import React, { useMemo } from "react";

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
  const backButtonTarget = useMemo(
    () => (data?.id ? AppUrls.resolveAppUrl(data.id) : "#"),
    [data.id],
  );

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
