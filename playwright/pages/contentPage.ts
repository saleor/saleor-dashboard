import type { Page } from "@playwright/test";
import { ContentCreateDialog } from "@dialogs/contentCreateDialog";


export class ContentPage {
  readonly page: Page;
  contentCreateDialog: ContentCreateDialog;

  constructor(
    page: Page,
    readonly createContentButton = page.getByTestId("create-page"),
  ) {
    this.page = page;
    this.contentCreateDialog = new ContentCreateDialog(page)
  }

  async clickCreateContent() {
    await this.createContentButton.click();
  }
  async fillTitle(){

  }

  async fillContent(){

  }

  async addAttribute(){

  }

  async addMetadata(){

  }

  async addPrivateMetadata(){
    
  }
}
