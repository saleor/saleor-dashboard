import { Button } from "@saleor/macaw-ui-next";
import { isValidElement, type ReactElement } from "react";

import { ButtonGroupWithDropdown } from "../ButtonGroupWithDropdown/ButtonGroupWithDropdown";
import {
  coerceHeaderEndActions,
  DETAIL_SETTINGS_CARD_HEADER_ACTION_SIZE,
} from "./coerceHeaderEndActions";

describe("coerceHeaderEndActions", () => {
  it("sets macaw Button size to small when omitted", () => {
    // Arrange
    const input = <Button variant="secondary">Assign</Button>;

    // Act
    const result = coerceHeaderEndActions(input) as ReactElement<{ size?: string }>;

    // Assert
    expect(isValidElement(result)).toBe(true);
    expect(result.props.size).toBe(DETAIL_SETTINGS_CARD_HEADER_ACTION_SIZE);
  });

  it("does not override an explicit Button size", () => {
    // Arrange
    const input = (
      <Button variant="secondary" size="medium">
        Assign
      </Button>
    );

    // Act
    const result = coerceHeaderEndActions(input) as ReactElement<{ size?: string }>;

    // Assert
    expect(result.props.size).toBe("medium");
  });

  it("sets ButtonGroupWithDropdown size through a layout wrapper", () => {
    // Arrange
    const input = (
      <div>
        <ButtonGroupWithDropdown variant="secondary" options={[]} onClick={() => undefined}>
          Assign attribute
        </ButtonGroupWithDropdown>
      </div>
    );

    // Act
    const result = coerceHeaderEndActions(input) as ReactElement<{ children?: unknown }>;
    const child = result.props.children as ReactElement<{ size?: string }>;

    // Assert
    expect(child.props.size).toBe(DETAIL_SETTINGS_CARD_HEADER_ACTION_SIZE);
  });
});
