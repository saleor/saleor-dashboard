import { EventDeliveryStatusEnum, WebhookEventTypeEnum } from "@dashboard/graphql";
import { render } from "@testing-library/react";
import React from "react";

import { EventDeliveriesList, EventDelivery } from "./EventDeliveriesList";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }) => <>{defaultMessage}</>,
}));

describe("EventDeliveriesList", () => {
  const mockEventDeliveries: EventDelivery[] = [
    {
      __typename: "EventDeliveryCountableEdge",
      node: {
        __typename: "EventDelivery",
        id: "event-deliver-1",
        eventType: WebhookEventTypeEnum.ORDER_CONFIRMED,
        createdAt: "2023-01-02T00:00:00Z",
        status: EventDeliveryStatusEnum.FAILED,
        attempts: {
          edges: [
            {
              __typename: "EventDeliveryAttemptCountableEdge",
              node: {
                createdAt: "2023-01-02T01:00:00Z",
                id: "id-1",
                response: '{"message":"Failed to send email"}',
                responseStatusCode: 400,
                status: EventDeliveryStatusEnum.FAILED,
                __typename: "EventDeliveryAttempt",
              },
            },
          ],
          __typename: "EventDeliveryAttemptCountableConnection",
        },
      },
    },
  ];

  const mockMultipleEventDeliveries: EventDelivery[] = [
    {
      __typename: "EventDeliveryCountableEdge",
      node: {
        __typename: "EventDelivery",
        id: "event-deliver-1",
        eventType: WebhookEventTypeEnum.ORDER_CONFIRMED,
        createdAt: "2023-01-02T00:00:00Z",
        status: EventDeliveryStatusEnum.FAILED,
        attempts: {
          edges: [
            {
              __typename: "EventDeliveryAttemptCountableEdge",
              node: {
                createdAt: "2024-01-02T01:00:00Z",
                id: "id-1",
                response: '{"message":"Failed to send email"}',
                responseStatusCode: 400,
                status: EventDeliveryStatusEnum.FAILED,
                __typename: "EventDeliveryAttempt",
              },
            },
            {
              __typename: "EventDeliveryAttemptCountableEdge",
              node: {
                createdAt: "2024-01-02T01:10:00Z",
                id: "id-2",
                response: '{"message":"Failed to send email"}',
                responseStatusCode: 400,
                status: EventDeliveryStatusEnum.FAILED,
                __typename: "EventDeliveryAttempt",
              },
            },
          ],
          __typename: "EventDeliveryAttemptCountableConnection",
        },
      },
    },
    {
      __typename: "EventDeliveryCountableEdge",
      node: {
        __typename: "EventDelivery",
        id: "event-deliver-2",
        eventType: WebhookEventTypeEnum.ORDER_CONFIRMED,
        createdAt: "2023-01-02T00:00:00Z",
        status: EventDeliveryStatusEnum.SUCCESS,
        attempts: {
          edges: [
            {
              __typename: "EventDeliveryAttemptCountableEdge",
              node: {
                createdAt: "2024-01-03T01:00:00Z",
                id: "id-2",
                response: '{"message":"Failed to connect"}',
                responseStatusCode: 400,
                status: EventDeliveryStatusEnum.FAILED,
                __typename: "EventDeliveryAttempt",
              },
            },
          ],
          __typename: "EventDeliveryAttemptCountableConnection",
        },
      },
    },
  ];

  it("renders correctly with provided event delivery", () => {
    // Arrange & Act
    const { getByText } = render(<EventDeliveriesList eventDeliveries={mockEventDeliveries} />);

    // Assert
    expect(getByText("FAILED")).toBeInTheDocument();
    expect(getByText('{"message":"Failed to send email"}')).toBeInTheDocument();
    expect(getByText("400")).toBeInTheDocument();
    expect(getByText("1 / 6")).toBeInTheDocument();
  });

  it("render with multiple event deliveries", () => {
    // Arrange & Act
    const { getByTestId } = render(
      <EventDeliveriesList eventDeliveries={mockMultipleEventDeliveries} />,
    );

    const firstContainer = getByTestId("event-deliver-1");
    const secondContainer = getByTestId("event-deliver-2");

    // Assert
    expect(firstContainer).toBeInTheDocument();
    expect(secondContainer).toBeInTheDocument();

    expect(firstContainer.textContent).toContain("FAILED");
    expect(firstContainer.textContent).toContain('{"message":"Failed to send email"}');
    expect(firstContainer.textContent).toContain("2 / 6");

    expect(secondContainer.textContent).toContain("FAILED");
    expect(secondContainer.textContent).toContain('{"message":"Failed to connect"}');
    expect(secondContainer.textContent).toContain("1 / 6");
  });
});
