import { type Locator, type Page, type Response } from "@playwright/test";

import { expect, test } from "../fixtures/test.ts";
import { type PermissionActor } from "../lib/actors.ts";
import { Navigation } from "../pages/navigation.ts";

/**
 * Smoke test of permission-aware rendering: a staff user holding a single permission walks
 * the pages that permission opens, and no request the dashboard makes on the way may come
 * back denied - or with any other GraphQL error, or crash the page.
 *
 * A page that asks for a field its user cannot read is the bug this catches: the dashboard
 * should leave such fields out (`@include(if: $PERMISSION_...)`) rather than query them and
 * absorb the error. Each step is one page, so a failure names it.
 *
 * The saves also assert the mutation's payload `errors`.
 */
type Step = [name: string, run: (nav: Navigation) => Promise<void>];

const UNFULFILLED_ORDERS = "/orders?0%5Bs0.status%5D=UNFULFILLED";

/** Pages every staff user reaches, whatever their permissions. */
const SHARED: Step[] = [
  ["home", nav => nav.sidebarTo("Home")],
  ["installed extensions", nav => nav.sidebarTo("Extensions")],
  ["explore extensions", nav => nav.sidebarTo("Extensions", "Explore")],
  /* No sidebar entry leads here for a user without a configuration permission. */
  ["taxes", async ({ page }) => void (await page.goto("/taxes"))],
  ["own account", nav => nav.openOwnAccount()],
  ["navigator search", nav => nav.searchNavigator("a")],
];

const open = (name: string): Step => [name, nav => nav.openFirstRow()];

const WALKS: Record<PermissionActor, Step[]> = {
  product: [
    ["products", nav => nav.sidebarTo("Catalog", "Products")],
    open("product"),
    [
      "variant",
      async ({ page }) => {
        await page.getByTestId("row-action-button").first().click();
        await page.waitForURL(/\/variant\//);
      },
    ],
    ["categories", nav => nav.sidebarTo("Catalog", "Categories")],
    open("category"),
    ["collections", nav => nav.sidebarTo("Catalog", "Collections")],
    open("collection"),
    ["warehouses", nav => nav.configurationTo("Warehouses")],
    open("warehouse"),
  ],
  productTypeAndAttribute: [
    ["product types", nav => nav.configurationTo("Product Types")],
    open("product type"),
    ["product attributes", nav => nav.configurationTo("Product attributes")],
    open("attribute"),
  ],
  page: [["models", nav => nav.sidebarTo("Modeling", "Models")], open("model")],
  pageTypeAndAttribute: [
    ["model types", nav => nav.sidebarTo("Modeling", "Model Types")],
    open("model type"),
    ["model attributes", nav => nav.configurationTo("Model attributes")],
    open("attribute"),
  ],
  customerTypeAndAttribute: [
    ["customer types", nav => nav.configurationTo("Customer Types")],
    open("customer type"),
    /* populatedb seeds no customer attributes, so there is no row to open. */
    ["customer attributes", nav => nav.configurationTo("Customer attributes")],
  ],
  order: [
    ["orders", nav => nav.sidebarTo("Fulfillment", "Orders")],
    [
      "unfulfilled order",
      async nav => {
        await nav.page.goto(UNFULFILLED_ORDERS);
        await nav.openFirstRow();
      },
    ],
    /*
     * By URL: populatedb's orders are random, and the fulfill button is disabled on the
     * unpaid ones. The page is the point, not the button.
     */
    [
      "fulfill",
      async ({ page }) => void (await page.goto(`${new URL(page.url()).pathname}/fulfill`)),
    ],
    ["drafts", nav => nav.sidebarTo("Fulfillment", "Drafts")],
    ["customers", nav => nav.sidebarTo("Customers")],
    open("customer"),
  ],
  customer: [
    ["customers", nav => nav.sidebarTo("Customers")],
    open("customer"),
    [
      "addresses",
      async ({ page }) => {
        /* The button sits inside its link, which takes the click. */
        await page
          .getByRole("link")
          .filter({ has: page.getByTestId("manage-addresses") })
          .click();
        await page.waitForURL(/\/addresses/);
      },
    ],
  ],
  staff: [
    ["staff members", nav => nav.configurationTo("Staff Members")],
    open("staff member"),
    ["permission groups", nav => nav.configurationTo("Permission Groups")],
    open("permission group"),
    ["customers", nav => nav.sidebarTo("Customers")],
  ],
  giftCard: [
    ["gift cards", nav => nav.sidebarTo("Catalog", "Gift Cards")],
    open("gift card"),
    ["gift card settings", nav => nav.configurationTo("Gift Cards")],
  ],
  discount: [
    ["promotions", nav => nav.sidebarTo("Discounts", "Promotions")],
    open("promotion"),
    ["vouchers", nav => nav.sidebarTo("Discounts", "Vouchers")],
    open("voucher"),
  ],
  menu: [["structures", nav => nav.sidebarTo("Modeling", "Structures")], open("structure")],
  shipping: [
    ["shipping zones", nav => nav.configurationTo("Shipping Methods")],
    open("shipping zone"),
    [
      "shipping rate",
      async ({ page }) => {
        await page
          .getByTestId("shipping-method-row")
          .first()
          .getByRole("button", { name: "Edit" })
          .click();
        await page.waitForURL(/\/shipping\/[^/]+\/[^/]+$/);
      },
    ],
  ],
  settings: [
    ["store settings", nav => nav.configurationTo("Store")],
    ["order settings", nav => nav.configurationTo("Orders & fulfillment")],
    /* Linked only from inside other pages, not from configuration. */
    ["refund settings", async ({ page }) => void (await page.goto("/refunds-settings"))],
  ],
  plugin: [
    ["notifications", nav => nav.configurationTo("Notifications")],
    ["installed extensions", nav => nav.sidebarTo("Extensions")],
    [
      "plugin",
      async ({ page }) => {
        await page.getByTestId("installed-extension-row").first().getByRole("link").first().click();
        await page.waitForURL(/\/extensions\/plugin\//);
      },
    ],
  ],
  channel: [["channels", nav => nav.configurationTo("Channels")], open("channel")],
  translations: [
    ["languages", nav => nav.sidebarTo("Translations")],
    [
      "Polish",
      async ({ page }) => {
        await page.getByText("Polish", { exact: true }).click();
        await page.waitForURL(/\/translations\/PL/);
      },
    ],
    [
      "product translation",
      async nav => {
        await nav.page.getByRole("tab", { name: "Products" }).click();
        await nav.openFirstRow();
      },
    ],
  ],
  app: [
    [
      "add extension manually",
      async nav => {
        const { page } = nav;

        await nav.sidebarTo("Extensions", "Explore");
        await page.getByTestId("add-extension-button").click();
        await page.getByTestId("add-custom-extension").click();
        await page.waitForURL(/\/extensions\/custom\//);
      },
    ],
  ],
  /* These permissions open no section of their own; the shared pages are their walk. */
  checkout: [],
  orderImport: [],
  payment: [],
  taxes: [],
};

const NOTE = "Checked by the permissions smoke test";

const isMutation = (response: Response): boolean =>
  /^\s*mutation\b/.test(response.request().postDataJSON()?.query ?? "");

/**
 * Appends to a field's value and saves through the save bar. Waits for the mutation itself:
 * its payload `errors` are what `graphqlErrors` then asserts on.
 */
const editAndSave =
  (field: (page: Page) => Locator) =>
  async ({ page }: Navigation): Promise<void> => {
    const input = field(page);

    await input.fill(`${await input.inputValue()} (edited)`.trim());

    const saved = page.waitForResponse(isMutation);

    await page.getByTestId("button-bar-confirm").click();
    await saved;
  };

/** Adds a note to the timeline of the order or gift card on the page. */
const addNote = async ({ page }: Navigation): Promise<void> => {
  const note = page.locator('textarea[name="message"]');

  await note.fill(NOTE);
  await note.press("ControlOrMeta+Enter");
  await expect(page.getByText(NOTE)).toBeVisible();
};

const openFirst =
  (...labels: string[]) =>
  async (nav: Navigation): Promise<void> => {
    await nav.sidebarTo(...labels);
    await nav.openFirstRow();
  };

const openFirstConfiguration =
  (label: string) =>
  async (nav: Navigation): Promise<void> => {
    await nav.configurationTo(label);
    await nav.openFirstRow();
  };

const byTestId =
  (testId: string) =>
  (page: Page): Locator =>
    page.getByTestId(testId);

interface Save {
  open: (nav: Navigation) => Promise<void>;
  save: (nav: Navigation) => Promise<void>;
}

const SAVES: Partial<Record<PermissionActor, Save>> = {
  /* A category: populatedb leaves required product attributes empty, so no product saves. */
  product: {
    open: openFirst("Catalog", "Categories"),
    save: editAndSave(byTestId("category-name-input")),
  },
  page: {
    open: openFirst("Modeling", "Models"),
    save: editAndSave(page => page.locator('input[name="title"]')),
  },
  order: { open: openFirst("Fulfillment", "Orders"), save: addNote },
  customer: { open: openFirst("Customers"), save: editAndSave(byTestId("customer-note")) },
  /* Every seeded group holds a permission this user lacks, which makes it read-only to them. */
  staff: {
    open: async nav => {
      await nav.configurationTo("Permission Groups");
      await nav.page.getByTestId("create-permission-group").click();
    },
    save: editAndSave(byTestId("permission-group-name-input")),
  },
  discount: {
    open: openFirst("Discounts", "Vouchers"),
    save: editAndSave(byTestId("voucher-name-input")),
  },
  giftCard: { open: openFirst("Catalog", "Gift Cards"), save: addNote },
  shipping: {
    open: openFirstConfiguration("Shipping Methods"),
    save: editAndSave(byTestId("shipping-zone-name")),
  },
  channel: {
    open: openFirstConfiguration("Channels"),
    save: editAndSave(page => page.locator('input[name="name"]')),
  },
  settings: {
    open: nav => nav.configurationTo("Store"),
    save: editAndSave(byTestId("store-name-input")),
  },
  translations: {
    open: async nav => {
      await nav.sidebarTo("Translations");
      await nav.page.getByText("Polish", { exact: true }).click();
      await nav.page.getByRole("tab", { name: "Products" }).click();
      await nav.openFirstRow();
    },
    save: async nav => {
      await nav.page.getByTestId("edit-name").click();
      await editAndSave(byTestId("translation-field"))(nav);
    },
  },
  menu: { open: openFirst("Modeling", "Structures"), save: editAndSave(byTestId("menu-name")) },
  /* Holds nothing but HANDLE_PAYMENTS: the save every staff user can make. */
  payment: { open: nav => nav.openOwnAccount(), save: editAndSave(byTestId("staffFirstName")) },
};

test.beforeEach(async ({ page }) => {
  /* The announcement popover covers the user menu whenever it shows up. */
  await page.addLocatorHandler(
    page.getByTestId("ripple-video-announcement-dismiss"),
    dismiss => dismiss.click(),
    { noWaitAfter: true },
  );
  await page.goto("/");
});

const runStep = async (
  nav: Navigation,
  check: () => Promise<void>,
  [name, run]: Step,
): Promise<void> =>
  test.step(name, async () => {
    await run(nav);
    await check();
    await expect.soft(nav.page.getByText("Sorry, the page was not found")).toHaveCount(0);
  });

/*
 * Serial, though the walks only read: a failing `parallel()` group skips every project that
 * depends on it, and these are expected to fail until the leaks they find are fixed.
 */
test.describe("Single-permission staff walk their pages without GraphQL errors", () => {
  for (const [actor, steps] of Object.entries(WALKS)) {
    test.describe(actor, () => {
      test.use({ actor });

      test(`${actor} walks their pages #e2e`, async ({ page, graphqlErrors }) => {
        // Arrange
        test.setTimeout(180_000);

        const nav = new Navigation(page);

        // Act & Assert
        for (const step of [...steps, ...SHARED]) {
          await runStep(nav, graphqlErrors.expectNone, step);
        }
      });
    });
  }
});

test.describe("Single-permission staff save without GraphQL errors", () => {
  for (const [actor, { open, save }] of Object.entries(SAVES)) {
    test.describe(actor, () => {
      test.use({ actor });

      test(`${actor} saves a change #e2e`, async ({ page, graphqlErrors }) => {
        // Arrange
        const nav = new Navigation(page);

        await runStep(nav, graphqlErrors.expectNone, ["open", open]);

        // Act & Assert
        await runStep(nav, graphqlErrors.expectNone, ["save", save]);
      });
    });
  }
});
