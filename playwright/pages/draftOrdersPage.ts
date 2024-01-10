import { URL_LIST } from "@data/url";
import { AddProductsDialog } from "@dialogs/addProductsDialog";
import { AddressDialog } from "@dialogs/addressDialog";
import { DeleteDialog } from "@dialogs/deleteDialog";
import { DraftOrderCreateDialog } from "@dialogs/draftOrderCreateDialog";
import { ShippingAddressDialog } from "@dialogs/shippingMethodDialog";
import { RightSideDetailsPage } from "@pageElements/rightSideDetailsSection";
import { BasePage } from "@pages/basePage";
import type { Page } from "@playwright/test";

export class DraftOrdersPage extends BasePage {
  readonly page: Page;
  readonly deleteDraftOrdersDialog: DeleteDialog;
  readonly draftOrderCreateDialog: DraftOrderCreateDialog;
  readonly addProductsDialog: AddProductsDialog;
  readonly rightSideDetailsPage: RightSideDetailsPage;
  readonly addressDialog: AddressDialog;
  readonly shippingAddressDialog: ShippingAddressDialog;
  constructor(
    page: Page,
    readonly createDraftOrderButton = page.getByTestId(
      "create-draft-order-button",
    ),
    readonly bulkDeleteButton = page.getByTestId("bulk-delete-button"),
    readonly addProducts = page.getByTestId("add-products-button"),
    readonly finalizeButton = page.getByTestId("button-bar-confirm"),
    readonly addShippingCarrierLink = page.getByTestId("add-shipping-carrier"),
  ) {
    super(page);
    this.page = page;
    this.deleteDraftOrdersDialog = new DeleteDialog(page);
    this.draftOrderCreateDialog = new DraftOrderCreateDialog(page);
    this.addProductsDialog = new AddProductsDialog(page);
    this.rightSideDetailsPage = new RightSideDetailsPage(page);
    this.addressDialog = new AddressDialog(page);
    this.shippingAddressDialog = new ShippingAddressDialog(page);
  }

  async clickCreateDraftOrderButton() {
    await this.createDraftOrderButton.click();
  }
  async goToDraftOrdersListView() {
    await this.page.goto(URL_LIST.draftOrders);
  }

  async clickBulkDeleteButton() {
    await this.bulkDeleteButton.click();
  }

  async clickAddProductsButton() {
    await this.addProducts.click();
  }

  async clickAddShippingCarrierButton() {
    await this.addShippingCarrierLink.click();
  }

  async clickFinalizeButton() {
    await this.finalizeButton.click();
  }
}
