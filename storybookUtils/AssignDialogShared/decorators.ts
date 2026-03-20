import { withApolloMocks } from "@storybookUtils/apollo";

import { assignDialogFilterResponses } from "./mockResponses";

export const withFilterApolloMocks = withApolloMocks(assignDialogFilterResponses);
