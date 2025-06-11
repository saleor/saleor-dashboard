/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const { buildClientSchema, getIntrospectionQuery, printSchema } = require("graphql");

const dotenv = require("dotenv");

dotenv.config();

const SCHEMA_FILE_PATH = path.join(__dirname, "..", "schema.graphql");

async function fetchSchema() {
  try {
    console.log(`🔍 Fetching schema from: ${process.env.API_URL}`);

    const introspectionQuery = getIntrospectionQuery();

    const response = await fetch(process.env.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: introspectionQuery,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
    }

    const { data, errors } = await response.json();

    if (errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(errors, null, 2)}`);
    }

    if (!data || !data.__schema) {
      throw new Error("Invalid schema response: missing __schema");
    }

    const schema = buildClientSchema(data);

    const schemaSDL = printSchema(schema);

    fs.writeFileSync(SCHEMA_FILE_PATH, schemaSDL, "utf8");

    console.log(`✅ Schema successfully saved to: ${SCHEMA_FILE_PATH}`);
  } catch (error) {
    console.error("❌ Error fetching schema:", error.message);

    process.exit(1);
  }
}

fetchSchema().catch(console.error);
