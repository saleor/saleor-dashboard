import type { Page } from "@playwright/test";
import { BasePage } from "@pages/basePage";
import { URL_LIST } from "@data/url";
import { DeleteDialog } from "./dialogs/deleteDialog";


export class AppPage extends BasePage {
    readonly page: Page;
    readonly basePage: BasePage;
    readonly deleteAppDialog: DeleteDialog;


    constructor(
        page: Page,
        readonly deleteButton = page.getByText("Delete"),
        readonly appSettingsButton = page.getByTestId("app-settings-button"),
    ) {
        super(page);
        this.page = page;
        this.basePage = new BasePage(page);
        this.deleteAppDialog = new DeleteDialog(page);
    }

    async goToExistingAppPage(appId: string) {
        const appUrl = URL_LIST.apps + appId;
        await this.page.goto(appUrl);
    }

    async clickAppSettingsButton() {
        await this.appSettingsButton.click();
    }

}
