// @ts-strict-ignore
import { useDashboardTheme } from "@dashboard/components/GraphiQL/styles";
import { DashboardModal } from "@dashboard/components/Modal";
import { useOnboarding } from "@dashboard/newHome/homeOnboarding/onboardingContext";
import { createGraphiQLFetcher, FetcherOpts, FetcherParams } from "@graphiql/toolkit";
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
  const { markOnboardingStepAsCompleted } = useOnboarding();
  const { isDevModeVisible, variables, devModeContent, setDevModeVisibility } = useDevModeContext();
  const baseFetcher = createGraphiQLFetcher({
    url: process.env.API_URL,
    fetch: authorizedFetch,
  });
  const fetcher = async (graphQLParams: FetcherParams, opts: FetcherOpts) => {
    if (graphQLParams.operationName !== "IntrospectionQuery") {
      markOnboardingStepAsCompleted("graphql-playground");
    }

    const result = await baseFetcher(graphQLParams, opts); // Call the base fetcher

    return result;
  };
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
      <DashboardModal.Content size="xl" __gridTemplateRows="auto 1fr" height="100%">
        <style dangerouslySetInnerHTML={overwriteCodeMirrorCSSVariables}></style>
        <DashboardModal.Header>{intl.formatMessage(messages.title)}</DashboardModal.Header>

        <PlainGraphiQL query={devModeContent} variables={variables} fetcher={fetcher} />
      </DashboardModal.Content>
    </DashboardModal>
  );
};
