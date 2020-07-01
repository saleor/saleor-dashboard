import { Selector, t } from "testcafe";

export default class HomePage {
  constructor() {
    this.header = Selector('[data-test="home-header"]');
    this.catalogMenu = Selector('[data-test="Catalog"]');
    this.productsSubMenu = Selector(
      '[data-test="catalogue"]>[aria-label="products"]'
    );
  }
}
