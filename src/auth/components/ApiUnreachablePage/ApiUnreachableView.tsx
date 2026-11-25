import { type ReactNode } from "react";

import { useAutologinRecovery } from "../../hooks/useAutologinRecovery";
import { showSignIn } from "../../initAuth";
import { getSafeApiHost } from "../../utils";
import { Layout } from "../Layout";
import { ApiUnreachablePage } from "./ApiUnreachablePage";

export const ApiUnreachableView = (): ReactNode => {
  const { retrying, retry } = useAutologinRecovery();

  return (
    <Layout>
      <ApiUnreachablePage
        apiHost={getSafeApiHost()}
        retrying={retrying}
        onRetry={retry}
        onSignIn={showSignIn}
      />
    </Layout>
  );
};
