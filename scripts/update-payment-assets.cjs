/**
 * Fetch payment method icons from https://github.com/activemerchant/payment_icons/tree/master
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const TARGET_DIR = path.resolve(__dirname, "..", "public", "payment-methods");
const TEMP_DIR = path.resolve(__dirname, "..", ".tmp-payment-icons");
const TARBALL_PATH = path.join(TEMP_DIR, "payment-icons.tar.gz");
const TARBALL_URL =
  "https://github.com/activemerchant/payment_icons/archive/refs/heads/master.tar.gz";

fs.rmSync(TEMP_DIR, { recursive: true, force: true });
fs.mkdirSync(TEMP_DIR, { recursive: true });
fs.mkdirSync(TARGET_DIR, { recursive: true });

console.log("Downloading payment icons from activemerchant/payment_icons...");
execFileSync("curl", ["-sL", "-o", TARBALL_PATH, TARBALL_URL], {
  stdio: "inherit",
});

execFileSync("tar", ["xzf", TARBALL_PATH, "-C", TEMP_DIR], {
  stdio: "inherit",
});

const sourceDir = path.join(
  TEMP_DIR,
  "payment_icons-master",
  "app",
  "assets",
  "images",
  "payment_icons",
);
const files = fs.readdirSync(sourceDir).filter(f => f.endsWith(".svg"));

for (const file of files) {
  fs.copyFileSync(path.join(sourceDir, file), path.join(TARGET_DIR, file));
}

fs.rmSync(TEMP_DIR, { recursive: true, force: true });
console.log(`Copied ${files.length} payment method icons to ${TARGET_DIR}`);
