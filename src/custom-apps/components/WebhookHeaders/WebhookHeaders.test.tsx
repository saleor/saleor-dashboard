import useForm from "@dashboard/hooks/useForm";
import Wrapper from "@test/wrapper";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import WebhookHeaders, { WebhookHeadersProps } from "./WebhookHeaders";

export const props: WebhookHeadersProps = {
  data: {
    syncEvents: [],
    asyncEvents: [],
    isActive: true,
    name: "Test webhook",
    targetUrl: "http://localhost:3000",
    subscriptionQuery: "",
    customHeaders:
      '{"authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJVc2VybmFtZSI6IlNhbGVvciIsIlRleHQiOiJIZWxsbyBmcm9tIFNhbGVvciJ9.1CQjaMOfk5tEMLr37vvik2gJWe2wlvgl4go4ZZs9jEQ", "x-auth-token": "eyJhbGciOiJIUzI1NiJ9.eyJVc2VybmFtZSI6IlNhbGVvciIsIlRleHQiOiJIZWxsbyBmcm9tIFNhbGVvciJ9.1CQjaMOfk5tEMLr37vvik2gJWe2wlvgl4go4ZZs9jEQ"}',
  },
  onChange: () => undefined,
};

const Component = () => {
  const { change, data } = useForm(props.data, jest.fn());

  return (
    <Wrapper>
      <WebhookHeaders data={data} onChange={change} />
    </Wrapper>
  );
};

const getFirstExpandIcon = () => screen.getAllByTestId("expand")[0];

describe("WebhookHeaders", () => {
  it("is available on the webhook page", async () => {
    // Arrange
    render(<Component />);

    // Assert
    expect(screen.queryByTestId("webhook-headers-editor")).toBeInTheDocument();
  });

  it("can expand field", async () => {
    // Arrange
    render(<Component />);
    const user = userEvent.setup();
    const isExpandedAttribute = "data-test-expanded";
    const editor = screen.getAllByTestId("webhook-headers-editor")[0];
    // Assert
    expect(editor).toHaveAttribute(isExpandedAttribute, "true");
    // Act
    await act(async () => {
      await user.click(getFirstExpandIcon());
    });

    // Assert
    expect(editor).toHaveAttribute(isExpandedAttribute, "false");
  });
});
