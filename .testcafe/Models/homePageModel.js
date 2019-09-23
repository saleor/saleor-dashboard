import { Selector, t } from "testcafe";

export default class HomePage {
  constructor() {
    this.header = Selector('[data-tc="home-header"]');
    this.catalogMenu = Selector('[data-tc="Catalog"]');
    this.productsSubMenu = Selector(
      '[data-tc="catalogue"]>[aria-label="products"]'
    );
  }
}
