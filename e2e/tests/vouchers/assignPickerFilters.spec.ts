import { e2eConfig } from "../../config.ts";
import { expect, test as base } from "../../fixtures/test.ts";
import { adminToken, gql } from "../../lib/graphql.ts";
import { VoucherPage } from "../../pages/voucherPage.ts";

/**
 * Every Eligible products picker keeps its filters in the page's URL. A filter applied in one
 * picker used to crash another picker that parsed it, replacing the voucher editor with the
 * error screen.
 */

const config = e2eConfig();

/** A `populatedb` voucher. Choosing Products on it shows the pickers without saving anything. */
const SEEDED_VOUCHER = "Big order discount";

const test = base.extend<{ voucherId: string }>({
  voucherId: async ({ seed }, provide) => {
    void seed;

    const token = await adminToken(config);
    const { vouchers } = await gql<{
      vouchers: { edges: Array<{ node: { id: string } }> } | null;
    }>(
      config,
      `query SeededVoucher($search: String!) {
        vouchers(first: 1, filter: { search: $search }) {
          edges {
            node {
              id
            }
          }
        }
      }`,
      { search: SEEDED_VOUCHER },
      token,
    );
    const id = vouchers?.edges[0]?.node.id;

    if (!id) {
      throw new Error(`the seed has no "${SEEDED_VOUCHER}" voucher`);
    }

    await provide(id);
  },
});

test("Filtering the product picker by attribute keeps the voucher editor #e2e", async ({
  page,
  voucherId,
}) => {
  // Arrange
  const voucher = new VoucherPage(page);

  await voucher.gotoVoucher(voucherId);
  await voucher.chooseProductsScope();
  await voucher.openPicker("products");

  // Act
  await voucher.filterByAttribute("Color");

  // Assert
  await expect(voucher.filtersButton).toContainText(/[1-9]/);
  await expect(voucher.dialog).toBeVisible();
  await expect(voucher.errorScreen).toBeHidden();
});

test("A collection filter does not follow into the product picker #e2e", async ({
  page,
  voucherId,
}) => {
  // Arrange
  const voucher = new VoucherPage(page);

  await voucher.gotoVoucher(voucherId);
  await voucher.chooseProductsScope();
  await voucher.openPicker("collections");
  await voucher.filterPublishedIn("Channel-PLN");
  await expect(voucher.filtersButton).toContainText(/[1-9]/);

  // Act
  await voucher.closePicker();
  await voucher.openPicker("products");

  // Assert
  await expect(page).not.toHaveURL(/[?&]\d+(\[|%5B)/);
  await expect(voucher.filtersButton).not.toContainText(/\d/);
  await expect(voucher.errorScreen).toBeHidden();
});

test("Filtering collections on Create voucher keeps the editor #e2e", async ({ page }) => {
  // Arrange
  const voucher = new VoucherPage(page);

  await voucher.gotoCreate();
  await voucher.chooseProductsScope();
  await voucher.openPicker("collections");

  // Act
  await voucher.filterPublishedIn("Channel-PLN");

  // Assert
  await expect(voucher.filtersButton).toContainText(/[1-9]/);
  await expect(voucher.dialog).toBeVisible();
  await expect(voucher.errorScreen).toBeHidden();
});
