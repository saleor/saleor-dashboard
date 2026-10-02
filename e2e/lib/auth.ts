import fs from "node:fs";
import path from "node:path";

import type { E2eConfig } from "../config.ts";
import { type Actor, credentialsFor } from "./actors.ts";
import { imageId } from "./docker.ts";
import { signIn } from "./graphql.ts";
import { cacheDir } from "./seed.ts";

/**
 * A signed-in browser state for an actor.
 *
 * The dashboard reads its refresh token from `localStorage._saleorRefreshToken` on start
 * (see `src/auth/tokenStorage.ts`, which names this a public contract), so a session is
 * just that one entry - no UI login, no cookies to carry.
 *
 * States live under the same image-keyed cache as the seed dumps. That matters: a restored
 * scenario brings the *same* user rows back, so a token survives a per-test reset, but a
 * dump rebuilt from a new Saleor image brings different ones, and a stale token would then
 * fail in a way that looks like a dashboard bug. Sharing the cache key retires both at once.
 */
export const storageStatePath = (config: E2eConfig, actor: Actor) =>
  path.join(cacheDir(config, imageId(config)), "auth", `${actor}.json`);

export const writeStorageState = async (config: E2eConfig, actor: Actor) => {
  const target = storageStatePath(config, actor);

  if (fs.existsSync(target)) {
    return target;
  }

  const { email, password } = credentialsFor(actor);
  const { refreshToken } = await signIn(config, email, password);

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(
    target,
    JSON.stringify(
      {
        cookies: [],
        origins: [
          {
            origin: new URL(config.dashboardUrl).origin,
            localStorage: [{ name: "_saleorRefreshToken", value: refreshToken }],
          },
        ],
      },
      null,
      2,
    ),
  );

  return target;
};
