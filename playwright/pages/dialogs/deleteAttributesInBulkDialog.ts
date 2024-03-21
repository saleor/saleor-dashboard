import type { Page } from "@playwright/test";

export class DeleteAttributesInBulkDialog {
    readonly page: Page;

    constructor(
        page: Page,
        readonly deleteButton = page.getByTestId("submit"),
        readonly cancelButton = page.getByTestId("back"),
        readonly deleteAttributesDialogText = page.getByTestId("delete-attr-from-list-dialog-text"),
    ) {
        this.page = page;
    }

    async deleteSelectedAttributes() {
        await this.deleteButton.click();
    }
}
