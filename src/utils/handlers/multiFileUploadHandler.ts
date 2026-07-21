type CreateMultiFileUploadHandlerCallbacks<T> = Partial<{
  onAfterUpload: (index: number, files: File[], result: T) => void;
  onBeforeUpload: (index: number, files: File[]) => void;
  onCompleted: (files: File[]) => void;
  onError: (index: number, files: File[]) => void;
  onStart: (files: File[]) => void;
  /**
   * Max number of uploads in flight at once. Defaults to 1 (sequential).
   */
  concurrency: number;
}>;

async function uploadWithConcurrency<T>(
  files: File[],
  concurrency: number,
  upload: (file: File, fileIndex: number) => Promise<T>,
  {
    onAfterUpload,
    onBeforeUpload,
    onError,
  }: Pick<CreateMultiFileUploadHandlerCallbacks<T>, "onAfterUpload" | "onBeforeUpload" | "onError">,
): Promise<void> {
  let nextIndex = 0;

  const worker = async () => {
    while (nextIndex < files.length) {
      const fileIndex = nextIndex;

      nextIndex += 1;

      try {
        onBeforeUpload?.(fileIndex, files);

        const result = await upload(files[fileIndex], fileIndex);

        onAfterUpload?.(fileIndex, files, result);
      } catch (exception) {
        console.error(`Could not upload file #${fileIndex + 1}. Reason: ${exception}`);
        onError?.(fileIndex, files);
      }
    }
  };

  const workerCount = Math.max(1, Math.min(concurrency, files.length));

  await Promise.all(Array.from({ length: workerCount }, () => worker()));
}

function createMultiFileUploadHandler<T>(
  upload: (file: File, fileIndex: number) => Promise<T>,
  {
    onAfterUpload,
    onBeforeUpload,
    onCompleted,
    onError,
    onStart,
    concurrency = 1,
  }: CreateMultiFileUploadHandlerCallbacks<T> = {},
) {
  return async (files: FileList | File[]): Promise<void> => {
    const fileArray = Array.from(files);

    onStart?.(fileArray);

    await uploadWithConcurrency(fileArray, concurrency, upload, {
      onAfterUpload,
      onBeforeUpload,
      onError,
    });

    onCompleted?.(fileArray);
  };
}

export default createMultiFileUploadHandler;
