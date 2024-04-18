import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import InstallWithManifestFormButton from "./InstallWithManifestFormButton";

describe("Apps InstallWithManifestFormButton", () => {
  it("submit form when valid manifest url value passed", async () => {
    // Arrange
    const submitHandler = jest.fn();
    render(
      <Wrapper>
        <InstallWithManifestFormButton onSubmitted={submitHandler} />
      </Wrapper>,
    );
    const user = userEvent.setup();
    const installButton = screen.getAllByTestId("add-app-from-manifest")[0];
    // Act
    await user.click(installButton);
    // Arrange
    const input = screen.getByRole("textbox");
    // Assert
    expect(input).not.toHaveValue();
    // Act
    await user.type(input, "https://example.com/manifest.json");
    // Assert
    expect(input).toHaveValue("https://example.com/manifest.json");
    // Arrange
    const submitButton = screen.getAllByTestId("install-app-from-manifest")[0];
    // Act
    await user.click(submitButton);
    // Assert
    expect(submitHandler).toBeCalledTimes(1);
    expect(submitHandler).toBeCalledWith("https://example.com/manifest.json");
  });
  it("return error when invalid manifest url value passed", async () => {
    // Arrange
    const submitHandler = jest.fn();
    render(
      <Wrapper>
        <InstallWithManifestFormButton onSubmitted={submitHandler} />
      </Wrapper>,
    );
    const user = userEvent.setup();
    const installButton = screen.getAllByTestId("add-app-from-manifest")[0];
    // Act
    await user.click(installButton);
    // Arrange
    const input = screen.getByRole("textbox");
    // Assert
    expect(input).not.toHaveValue();
    // Act
    await user.type(input, "example wrong url");
    // Assert
    expect(input).toHaveValue("example wrong url");
    // Arrange
    const submitButton = screen.getAllByTestId("install-app-from-manifest")[0];
    // Act
    await user.click(submitButton);
    // Assert
    expect(submitHandler).toBeCalledTimes(0);
  });
});
