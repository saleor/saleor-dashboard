import createMultiFileUploadHandler from "./multiFileUploadHandler";

const testFiles = Array(5)
  .fill(0)
  .map(() => new File([""], "mockFile"));

describe("Multiple file upload handler", () => {
  it("properly handles success", async () => {
    const cbs = {
      onAfterUpload: vi.fn(),
      onBeforeUpload: vi.fn(),
      onCompleted: vi.fn(files => expect(files.length).toBe(testFiles.length)),
      onError: vi.fn(),
      onStart: vi.fn(),
    };
    const handle = createMultiFileUploadHandler(() => {
      const promise = new Promise<void>(resolve => {
        expect(cbs.onBeforeUpload).toBeCalledTimes(
          cbs.onAfterUpload.mock.calls.length + 1,
        );
        resolve();
      });
      return promise;
    }, cbs);

    await handle(testFiles as unknown as FileList);

    expect(cbs.onAfterUpload).toBeCalledTimes(testFiles.length);
    expect(cbs.onBeforeUpload).toBeCalledTimes(testFiles.length);
    expect(cbs.onCompleted).toBeCalledTimes(1);
    expect(cbs.onError).toBeCalledTimes(0);
    expect(cbs.onStart).toBeCalledTimes(1);
  });

  it("properly handles error", async () => {
    const cbs = {
      onAfterUpload: vi.fn(),
      onBeforeUpload: vi.fn(),
      onCompleted: vi.fn(files => expect(files.length).toBe(testFiles.length)),
      onError: vi.fn(),
      onStart: vi.fn(),
    };
    const handle = createMultiFileUploadHandler((_, fileIndex) => {
      const promise = new Promise<void>((resolve, reject) => {
        if (fileIndex === 2) {
          reject();
        } else {
          resolve();
        }
      });
      return promise;
    }, cbs);

    await handle(testFiles as unknown as FileList);

    expect(cbs.onAfterUpload).toBeCalledTimes(testFiles.length - 1);
    expect(cbs.onBeforeUpload).toBeCalledTimes(testFiles.length);
    expect(cbs.onCompleted).toBeCalledTimes(1);
    expect(cbs.onError).toBeCalledTimes(1);
  });
});
