export type CreateFileUploadHandlerCallbacks = Partial<{
  onAfterUpload: (file: File) => void;
  onBeforeUpload: (file: File) => void;
  onCompleted: (file: File) => void;
  onError: (file: File) => void;
  onStart: (file: File) => void;
}>;

function createFileUploadHandler<T>(
  upload: (file: File) => Promise<T>,
  {
    onAfterUpload,
    onBeforeUpload,
    onCompleted,
    onError,
    onStart,
  }: CreateFileUploadHandlerCallbacks,
) {
  async function uploadImage(file: File): Promise<Awaited<any>> {
    try {
      if (onBeforeUpload) {
        onBeforeUpload(file);
      }

      const resp = await upload(file);

      if (onAfterUpload) {
        onAfterUpload(file);
      }
      return resp;
    } catch (exception) {
      console.error(`Could not upload file #${file}. Reason: ${exception}`);
      if (onError) {
        onError(file);
      }
    }
  }

  return async (file: File): Promise<any> => {
    if (onStart) {
      onStart(file);
    }

    const resp = await uploadImage(file);

    if (onCompleted) {
      onCompleted(file);
    }
    return resp;
  };
}

export default createFileUploadHandler;
