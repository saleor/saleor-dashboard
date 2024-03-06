// @ts-strict-ignore
import { useDashboardTheme } from "@dashboard/components/GraphiQL/styles";
import { DevModeQuery } from "@dashboard/orders/queries";
import { getFilterVariables } from "@dashboard/orders/views/OrderList/filters";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { Dialog, DialogContent } from "@material-ui/core";
import { DialogHeader } from "@saleor/macaw-ui";
import { createFetch } from "@saleor/sdk";
import React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { extractQueryParams } from "../AppLayout/util";
import GraphiQL from "../GraphiQLPlain";
import { useDevModeContext } from "./hooks";
import { messages } from "./messages";
import { useDevModeKeyTrigger } from "./useDevModeKeyTrigger";

const authorizedFetch = createFetch();

export const DevModePanel: React.FC = () => {
  const fetcher = createGraphiQLFetcher({
    url: process.env.API_URI,
    fetch: authorizedFetch,
  });

  const {
    isDevModeVisible,
    setDevModeVisibility,
    setDevModeContent,
    setVariables,
  } = useDevModeContext();

  const params = extractQueryParams(useLocation().search);

  useDevModeKeyTrigger((_err, { shift }) => {
    if (shift) {
      setDevModeContent(DevModeQuery);
      const variables = JSON.stringify(
        {
          filter: getFilterVariables(params),
        },
        null,
        2,
      );
      setVariables(variables);
    } else {
      setDevModeContent("");
      setVariables("");
    }
    setDevModeVisibility(!isDevModeVisible);
  });

  const intl = useIntl();
  const { rootStyle } = useDashboardTheme();

  const { devModeContent, variables } = useDevModeContext();

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
        <GraphiQL
          query={devModeContent}
          variables={variables}
          fetcher={fetcher}
        />
      </DialogContent>
    </Dialog>
  );
};
