import type { Page } from "@playwright/test";
import faker from "faker";


export class EditAttributeValueDialog {
    readonly page: Page;

    constructor(
        page: Page,
        readonly saveButton = page.getByTestId("submit"),
        readonly cancelButton = page.getByTestId("back"),
        readonly valueInput = page.getByTestId("value-name"),
    ) {
        this.page = page;
    }

    async provideNewAttributeValue(newValue: string = faker.lorem.word(5)) {
        await this.valueInput.clear();
        await this.valueInput.fill(newValue);
    }
    async saveNewAttributeValue() {
        await this.saveButton.click();
    }
}
