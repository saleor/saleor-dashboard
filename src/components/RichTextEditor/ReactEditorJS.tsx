import { apolloClient } from "@dashboard/graphql/client";
import { pageMediaUrlQuery } from "@dashboard/pages/queries";
import createFileUploadHandler from "@dashboard/utils/handlers/fileUploadHandler";
import EditorJS, {
  EditorConfig,
  OutputData,
  ToolConstructable,
} from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";
import {
  EditorCore,
  Props as ReactEditorJSProps,
  ReactEditorJS as BaseReactEditorJS,
} from "@react-editor-js/core";
import React from "react";

// Source of @react-editor-js
class ClientEditorCore implements EditorCore {
  private readonly _editorJS: EditorJS;

  constructor({ tools, ...config }: EditorConfig, upload) {
    const handleImageUpload = createFileUploadHandler(upload, {});

    const extendTools = {
      // default tools
      image: {
        class: ImageTool,
        config: {
          uploader: {
            uploadByFile(file: File) {
              return handleImageUpload(file)
                .then(resp => {
                  return resp.data.pageMediaCreate.page.id;
                })
                .then((id: string) => {
                  return apolloClient.query({
                    fetchPolicy: "network-only",
                    query: pageMediaUrlQuery,
                    variables: {
                      id,
                      size: 0,
                    },
                  });
                })
                .then(query => {
                  return {
                    success: 1,
                    file: {
                      url: query.data.page.media.slice(-1)[0].url,
                    },
                  };
                })
                .catch(() => {
                  return { success: 0, file: { url: null } };
                });
            },
          },
        },
        inlineToolbar: true,
      },
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
      } as unknown as ToolConstructable,
      ...tools,
    };

    this._editorJS = new EditorJS({
      tools: extendTools,
      ...config,
    });
  }

  public async clear() {
    await this._editorJS.clear();
  }

  public async save() {
    return this._editorJS.save();
  }

  public async destroy() {
    try {
      await this._editorJS.destroy();
    } catch (e) {
      /*
        Dismiss that error.
        Sometimes instance is already unmounted while Editor wants to destroy it.
        Editorjs does this properly so this error does not break anything
       */
    }
  }

  public async render(data: OutputData) {
    await this._editorJS.render(data);
  }
}

export type Props = Omit<ReactEditorJSProps, "factory">;

function ReactEditorJSClient(props: Props) {
  const { onImageUpload } = props;
  const factory = React.useCallback(
    (config: EditorConfig) => new ClientEditorCore(config, onImageUpload),
    [],
  );

  return <BaseReactEditorJS factory={factory} {...props} />;
}

export const ReactEditorJS = ReactEditorJSClient;
