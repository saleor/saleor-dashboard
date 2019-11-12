import { storiesOf } from "@storybook/react";
import React from "react";

import PluginsDetailsPage, {
  FormData,
  PluginsDetailsPageProps
} from "../../../plugins/components/PluginsDetailsPage";
import { plugin } from "../../../plugins/fixtures";
import Decorator from "../../Decorator";
import { formError } from "../../misc";

const props: PluginsDetailsPageProps = {
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onClear: () => undefined,
  onEdit: () => undefined,
  onSubmit: () => undefined,
  plugin,
  saveButtonBarState: "default"
};

storiesOf("Views / Plugins / Plugin details", module)
  .addDecorator(Decorator)
  .add("default", () => <PluginsDetailsPage {...props} />)
  .add("loading", () => (
    <PluginsDetailsPage {...props} disabled={true} plugin={undefined} />
  ))
  .add("form errors", () => (
    <PluginsDetailsPage
      {...props}
      errors={([
        "active",
        "Username or account",
        "Password or license"
      ] as Array<keyof FormData>).map(formError)}
    />
  ))
  .add("not configurable", () => (
    <PluginsDetailsPage
      {...props}
      plugin={{
        ...plugin,
        configuration: null
      }}
    />
  ));
