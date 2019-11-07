import {
  ConfigurationItemInput,
  ConfigurationTypeFieldEnum
} from "../../types/globalTypes";
import { Plugin_plugin_configuration } from "../types/Plugin";
import { getConfigurationInput } from "./PluginsDetails";

const baseConfig: Omit<
  Plugin_plugin_configuration,
  "name" | "type" | "value"
> = {
  __typename: "ConfigurationItem",
  helpText: "",
  label: ""
};

const config: Plugin_plugin_configuration[] = [
  {
    ...baseConfig,
    name: "field-1",
    type: ConfigurationTypeFieldEnum.STRING,
    value: "val1"
  },
  {
    ...baseConfig,
    name: "field-2",
    type: ConfigurationTypeFieldEnum.STRING,
    value: "val2"
  },
  {
    ...baseConfig,
    name: "field-3",
    type: ConfigurationTypeFieldEnum.PASSWORD,
    value: ""
  },
  {
    ...baseConfig,
    name: "field-4",
    type: ConfigurationTypeFieldEnum.SECRET,
    value: "val4"
  }
];

const input: ConfigurationItemInput[] = [
  {
    name: "field-1",
    value: "value1"
  },
  {
    name: "field-2",
    value: "value2"
  },
  {
    name: "field-3",
    value: "value3"
  },
  {
    name: "field-4",
    value: "value4"
  }
];

test("Ensure that no secret is sent in input", () => {
  const output: ConfigurationItemInput[] = getConfigurationInput(config, input);

  expect(output).toHaveLength(2);
  expect(
    output.find(
      field =>
        config.find(configField => configField.name === field.name).type ===
        ConfigurationTypeFieldEnum.PASSWORD
    )
  ).toBeFalsy();
  expect(
    output.find(
      field =>
        config.find(configField => configField.name === field.name).type ===
        ConfigurationTypeFieldEnum.SECRET
    )
  ).toBeFalsy();
});

test("Handles null input", () => {
  const output = getConfigurationInput(null, null);

  expect(output).toBeNull();
});
