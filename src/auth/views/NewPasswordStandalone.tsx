import { type RouteComponentProps } from "react-router";

import Layout from "../components/Layout";
import NewPassword from "./NewPassword";

// New/set-password must be reachable regardless of auth state. OIDC users are
// logged in but still need to set a password, so this view is rendered outside
// the auth-gated route tree (see Routes in src/index.tsx).
const NewPasswordStandalone = (props: RouteComponentProps) => (
  <Layout>
    <NewPassword {...props} />
  </Layout>
);

NewPasswordStandalone.displayName = "NewPasswordStandalone";
export default NewPasswordStandalone;
