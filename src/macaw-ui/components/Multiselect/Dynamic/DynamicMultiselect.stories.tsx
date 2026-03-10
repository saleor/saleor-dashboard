import { Meta } from "@storybook/react";
import { useState } from "react";

import { DynamicMultiselect } from "..";
import { Box, Option } from "../..";

const meta: Meta<typeof DynamicMultiselect> = {
  title: "Components / DynamicMultiselect",
  tags: ["autodocs"],
  component: DynamicMultiselect,

  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 300,
      },
    },
  },
};

export default meta;

export const Default = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [value, setValue] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState<string>("");

  async function search(url: string) {
    setLoading(true);
    const response = await fetch(url);
    const body = await response.json();

    setLoading(false);
    return body;
  }

  async function loadMore() {
    if (nextUrl === null) {
      return;
    }

    setLoading(true);
    const res = await search(nextUrl);

    const options = res.results.map((result: { name: string }) => ({
      value: result.name,
      label: result.name,
    }));

    setNextUrl(res.next);
    setOptions((prev) => [...prev, ...options]);

    setLoading(false);
  }

  const handleInputValueChange = async (criteria: string) => {
    const res = await search(
      `https://swapi.dev/api/people/?search=${criteria}`
    );

    setNextUrl(res.next);
    setOptions(
      res.results.map((result: { name: string }) => ({
        value: result.name,
        label: result.name,
      }))
    );
  };

  return (
    <Box __width={300}>
      <DynamicMultiselect
        value={value}
        label="Pick a star wars characters"
        onChange={(value) => setValue(value)}
        options={options}
        loading={loading}
        onInputValueChange={(value) => {
          handleInputValueChange(value);
        }}
        onScrollEnd={() => {
          loadMore();
        }}
        locale={{
          placeholderText: "Add character",
        }}
      />
    </Box>
  );
};

export const NoOptions = () => {
  return (
    <Box __width={300}>
      <DynamicMultiselect
        value={[]}
        label="Pick a star wars characters"
        onChange={() => undefined}
        options={[]}
        locale={{
          placeholderText: "Add character",
        }}
      >
        <DynamicMultiselect.NoOptions>
          No items to select
        </DynamicMultiselect.NoOptions>
      </DynamicMultiselect>
    </Box>
  );
};
