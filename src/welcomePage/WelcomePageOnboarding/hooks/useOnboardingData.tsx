import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { useFlag } from "@dashboard/featureFlags";
import { Button } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import { WelcomePageCheckGraphQLButton } from "../components/WelcomePageCheckGraphQLButton";
import { WelcomePageCreateProductButton } from "../components/WelcomePageCreateProductButton";
import { WelcomePageInviteStaffButton } from "../components/WelcomePageInviteStaffButton";
import { WelcomePageOrdersButton } from "../components/WelcomePageOrdersButton";
import { WelcomePageWebhooksButton } from "../components/WelcomePageWebhooksButton";
import { useOnboarding } from "../onboardingContext";
import { OnboardingStepsIDs } from "../onboardingContext/types";

interface OnboardingStepData {
  id: OnboardingStepsIDs;
  title: string;
  description: string;
  actions: ReactNode;
  isCompleted: boolean;
}

const getStepsData = ({
  intl,
  isStepCompleted,
  onStepComplete,
  trackOnboardingEvent,
  isExtensionsFlagEnabled,
}: {
  intl: IntlShape;
  isStepCompleted: (step: OnboardingStepsIDs) => boolean;
  onStepComplete: (step: OnboardingStepsIDs) => void;
  trackOnboardingEvent: (event: OnboardingStepsIDs) => void;
  isExtensionsFlagEnabled: boolean;
}): OnboardingStepData[] => {
  const steps: OnboardingStepData[] = [
    {
      id: "get-started",
      title: intl.formatMessage({
        defaultMessage: "Welcome to Dashboard!",
        id: "PaQFmR",
        description: "onboarding step title",
      }),
      description: intl.formatMessage({
        defaultMessage:
          "We'll guide you through the main features so you can start customizing your store. Explore products, orders, collections, customers, and discounts to get familiar with key functions and concepts.",
        id: "PrxZ/P",
        description: "onboarding step description",
      }),
      isCompleted: isStepCompleted("get-started"),
      actions: !isStepCompleted("get-started") ? (
        <Button
          variant="primary"
          data-test-id="get-started-next-step-btn"
          onClick={() => {
            onStepComplete("get-started");
            trackOnboardingEvent("get-started");
          }}
        >
          <FormattedMessage defaultMessage="Next step" id="d+qgix" />
        </Button>
      ) : null,
    },
    {
      id: "create-product",
      title: intl.formatMessage({
        defaultMessage: "Create a new product",
        id: "IDwsCU",
        description: "onboarding step title",
      }),
      description: intl.formatMessage({
        defaultMessage:
          "Go to all products from where you can create a new product and view it in all product list. View the product in GraphQL",
        id: "l0a2tU",
        description: "onboarding step description",
      }),
      isCompleted: isStepCompleted("create-product"),
      actions: (
        <>
          <WelcomePageCreateProductButton onClick={() => trackOnboardingEvent("create-product")} />
          {!isStepCompleted("create-product") && (
            <Button
              variant="secondary"
              onClick={() => onStepComplete("create-product")}
              data-test-id="create-product-mark-as-done"
            >
              <FormattedMessage defaultMessage="Mark as done" id="C5gcqL" description="btn label" />
            </Button>
          )}
        </>
      ),
    },
    {
      id: "explore-orders",
      title: intl.formatMessage({
        defaultMessage: "Explore orders",
        id: "HADMte",
        description: "onboarding step title",
      }),
      description: intl.formatMessage({
        defaultMessage:
          "Go to all orders where you can create an fulfilment and refund and review corresponding statuses. View the order in GraphQL",
        id: "4IawKc",
        description: "onboarding step description",
      }),
      isCompleted: isStepCompleted("explore-orders"),
      actions: (
        <>
          <WelcomePageOrdersButton onClick={() => trackOnboardingEvent("explore-orders")} />
          {!isStepCompleted("explore-orders") && (
            <Button
              variant="secondary"
              onClick={() => onStepComplete("explore-orders")}
              data-test-id="explore-orders-mark-as-done"
            >
              <FormattedMessage defaultMessage="Mark as done" id="C5gcqL" description="btn label" />
            </Button>
          )}
        </>
      ),
    },
    {
      id: "graphql-playground",
      title: intl.formatMessage({
        defaultMessage: "Check our GraphQL playground & make an API call",
        id: "EQfaUv",
        description: "onboarding step title",
      }),
      description: intl.formatMessage({
        defaultMessage:
          "Saleor includes a GraphQL Playground, an interactive GraphQL editor, allowing access to your Saleor instance's API through the web browser. The Playground lets you quickly familiarize yourself with the API, perform example operations, and send your first queries and mutations.",
        id: "Nyxzpe",
        description: "onboarding step description",
      }),
      isCompleted: isStepCompleted("graphql-playground"),
      actions: (
        <>
          <WelcomePageCheckGraphQLButton
            onClick={() => trackOnboardingEvent("graphql-playground")}
          />
          {!isStepCompleted("graphql-playground") && (
            <Button
              variant="secondary"
              onClick={() => onStepComplete("graphql-playground")}
              data-test-id="graphql-playground-mark-as-done"
            >
              <FormattedMessage defaultMessage="Mark as done" id="C5gcqL" description="btn label" />
            </Button>
          )}
        </>
      ),
    },
    ...(isExtensionsFlagEnabled
      ? [
          {
            id: "view-extensions" as OnboardingStepsIDs,
            title: intl.formatMessage({
              defaultMessage: "Discover extension capabilities",
              id: "JTjg1r",
              description: "onboarding step title",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "Review the central hub for managing all available extensions. Here, you can easily oversee your extensions and enhance Saleor with custom solutions using webhooks and APIs.",
              id: "zsz6LN",
              description: "onboarding step description",
            }),
            isCompleted: isStepCompleted("view-extensions"),
            actions: (
              <>
                <WelcomePageWebhooksButton
                  onClick={() => trackOnboardingEvent("view-extensions")}
                />
                {!isStepCompleted("view-extensions") && (
                  <Button
                    variant="secondary"
                    onClick={() => onStepComplete("view-extensions")}
                    data-test-id="view-extensions-mark-as-done"
                  >
                    <FormattedMessage
                      defaultMessage="Mark as done"
                      id="C5gcqL"
                      description="btn label"
                    />
                  </Button>
                )}
              </>
            ),
          },
        ]
      : [
          {
            id: "view-webhooks" as OnboardingStepsIDs,
            title: intl.formatMessage({
              defaultMessage: "View webhooks functionalities",
              id: "eWrHmu",
              description: "onboarding step title",
            }),
            description: isExtensionsFlagEnabled
              ? intl.formatMessage({
                  defaultMessage:
                    "Webhooks are available in Saleor to Extensions. To create a Webhook you need to create an Extension. You can do that in the Extensions section.",
                  id: "H+4rvh",
                })
              : intl.formatMessage({
                  defaultMessage:
                    "Webhooks are available in Saleor to both Local and External Apps. To create a Webhook you need to create a Local App first. You can do that in the Extensions section.",
                  id: "vUzuyz",
                  description: "onboarding step description",
                }),
            isCompleted: isStepCompleted("view-webhooks"),
            actions: (
              <>
                <WelcomePageWebhooksButton onClick={() => trackOnboardingEvent("view-webhooks")} />
                {!isStepCompleted("view-webhooks") && (
                  <Button
                    variant="secondary"
                    onClick={() => onStepComplete("view-webhooks")}
                    data-test-id="view-webhooks-mark-as-done"
                  >
                    <FormattedMessage
                      defaultMessage="Mark as done"
                      id="C5gcqL"
                      description="btn label"
                    />
                  </Button>
                )}
              </>
            ),
          },
        ]),
    {
      id: "invite-staff",
      title: intl.formatMessage({
        defaultMessage: "Invite staff members",
        id: "p/m4dD",
        description: "onboarding step title",
      }),
      description: isExtensionsFlagEnabled
        ? intl.formatMessage({
            defaultMessage:
              "Invite team members and assign permissions on Product Information Management (PIM), Order Management System (OMS), Promotions engine, Extensions (apps, plugins)",
            id: "Z7vQSa",
          })
        : intl.formatMessage({
            defaultMessage:
              "Invite team members and assign permissions on Product Information Management (PIM), Order Management System (OMS), Promotions engine, Integrations (Apps)",
            id: "htGz4h",
            description: "onboarding step description",
          }),
      isCompleted: isStepCompleted("invite-staff"),
      actions: (
        <>
          <WelcomePageInviteStaffButton onClick={() => trackOnboardingEvent("invite-staff")} />
          {!isStepCompleted("invite-staff") && (
            <Button
              variant="secondary"
              onClick={() => onStepComplete("invite-staff")}
              data-test-id="invite-staff-mark-as-done"
            >
              <FormattedMessage defaultMessage="Mark as done" id="C5gcqL" description="btn label" />
            </Button>
          )}
        </>
      ),
    },
  ];

  return steps;
};

export const useOnboardingData = () => {
  const intl = useIntl();
  const analytics = useAnalytics();
  const { markOnboardingStepAsCompleted, onboardingState } = useOnboarding();
  const { enabled: isExtensionsFlagEnabled } = useFlag("extensions");

  const steps = getStepsData({
    intl,
    isStepCompleted: (step: OnboardingStepsIDs) => onboardingState.stepsCompleted.includes(step),
    onStepComplete: (step: OnboardingStepsIDs) => {
      markOnboardingStepAsCompleted(step);
      analytics.trackEvent("home_onboarding_step_complete_click", { step_id: step });
    },
    trackOnboardingEvent: (step_id: OnboardingStepsIDs) =>
      analytics.trackEvent("home_onboarding_step_click", { step_id: step_id }),
    isExtensionsFlagEnabled,
  });

  return {
    steps,
  };
};
