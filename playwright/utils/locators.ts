import { type Locator, type Page } from "@playwright/test";

/**
 * Resolves the native `<input>` for a test id regardless of where the id lands.
 *
 * MUI `TextField` puts `data-test-id` on the wrapper (input is a descendant),
 * macaw-ui-next `Input` puts it on the `<input>` itself. The dashboard is
 * migrating from the former to the latter, so match both shapes.
 */
export const inputByTestId = (scope: Page | Locator, testId: string): Locator =>
  scope.locator(`[data-test-id="${testId}"] input, input[data-test-id="${testId}"]`);

/** Same split as `inputByTestId`, for MUI `TextField` multiline vs macaw `Textarea`. */
export const textareaByTestId = (scope: Page | Locator, testId: string): Locator =>
  scope.locator(`[data-test-id="${testId}"] textarea, textarea[data-test-id="${testId}"]`);
