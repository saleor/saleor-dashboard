import EditorJS from "@editorjs/editorjs";

export async function clean(editor: EditorJS) {
  if (editor) {
    // Prevents race conditions
    await editor.isReady;
    editor.destroy();
  }
}
