import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { Dialog, DialogContent } from "@material-ui/core";
import { DialogHeader } from "@saleor/macaw-ui";
import { createFetch } from "@saleor/sdk";
import React, { createContext, useContext, useState } from "react";

import GraphiQL from "../GraphiQLPlain";

const authorizedFetch = createFetch();

export const DevModeContext = createContext({
  variables: "",
  setVariables: (_value: string) => undefined,
  isDevModeVisible: false,
  setDevModeVisibility: (_value: boolean) => undefined,
  devModeContent: "",
  setDevModeContent: (_value: string) => undefined,
});

export function DevModeProvider({ children }) {
  const [variables, setVariables] = useState("");
  const [devModeContent, setDevModeContent] = useState("");
  const [isDevModeVisible, setDevModeVisibility] = useState(false);

  return (
    <DevModeContext.Provider
      value={{
        variables,
        setVariables,
        devModeContent,
        setDevModeContent,
        isDevModeVisible,
        setDevModeVisibility,
      }}
    >
      {children}
    </DevModeContext.Provider>
  );
}

interface Props {
  isDevModeVisible: boolean;
  setDevModeVisibility: (value: boolean) => void;
}

export const DevModePanel: React.FC<Props> = ({
  isDevModeVisible,
  setDevModeVisibility,
}) => {
  const fetcher = createGraphiQLFetcher({
    url: process.env.API_URI,
    fetch: authorizedFetch,
  });

  const context = useContext(DevModeContext);

  return (
    <Dialog
      maxWidth="xl"
      fullWidth
      open={isDevModeVisible}
      PaperProps={{ style: { height: "100%", zIndex: 100 } }}
    >
      <DialogHeader onClose={() => setDevModeVisibility(false)}>
        Dev Mode
      </DialogHeader>
      {/* <div style={{ "margin":"20px" }}>
        <Pill color="generic" label="customerCreate" onClick={() => {} }/>
      </div> */}
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
