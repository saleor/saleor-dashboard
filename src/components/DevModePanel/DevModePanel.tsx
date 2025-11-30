import { useDashboardTheme } from "@dashboard/components/GraphiQL/styles";
import { DashboardModal } from "@dashboard/components/Modal";
import { useOnboarding } from "@dashboard/welcomePage/WelcomePageOnboarding/onboardingContext";
import { Fetcher, FetcherOpts, FetcherParams } from "@graphiql/toolkit";
import { useIntl } from "react-intl";

import { ContextualLine } from "../AppLayout/ContextualLinks/ContextualLine";
import { useContextualLink } from "../AppLayout/ContextualLinks/useContextualLink";
import PlainGraphiQL from "../GraphiQLPlain";
import { useDevModeContext } from "./hooks";
import { messages } from "./messages";
import { getFetcher } from "./utils";

export const DevModePanel = () => {
  const intl = useIntl();
  const subtitle = useContextualLink("dev_panel");
  const { rootStyle } = useDashboardTheme();
  const { markOnboardingStepAsCompleted } = useOnboarding();
  const { isDevModeVisible, variables, devModeContent, setDevModeVisibility } = useDevModeContext();
  const fetcher: Fetcher = async (graphQLParams: FetcherParams, opts?: FetcherOpts) => {
    if (graphQLParams.operationName !== "IntrospectionQuery") {
      markOnboardingStepAsCompleted("graphql-playground");
    }

    const baseFetcher = getFetcher(opts ?? ({} as FetcherOpts));

    const result = await baseFetcher(graphQLParams, opts ?? ({} as FetcherOpts)); // Call the base fetcher

    return result;
  };
  const styleWithCustomProps = rootStyle as React.CSSProperties & Record<string, string>;
  const overwriteCodeMirrorCSSVariables = {
    __html: `
      .graphiql-container, .CodeMirror-info, .CodeMirror-lint-tooltip, reach-portal{
        --font-size-hint: ${styleWithCustomProps["--font-size-hint"]} !important;
        --font-size-inline-code: ${styleWithCustomProps["--font-size-inline-code"]} !important;
        --font-size-body: ${styleWithCustomProps["--font-size-body"]} !important;
        --font-size-h4: ${styleWithCustomProps["--font-size-h4"]} !important;
        --font-size-h3: ${styleWithCustomProps["--font-size-h3"]} !important;
        --font-size-h2: ${styleWithCustomProps["--font-size-h2"]} !important;
    `,
  };

  return (
    <DashboardModal open={isDevModeVisible} onChange={() => setDevModeVisibility(false)}>
      <DashboardModal.Content size="xl" __gridTemplateRows="auto 1fr" height="100%">
        <style dangerouslySetInnerHTML={overwriteCodeMirrorCSSVariables}></style>
        <DashboardModal.Header>
          {intl.formatMessage(messages.title)}

          <ContextualLine>{subtitle}</ContextualLine>
        </DashboardModal.Header>

        <PlainGraphiQL query={devModeContent} variables={variables} fetcher={fetcher} />
      </DashboardModal.Content>
    </DashboardModal>
  );
};
