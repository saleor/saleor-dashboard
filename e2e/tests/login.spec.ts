import { ADMIN } from "../config.ts";
import { test } from "../fixtures/test.ts";
import { LoginPage } from "../pages/loginPage.ts";

/**
 * The suite's proof of life: signing in through the UI exercises the whole stack at once -
 * the Saleor image, the seeded users, the dashboard build being served - and depends on
 * nothing the seed does beyond existing.
 *
 * One actor is enough. The login flow is the same code for every user on both sides, so
 * repeating it per permission group asserts the same thing fourteen more times. That each
 * seeded staff user *can* authenticate is already covered, quietly, by global setup: it
 * signs every actor in over the API, and a run cannot start if one of them fails.
 *
 * Not tagged `parallel()`: signing in is rate-limited per IP - see the README.
 *
 * `anonymous`: this test does the signing in itself, so no stored session is loaded.
 */
test.use({ actor: "anonymous" });

test("Sign in as the superuser #e2e", async ({ page }) => {
  // Arrange
  const login = new LoginPage(page);

  // Act & Assert
  await login.loginViaUI(ADMIN.email, ADMIN.password);
});
