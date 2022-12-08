/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");

/*
  react-virtualized has broken ESM file, we need to patch this manually:
  Ref: https://github.com/vitejs/vite/issues/1652#issuecomment-765875146
*/

const dep =
  "node_modules/react-virtualized/dist/es/WindowScroller/utils/onScroll.js";
const code = fs
  .readFileSync(dep, "utf-8")
  .replace(
    'import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";',
    "",
  );

fs.writeFileSync(dep, code);
