import type { Page } from "@playwright/test";

export class DeleteAttributeValueDialog {
    readonly page: Page;

    constructor(
        page: Page,
        readonly deleteButton = page.getByTestId("submit"),
        readonly cancelButton = page.getByTestId("back"),
        readonly deleteAttributesDialogText = page.getByTestId("delete-attribute-value-dialog-text"),
    ) {
        this.page = page;
    }

    async deleteAttributeValue() {
        await this.deleteButton.click();
    }
}
