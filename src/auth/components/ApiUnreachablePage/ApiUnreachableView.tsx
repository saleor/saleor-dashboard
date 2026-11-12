import { getAbsoluteApiUrl } from "@dashboard/config";

import { useAutologinRecovery } from "../../hooks/useAutologinRecovery";
import { showSignIn } from "../../initAuth";
import Layout from "../Layout";
import { ApiUnreachablePage } from "./ApiUnreachablePage";

const getApiHost = (): string | null => {
  try {
    return new URL(getAbsoluteApiUrl()).host;
  } catch {
    return null;
  }
};

export const ApiUnreachableView = (): React.ReactNode => {
  const { retrying, retry } = useAutologinRecovery();

  return (
    <Layout>
      <ApiUnreachablePage
        apiHost={getApiHost()}
        retrying={retrying}
        onRetry={retry}
        onSignIn={showSignIn}
      />
    </Layout>
  );
};
