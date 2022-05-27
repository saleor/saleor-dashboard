import type EditorJS from "@editorjs/editorjs";
import { Notification, ThemeProvider } from "@saleor/macaw-ui";
import themeOverrides from "@saleor/themeOverrides";
import React from "react";
import ReactDOM from "react-dom";

interface ParsingErrorProps {
  api: EditorJS;
}

// TODO: Update design to look better
export const ParsingErrorComponent = ({ api }: ParsingErrorProps) => (
  <Notification
    type="error"
    title="It looks like your data is malformed! You can either delete this message and
    type new content, or check in console what happened"
    onClose={() => api.blocks.delete()}
  />
);

const Wrapper: React.FC<{}> = ({ children }) => (
  <ThemeProvider overrides={themeOverrides}>{children}</ThemeProvider>
);

export class ParsingError {
  api = null;
  el = null;
  constructor({ api }) {
    this.api = api;
  }

  findId() {
    const randomNumber = Math.ceil(Math.random() * 100);
    const id = `parsing-error-${randomNumber}`;
    if (document.getElementById(id)) {
      return this.findId();
    }
    return id;
  }

  render() {
    this.el = document.createElement("div");
    this.el.setAttribute("id", this.findId());
    ReactDOM.render(
      <Wrapper>
        <ParsingErrorComponent api={this.api} />
      </Wrapper>,
      this.el
    );
    return this.el;
  }

  removed() {
    ReactDOM.unmountComponentAtNode(this.el);
  }

  save() {
    return {};
  }
}
