// Workaround. Since there is small difference between loaded package of csstype (React one vs MUI),
// we had to explicitly point which csstype we want to use.
declare module "csstype" {
  export * from "node_modules/csstype";
}
