import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { Dialog, DialogContent } from "@material-ui/core";
import { DialogHeader } from "@saleor/macaw-ui";
import { createFetch } from "@saleor/sdk";
import React from "react";

import GraphiQL from "../GraphiQLPlain";
import { useDevModeContext } from "./hooks";

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

  const context = useDevModeContext();

  return (
    <Dialog
      maxWidth="xl"
      fullWidth
      open={isDevModeVisible}
      style={{ zIndex: 5 }}
      PaperProps={{ style: { height: "100%" } }}
    >
      <DialogHeader onClose={() => setDevModeVisibility(false)}>
        Dev Mode
      </DialogHeader>
      <DialogContent style={{ padding: 0, margin: 1 }}>
        <GraphiQL
          query={context.devModeContent}
          variables={context.variables}
          fetcher={fetcher}
        />
      </DialogContent>
    </Dialog>
  );
};
