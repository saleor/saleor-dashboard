import parser from "@typescript-eslint/parser";
import { ESLint, type Linter } from "eslint";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { performance } from "node:perf_hooks";

// Evaluation only: neither configuration replaces the normal CI/pre-commit checks.
const outputDirectory = resolve(process.argv[2] ?? ".context/compiler-evaluation");
mkdirSync(outputDirectory, { recursive: true });
const configured = await new ESLint().calculateConfigForFile("src/index.tsx");
const configuredRules: Linter.RulesRecord = configured.rules;
const compilerRules = Object.fromEntries(
  Object.entries(configuredRules).filter(([name]) => name.startsWith("react-hooks/")),
);
const unsupported = ["config", "gating", "component-hook-factories"];
const nativeRules = Object.fromEntries(
  Object.entries(compilerRules)
    .filter(([name]) => !unsupported.includes(name.replace("react-hooks/", "")))
    .map(([name, value]) => [name.replace("react-hooks/", "react/"), value]),
);
const oxlintConfig: { ignorePatterns: string[] } = JSON.parse(
  readFileSync(".oxlintrc.json", "utf8"),
);
const nativeConfigPath = join(outputDirectory, "native-config.json");
writeFileSync(
  nativeConfigPath,
  JSON.stringify(
    {
      plugins: ["react"],
      categories: { correctness: "off" },
      rules: nativeRules,
    },
    null,
    2,
  ),
);
const baseline = new ESLint({
  overrideConfigFile: true,
  overrideConfig: [
    { ignores: oxlintConfig.ignorePatterns },
    {
      files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
      languageOptions: { parser },
      plugins: { "react-hooks": configured.plugins["react-hooks"] },
      rules: compilerRules,
      linterOptions: { reportUnusedDisableDirectives: "off" },
    },
  ],
});
const baselineStart = performance.now();
const baselineResults = await baseline.lintFiles(["{src,e2e,e2e-legacy}/**/*.{ts,tsx,js,jsx}"]);
const baselineSeconds = (performance.now() - baselineStart) / 1000;
writeFileSync(join(outputDirectory, "eslint.json"), JSON.stringify(baselineResults, null, 2));
// CLI ignores are relative to the workspace; config-file ignores would be relative
// to the artifact directory and accidentally include generated files.
const nativeArguments = [
  "exec",
  "oxlint",
  "-c",
  nativeConfigPath,
  "--disable-nested-config",
  ...oxlintConfig.ignorePatterns.flatMap(pattern => ["--ignore-pattern", pattern]),
  "src",
  "e2e",
  "e2e-legacy",
];
const nativeFiles = execFileSync("pnpm", [...nativeArguments, "--debug=files"], {
  encoding: "utf8",
})
  .trim()
  .split("\n")
  .sort();
const baselineFiles = baselineResults
  .map(result => relative(process.cwd(), result.filePath))
  .sort();
if (JSON.stringify(nativeFiles) !== JSON.stringify(baselineFiles)) {
  throw new Error("Linter file scopes differ; comparison aborted.");
}
writeFileSync(join(outputDirectory, "files.json"), JSON.stringify(baselineFiles, null, 2));
const nativeStart = performance.now();
const nativeOutput = execFileSync("pnpm", [...nativeArguments, "-f", "json"], {
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
});
const nativeSeconds = (performance.now() - nativeStart) / 1000;
writeFileSync(join(outputDirectory, "oxlint.json"), nativeOutput);

interface Diagnostic {
  file: string;
  rule: string;
  severity: number;
  line: number;
  column: number;
  message: string;
}
interface NativeDiagnostic {
  filename: string;
  code: string;
  severity: string;
  message: string;
  labels: { span: { line: number; column: number } }[];
}
const eslintDiagnostics: Diagnostic[] = baselineResults.flatMap(result =>
  result.messages
    .filter(message => message.ruleId?.startsWith("react-hooks/"))
    .map(message => ({
      file: relative(process.cwd(), result.filePath),
      rule: (message.ruleId ?? "").replace("react-hooks/", ""),
      severity: message.severity,
      line: message.line,
      column: message.column,
      message: message.message,
    })),
);
const nativeResults: { diagnostics: NativeDiagnostic[] } = JSON.parse(nativeOutput);
const oxlintDiagnostics: Diagnostic[] = nativeResults.diagnostics.map(diagnostic => ({
  file: relative(process.cwd(), resolve(diagnostic.filename)),
  rule: diagnostic.code.replace(/^react\((.*)\)$/, "$1"),
  severity: diagnostic.severity === "warning" ? 1 : 2,
  line: diagnostic.labels[0]?.span.line ?? 0,
  column: diagnostic.labels[0]?.span.column ?? 0,
  message: diagnostic.message,
}));
// Match a multiset: repeated warnings at one location must not disappear in a Set.
const remaining = [...oxlintDiagnostics];
const baselineOnly: Diagnostic[] = [];
let matched = 0;
for (const diagnostic of eslintDiagnostics) {
  const index = remaining.findIndex(
    candidate =>
      candidate.file === diagnostic.file &&
      candidate.rule === diagnostic.rule &&
      candidate.severity === diagnostic.severity &&
      candidate.line === diagnostic.line &&
      candidate.column === diagnostic.column,
  );
  if (index === -1) baselineOnly.push(diagnostic);
  else {
    remaining.splice(index, 1);
    matched += 1;
  }
}
// Probe compiler-level suppression, which is broader than an individual rule disable.
const probeSource = `import { useEffect, useState } from "react";
export function Probe() {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(1);
  }, []);
  return <div>{value}</div>;
}
`;
const probes = [];
for (const directive of ["none", "eslint", "oxlint"]) {
  const source =
    directive === "none"
      ? probeSource
      : probeSource.replace(
          "  }, []);",
          `  // ${directive}-disable-next-line react-hooks/exhaustive-deps\n  }, []);`,
        );
  const probePath = join(outputDirectory, `suppression-${directive}.tsx`);
  writeFileSync(probePath, source);
  const eslintProbe = await baseline.lintText(source, {
    filePath: "src/CompilerSuppressionProbe.tsx",
  });
  const nativeProbe: { diagnostics: NativeDiagnostic[] } = JSON.parse(
    execFileSync(
      "pnpm",
      ["exec", "oxlint", "-c", nativeConfigPath, "--no-ignore", "-f", "json", probePath],
      { encoding: "utf8" },
    ),
  );
  probes.push({
    directive,
    eslint: eslintProbe.flatMap(result => result.messages.map(message => message.ruleId)),
    oxlint: nativeProbe.diagnostics.map(diagnostic => diagnostic.code),
  });
}
const summary = {
  sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
  fileCount: baselineFiles.length,
  versions: {
    oxlint: execFileSync("pnpm", ["exec", "oxlint", "--version"], { encoding: "utf8" }).trim(),
    reactHooks: JSON.parse(
      readFileSync("node_modules/eslint-plugin-react-hooks/package.json", "utf8"),
    ).version,
  },
  baselineSeconds,
  nativeSeconds,
  unsupported,
  probes,
  matched,
  rules: Object.keys(compilerRules).map(name => {
    const rule = name.replace("react-hooks/", "");
    return {
      rule,
      eslint: eslintDiagnostics.filter(diagnostic => diagnostic.rule === rule).length,
      oxlint: oxlintDiagnostics.filter(diagnostic => diagnostic.rule === rule).length,
      // File/rule overlap is a triage aid, not proof of equivalent findings.
      sharedFileInstances: [
        ...new Set(
          eslintDiagnostics
            .filter(diagnostic => diagnostic.rule === rule)
            .map(diagnostic => diagnostic.file),
        ),
      ].reduce(
        (total, file) =>
          total +
          Math.min(
            eslintDiagnostics.filter(
              diagnostic => diagnostic.rule === rule && diagnostic.file === file,
            ).length,
            oxlintDiagnostics.filter(
              diagnostic => diagnostic.rule === rule && diagnostic.file === file,
            ).length,
          ),
        0,
      ),
      baselineOnly: baselineOnly.filter(diagnostic => diagnostic.rule === rule).length,
      nativeOnly: remaining.filter(diagnostic => diagnostic.rule === rule).length,
    };
  }),
  baselineOnly,
  nativeOnly: remaining,
};
writeFileSync(join(outputDirectory, "comparison.json"), JSON.stringify(summary, null, 2));
console.log(
  JSON.stringify(
    { ...summary, baselineOnly: baselineOnly.length, nativeOnly: remaining.length },
    null,
    2,
  ),
);
if (baselineResults.some(result => result.errorCount > 0)) {
  throw new Error(
    "ESLint evaluation reported errors; inspect eslint.json before using the comparison.",
  );
}
