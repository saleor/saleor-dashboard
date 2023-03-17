import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { Dialog, DialogContent } from "@material-ui/core";
import { DialogHeader } from "@saleor/macaw-ui";
import { createFetch } from "@saleor/sdk";
import React from "react";
import { useIntl } from "react-intl";

import GraphiQL from "../GraphiQLPlain";
import { useDevModeContext } from "./hooks";
import { messages } from "./messages";

const authorizedFetch = createFetch();

interface DevModePanelProps {
  isDevModeVisible: boolean;
  setDevModeVisibility: (value: boolean) => void;
}

export const DevModePanel: React.FC<DevModePanelProps> = ({
  isDevModeVisible,
  setDevModeVisibility,
}) => {
  const fetcher = createGraphiQLFetcher({
    url: process.env.API_URI,
    fetch: authorizedFetch,
  });

  const intl = useIntl();

  const { devModeContent, variables } = useDevModeContext();

  return (
    <Dialog
      maxWidth="xl"
      fullWidth
      open={isDevModeVisible}
      style={{ zIndex: 5 }}
      PaperProps={{ style: { height: "100%" } }}
    >
      <DialogHeader onClose={() => setDevModeVisibility(false)}>
        {intl.formatMessage(messages.title)}
      </DialogHeader>
      <DialogContent style={{ padding: 0, margin: 1, overflowY: "auto" }}>
        <GraphiQL
          query={devModeContent}
          variables={variables}
          fetcher={fetcher}
        />
      </DialogContent>
    </Dialog>
  );
};
