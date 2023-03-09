import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { SubmitCard } from "./SubmitCard";

describe("SubmitCard", () => {
  it("submits on click", async () => {
    const submitFn = jest.fn();
    render(
      <Wrapper>
        <SubmitCard
          onSubmit={submitFn}
          disabled={false}
          submitStatus="default"
        />
      </Wrapper>,
    );

    const submitBtn = screen.getByTestId("return-submit-button");

    await userEvent.click(submitBtn);

    expect(submitFn).toHaveBeenCalled();
  });
});
