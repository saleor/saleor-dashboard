import { CodegenConfig } from '@graphql-codegen/cli'
import dotenv from "dotenv";

dotenv.config();

const config: CodegenConfig = {
  schema: process.env.API_URL,
  generates: {
    './introspection.json': {
      plugins: ['introspection']
    },
    './schema.graphql': {
      plugins: ['schema-ast']
    }
  }
}
 
export default config