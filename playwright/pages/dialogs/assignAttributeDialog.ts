import { Page, expect } from "@playwright/test";

export class AssignAttributeDialog {
    readonly page: Page;

    constructor(
        page: Page,
        readonly assignAttributesSearchInput =
            page.getByTestId("attribute-search-input").locator("input"),
        readonly attributesList = page.getByTestId("attributes-list"),
        readonly assignAndSaveButton = page.getByTestId("assign-and-save-button"),
    ) {
        this.page = page;
    }

    async searchAttribute(attributeName: string) {
        await this.assignAttributesSearchInput.fill(attributeName);
        await expect(this.attributesList).toContainText(attributeName);
    }

    async clickAssignAndSaveButton() {
        await this.assignAndSaveButton.click();
        await this.assignAndSaveButton.waitFor({ state: "hidden" });
    }

    async assignSpecificAttributeByNameAndSave(attributeName: string) {
        const specificAttributeCheckbox = await this.page
            .getByRole("row", { name: attributeName })
            .getByRole("checkbox");
        await this.attributesList.waitFor({ state: "visible" });
        await this.searchAttribute(attributeName);
        await specificAttributeCheckbox.click();
        await this.clickAssignAndSaveButton();
        await this.assignAndSaveButton.waitFor({ state: "hidden" });
    }

}
