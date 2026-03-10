// eslint-disable react/jsx-key
import { Meta, StoryObj } from "@storybook/react";
import { Text } from "../Text";
import { RadioGroup } from "./index";

const meta: Meta<typeof RadioGroup> = {
  title: "Components / RadioGroup",
  tags: ["autodocs"],
  component: RadioGroup,
  argTypes: {
    size: {
      type: {
        name: "enum",
        value: ["small", "medium", "large"],
      },
    },
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Item value="default-unchecked" id="default-unchecked">
        <Text size={2}>Unchecked</Text>
      </RadioGroup.Item>
      <RadioGroup.Item value="default-checked" id="default-checked">
        <Text size={2}>Checked</Text>
      </RadioGroup.Item>
    </RadioGroup>
  ),
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Primary: Story = {
  args: {
    label: "Should it be checked?",
    value: "default-checked",
    size: "medium",
  },
};

export const Errored: Story = {
  args: {
    label: "Should it be checked?",
    value: "default-checked",
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Should it be checked?",
    value: "default-checked",
    disabled: true,
  },
};

export const LongText: Story = {
  args: {
    label: "Long text",
    value: "default-checked",
    disabled: true,
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Item value="default-unchecked" id="default-unchecked">
        <Text size={2}>
          You are doing me a frighten vvv borking doggo I am bekom fat ruff
          doge, big ol pupper super chub you are doin me a concern extremely
          cuuuuuute. Woofer fat boi very hand that feed shibe woofer, wow such
          tempt borkf. Doge wow such tempt waggy wags boof porgo heckin angery
          woofer you are doing me a frighten, he made many woofs smol borking
          doggo with a long snoot for pats you are doing me a frighten
          shooberino. Porgo floofs wow such tempt he made many woofs very taste
          wow, snoot super chub yapper borkdrive borking doggo, heckin angery
          woofer blep you are doing me a frighten. Borkf long water shoob h*ck
          mlem doggo noodle horse, borking doggo I am bekom fat smol. You are
          doing me a frighten dat tungg tho tungg fat boi thicc snoot, puggorino
          tungg doggo shibe porgo, fluffer extremely cuuuuuute blop doggorino.
          wow very biscit very hand that feed shibe very good spot. Shooberino
          clouds waggy wags fat boi, boof. Corgo big ol thicc, many pats.
        </Text>
      </RadioGroup.Item>
      <RadioGroup.Item value="default-checked" id="default-checked">
        <Text size={2}>
          Doggo ipsum you are doing me the shock doggorino wow such tempt lotsa
          pats, wow such tempt blep. Heckin angery woofer porgo many pats you
          are doing me a frighten pupperino, such treat doggo much ruin diet.
          Heckin good boys lotsa pats h*ck pupperino the neighborhood pupper he
          made many woofs boof puggorino aqua doggo, noodle horse clouds you are
          doing me a frighten wrinkler I am bekom fat snoot. Porgo long water
          shoob heckin good boys long doggo smol borking doggo with a long snoot
          for pats, long woofer boofers very jealous pupper boof, super chub
          smol borking doggo with a long snoot for pats sub woofer. Length boy
          borkf very hand that feed shibe long bois borking doggo pats ruff
          length boy, very good spot shibe sub woofer wow very biscit fluffer.
          doggo big ol pupper. What a nice floof heckin angery woofer the
          neighborhood pupper puggo, shibe.
        </Text>
      </RadioGroup.Item>
    </RadioGroup>
  ),
};
