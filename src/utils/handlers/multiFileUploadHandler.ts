export type CreateMultiFileUploadHandlerCallbacks = Partial<{
  onAfterUpload: (index: number, all: number) => void;
  onBeforeUpload: (index: number, all: number) => void;
  onCompleted: (files: FileList) => void;
  onError: (index: number, all: number) => void;
  onStart: (files: FileList) => void;
}>;

function createMultiFileUploadHandler<T>(
  upload: (file: File) => Promise<T>,
  {
    onAfterUpload,
    onBeforeUpload,
    onCompleted,
    onError,
    onStart
  }: CreateMultiFileUploadHandlerCallbacks
) {
  async function uploadImage(files: FileList, fileIndex: number) {
    if (files.length > fileIndex) {
      try {
        if (onBeforeUpload) {
          onBeforeUpload(fileIndex, files.length);
        }

        await upload(files[fileIndex]);

        if (onAfterUpload) {
          onAfterUpload(fileIndex, files.length);
        }
      } catch (exception) {
        console.error(
          `Could not upload file #${fileIndex + 1}. Reason: ${exception}`
        );
        if (onError) {
          onError(fileIndex, files.length);
        }
      } finally {
        await uploadImage(files, fileIndex + 1);
      }
    }
  }
  return async (files: FileList) => {
    if (onStart) {
      onStart(files);
    }

    await uploadImage(files, 0);

    if (onCompleted) {
      onCompleted(files);
    }
  };
}

export default createMultiFileUploadHandler;
