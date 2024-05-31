// @ts-strict-ignore
import { useDashboardTheme } from "@dashboard/components/GraphiQL/styles";
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

export const DevModePanel: React.FC = () => {
  const intl = useIntl();
  const { rootStyle } = useDashboardTheme();
  const { isDevModeVisible, variables, devModeContent, setDevModeVisibility } = useDevModeContext();
  const fetcher = createGraphiQLFetcher({
    url: process.env.API_URL,
    fetch: authorizedFetch,
  });
  const overwriteCodeMirrorCSSVariables = {
    __html: `
      .graphiql-container, .CodeMirror-info, .CodeMirror-lint-tooltip, reach-portal{
        --font-size-hint: ${rootStyle["--font-size-hint"]} !important;
        --font-size-inline-code: ${rootStyle["--font-size-inline-code"]} !important;
        --font-size-body: ${rootStyle["--font-size-body"]} !important;
        --font-size-h4: ${rootStyle["--font-size-h4"]} !important;
        --font-size-h3: ${rootStyle["--font-size-h3"]} !important;
        --font-size-h2: ${rootStyle["--font-size-h2"]} !important;
    `,
  };

  return (
    <Dialog
      maxWidth="xl"
      fullWidth
      open={isDevModeVisible}
      style={{ zIndex: 5 }}
      PaperProps={{ style: { height: "100%" } }}
    >
      <style dangerouslySetInnerHTML={overwriteCodeMirrorCSSVariables}></style>
      <DialogHeader onClose={() => setDevModeVisibility(false)}>
        {intl.formatMessage(messages.title)}
      </DialogHeader>
      <DialogContent style={{ padding: 0, margin: 1, overflowY: "auto" }}>
        <GraphiQL query={devModeContent} variables={variables} fetcher={fetcher} />
      </DialogContent>
    </Dialog>
  );
};
