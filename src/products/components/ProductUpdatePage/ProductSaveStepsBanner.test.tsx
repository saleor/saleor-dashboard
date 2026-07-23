import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  createInitialProductSaveSteps,
  setProductSaveStepStatus,
} from "../../views/ProductUpdate/handlers/productSaveSteps";
import { ProductSaveStepsBanner } from "./ProductSaveStepsBanner";

describe("ProductSaveStepsBanner", () => {
  it("renders nothing when every step is skipped", () => {
    // Arrange / Act
    render(
      <Wrapper>
        <ProductSaveStepsBanner steps={createInitialProductSaveSteps()} onDismiss={jest.fn()} />
      </Wrapper>,
    );

    // Assert
    expect(screen.queryByTestId("product-save-steps-banner")).not.toBeInTheDocument();
  });

  it("shows succeeded and failed steps and hides skipped ones", () => {
    // Arrange
    let steps = createInitialProductSaveSteps();

    steps = setProductSaveStepStatus(steps, "product", "success");
    steps = setProductSaveStepStatus(steps, "channels", "error");

    // Act
    render(
      <Wrapper>
        <ProductSaveStepsBanner steps={steps} onDismiss={jest.fn()} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("product-save-steps-banner")).toBeInTheDocument();
    expect(screen.getByTestId("save-step-product-success")).toHaveTextContent(/saved/i);
    expect(screen.getByTestId("save-step-channels-error")).toHaveTextContent(/failed/i);
    expect(screen.queryByTestId("save-step-files-skipped")).not.toBeInTheDocument();
    expect(screen.queryByTestId("save-step-variantUpdate-skipped")).not.toBeInTheDocument();
  });

  it("calls onDismiss when dismiss is clicked", async () => {
    // Arrange
    const onDismiss = jest.fn();
    let steps = createInitialProductSaveSteps();

    steps = setProductSaveStepStatus(steps, "product", "error");

    const user = userEvent.setup();

    render(
      <Wrapper>
        <ProductSaveStepsBanner steps={steps} onDismiss={onDismiss} />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getByTestId("dismiss-save-steps"));

    // Assert
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
