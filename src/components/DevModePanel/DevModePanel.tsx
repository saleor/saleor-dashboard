// @ts-strict-ignore
import { useDashboardTheme } from "@dashboard/components/GraphiQL/styles";
import { DashboardModal } from "@dashboard/components/Modal";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { Box } from "@saleor/macaw-ui-next";
import { createFetch } from "@saleor/sdk";
import React from "react";
import { useIntl } from "react-intl";

import PlainGraphiQL from "../GraphiQLPlain";
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
    <DashboardModal open={isDevModeVisible} onChange={() => setDevModeVisibility(false)}>
      <DashboardModal.Content size="xlg" __gridTemplateRows="auto 1fr" height="100%">
        <style dangerouslySetInnerHTML={overwriteCodeMirrorCSSVariables}></style>
        <DashboardModal.Title display="flex" justifyContent="space-between">
          {intl.formatMessage(messages.title)}
          <DashboardModal.Close onClose={() => setDevModeVisibility(false)} />
        </DashboardModal.Title>

        <Box height="100%">
          <PlainGraphiQL query={devModeContent} variables={variables} fetcher={fetcher} />
        </Box>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
