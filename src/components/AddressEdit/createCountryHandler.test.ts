import { ChangeEvent } from "react";

import { createCountryHandler } from "./createCountryHandler";

describe("createCountryHandler", () => {
  it("calls original country handler and restets the country area field", () => {
    // Arrange
    const originalCountryHandler = jest.fn();
    const setFn = jest.fn();
    const exampleEvent = { target: "some event" } as ChangeEvent<any>;
    const newHandler = createCountryHandler(originalCountryHandler, setFn);

    // Act
    newHandler(exampleEvent);
    // Assert
    expect(originalCountryHandler).toBeCalledWith(exampleEvent);
    expect(setFn).toBeCalledWith({ countryArea: "" });
  });
});
