import * as fs from "fs";
import * as path from "path";

import { forEachFileInSrc } from "./getStrictNullCheckEligibleFiles";
import { normalizeTsconfigPath } from "./tsHelper";

const tsconfigPath = normalizeTsconfigPath(process.argv[2]);
const srcRoot = `${path.dirname(tsconfigPath)}/src`;

updateExcludeInTsConfig();

export async function updateExcludeInTsConfig() {
  const files = await forEachFileInSrc(srcRoot);
  const config = JSON.parse(fs.readFileSync(tsconfigPath).toString());
  const exclude = files.map(f => `src/${path.relative(srcRoot, f)}`);
  config.exclude = exclude;

  fs.writeFileSync(tsconfigPath, JSON.stringify(config, null, 2));
}
