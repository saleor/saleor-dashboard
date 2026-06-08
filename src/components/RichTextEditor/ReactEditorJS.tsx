import EditorJS, {
  type EditorConfig,
  type OutputData,
  type ToolConstructable,
} from "@editorjs/editorjs";
import Paragraph from "@editorjs/paragraph";
import { type EditorCore, type Props as ReactEditorJSProps } from "@react-editor-js/core";
import { useEffect, useRef } from "react";

import { convertEditorJSListBlocks } from "./utils";

// Source of @react-editor-js
class ClientEditorCore implements EditorCore {
  private readonly _editorJS: EditorJS;

  constructor({ tools, ...config }: EditorConfig) {
    const extendTools = {
      // default tools
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
    await this._editorJS.isReady;

    return convertEditorJSListBlocks(await this._editorJS.save());
  }

  public async destroy() {
    try {
      if (this._editorJS) {
        await this._editorJS.isReady;
        this._editorJS.destroy();
      }
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

  /**
   * This property is required by the EditorCore interface to optionally expose
   * the underlying Editor.js instance for advanced use cases. In this implementation,
   * we intentionally do not expose the low-level instance to maintain encapsulation
   * and prevent unsafe direct access. Therefore, this always returns null.
   */
  public get dangerouslyLowLevelInstance(): any | null {
    return null;
  }
}

type Props = Omit<ReactEditorJSProps, "factory">;

/**
 * StrictMode-safe Editor.js mount.
 *
 * The upstream `@react-editor-js` component creates the editor inside `useEffect([])`
 * and tears it down with an async `destroy()`. Under React 18 StrictMode (enabled in dev),
 * the mount effect runs twice (setup → cleanup → setup), so two Editor.js instances briefly
 * share the same holder: the first render duplicates the content, then the late async
 * `destroy()` of the first instance wipes the holder, leaving an empty, non-editable field.
 *
 * To avoid this we keep a single editor instance across the simulated remount and defer the
 * teardown by a tick, cancelling it when React immediately re-runs the setup.
 */
function ReactEditorJSClient({
  holder,
  children,
  value,
  defaultValue,
  onInitialize,
  ...restProps
}: Props) {
  const holderId = useRef(holder ?? `react-editor-js-${Date.now().toString(16)}`);
  const editorRef = useRef<ClientEditorCore | null>(null);
  const destroyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Cancel a teardown scheduled by StrictMode's simulated unmount so a single editor survives.
    if (destroyTimeoutRef.current !== null) {
      clearTimeout(destroyTimeoutRef.current);
      destroyTimeoutRef.current = null;
    }

    if (!editorRef.current) {
      editorRef.current = new ClientEditorCore({
        holder: holderId.current,
        ...(defaultValue && { data: defaultValue }),
        ...restProps,
      });
    }

    onInitialize?.(editorRef.current);

    return () => {
      // Defer teardown a tick; StrictMode re-runs setup synchronously and cancels it above.
      destroyTimeoutRef.current = setTimeout(() => {
        editorRef.current?.destroy();
        editorRef.current = null;
        destroyTimeoutRef.current = null;
      }, 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (value) {
      editorRef.current?.render(value);
    }
  }, [value]);

  return children ?? <div id={holderId.current} />;
}

export const ReactEditorJS = ReactEditorJSClient;
