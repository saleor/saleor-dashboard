import { LinkIcon, Pill } from "@saleor/macaw-ui";
import React from "react";

interface AppUrlLinkProps {
  url: string | null;
  onClick: () => void;
}

const AppUrlLink: React.FC<AppUrlLinkProps> = ({ url, onClick }) => {
  if (typeof url === "string") {
    return (
      <Pill
        icon={<LinkIcon />}
        label={url as string}
        color="info"
        size="small"
        onClick={onClick}
      />
    );
  }
  return (
    <Pill
      label="No app url defined"
      color="error"
      size="small"
      onClick={onClick}
    />
  );
};

export default AppUrlLink;
