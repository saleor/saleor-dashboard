/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const graphql = require("graphql");
const schema = require("../introspection.json");

const clientSchema = graphql.buildClientSchema(schema);
const schemaString = graphql.printSchema(clientSchema);

fs.writeFile("schema.graphql", schemaString, err => {
  if (err) {
    throw err;
  }
  console.log("🚀 Schema from instrospection built successfully\n");
});
