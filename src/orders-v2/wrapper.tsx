import { ApolloProvider } from "@apollo/client";
import { DevModeProvider } from "@dashboard/components/DevModePanel/DevModeProvider";
import { NavigatorSearchProvider } from "@dashboard/components/NavigatorSearch/NavigatorSearchProvider";
import { Router } from "@dashboard/components/Router";
import { SavebarRefProvider } from "@dashboard/components/Savebar/SavebarRefContext";
import { FeatureFlagsProviderWithUser } from "@dashboard/featureFlags/FeatureFlagsProvider";
import { apolloClient } from "@dashboard/graphql/client";
import { OnboardingProvider } from "@dashboard/welcomePage/WelcomePageOnboarding/onboardingContext/OnboardingContext";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

const MockedAppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box display="grid" __gridTemplateColumns="auto 1fr">
      <Box
        __width={"260px"}
        height="100vh"
        backgroundColor="default2"
        top={0}
        borderLeftWidth={0}
        borderTopWidth={0}
        borderBottomWidth={0}
      />
      <Box height="100%" width="100%" overflow="hidden">
        <Box as="main" width="100%" height="100%">
          {children}
        </Box>
        <Box
          bottom={0}
          left={0}
          right={0}
          backgroundColor="default1"
          borderTopWidth={1}
          borderTopStyle="solid"
          borderColor="default1"
          zIndex="2"
        />
      </Box>
    </Box>
  );
};

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <DevModeProvider>
          <NavigatorSearchProvider>
            <SavebarRefProvider>
              <FeatureFlagsProviderWithUser>
                <OnboardingProvider>
                  <MockedAppLayout>{children}</MockedAppLayout>
                </OnboardingProvider>
              </FeatureFlagsProviderWithUser>
            </SavebarRefProvider>
          </NavigatorSearchProvider>
        </DevModeProvider>
      </Router>
    </ApolloProvider>
  );
};
