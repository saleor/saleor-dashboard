// @ts-strict-ignore
import { CodeMirrorFontSizeOverrides } from "@dashboard/components/GraphiQL/shared";
import { DashboardModal } from "@dashboard/components/Modal";
import { useOnboarding } from "@dashboard/welcomePage/WelcomePageOnboarding/onboardingContext/OnboardingContext";
import { type FetcherOpts, type FetcherParams } from "@graphiql/toolkit";
import { useIntl } from "react-intl";

import { ContextualLine } from "../AppLayout/ContextualLinks/ContextualLine";
import { useContextualLink } from "../AppLayout/ContextualLinks/useContextualLink";
import PlainGraphiQL from "../GraphiQLPlain/GraphiQL";
import { useDevModeContext } from "./hooks";
import { messages } from "./messages";
import { getFetcher } from "./utils";

export const DevModePanel = () => {
  const intl = useIntl();
  const subtitle = useContextualLink("dev_panel");
  const { markOnboardingStepAsCompleted } = useOnboarding();
  const { isDevModeVisible, variables, devModeContent, setDevModeVisibility } = useDevModeContext();
  const fetcher = async (graphQLParams: FetcherParams, opts: FetcherOpts) => {
    if (graphQLParams.operationName !== "IntrospectionQuery") {
      markOnboardingStepAsCompleted("graphql-playground");
    }

    const baseFetcher = getFetcher(opts);

    const result = await baseFetcher(graphQLParams, opts);

    return result;
  };

  return (
    <DashboardModal open={isDevModeVisible} onChange={() => setDevModeVisibility(false)}>
      <DashboardModal.Content
        size="xl"
        __gridTemplateRows="auto 1fr"
        height="100%"
        disableEscapeKeyDown
      >
        <CodeMirrorFontSizeOverrides />
        <DashboardModal.Header>
          {intl.formatMessage(messages.title)}

          <ContextualLine>{subtitle}</ContextualLine>
        </DashboardModal.Header>

        <PlainGraphiQL query={devModeContent} variables={variables} fetcher={fetcher} />
      </DashboardModal.Content>
    </DashboardModal>
  );
};
