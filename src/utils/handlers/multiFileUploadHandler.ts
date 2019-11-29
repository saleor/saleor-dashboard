export type CreateMultiFileUploadHandlerCallbacks = Partial<{
  onAfterUpload: (index: number, files: File[]) => void;
  onBeforeUpload: (index: number, files: File[]) => void;
  onCompleted: (files: File[]) => void;
  onError: (index: number, files: File[]) => void;
  onStart: (files: File[]) => void;
}>;

function createMultiFileUploadHandler<T>(
  upload: (file: File, fileIndex: number) => Promise<T>,
  {
    onAfterUpload,
    onBeforeUpload,
    onCompleted,
    onError,
    onStart
  }: CreateMultiFileUploadHandlerCallbacks
) {
  async function uploadImage(files: File[], fileIndex: number): Promise<void> {
    if (files.length > fileIndex) {
      try {
        if (onBeforeUpload) {
          onBeforeUpload(fileIndex, files);
        }

        await upload(files[fileIndex], fileIndex);

        if (onAfterUpload) {
          onAfterUpload(fileIndex, files);
        }
      } catch (exception) {
        console.error(
          `Could not upload file #${fileIndex + 1}. Reason: ${exception}`
        );
        if (onError) {
          onError(fileIndex, files);
        }
      } finally {
        await uploadImage(files, fileIndex + 1);
      }
    }
  }
  return async (files: FileList): Promise<void> => {
    const fileArray = Array.from(files);

    if (onStart) {
      onStart(fileArray);
    }

    await uploadImage(fileArray, 0);

    if (onCompleted) {
      onCompleted(fileArray);
    }
  };
}

export default createMultiFileUploadHandler;
