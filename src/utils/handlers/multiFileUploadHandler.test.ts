import createMultiFileUploadHandler from "./multiFileUploadHandler";

const testFiles = Array(5)
  .fill(0)
  .map(() => new File([""], "mockFile"));

describe("Multiple file upload handler", () => {
  it("properly handles success", done => {
    const cbs = {
      onAfterUpload: jest.fn(),
      onBeforeUpload: jest.fn(),
      onCompleted: jest.fn(files =>
        expect(files.length).toBe(testFiles.length),
      ),
      onError: jest.fn(),
      onStart: jest.fn(),
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

    handle((testFiles as unknown) as FileList).then(() => {
      expect(cbs.onAfterUpload).toBeCalledTimes(testFiles.length);
      expect(cbs.onBeforeUpload).toBeCalledTimes(testFiles.length);
      expect(cbs.onCompleted).toBeCalledTimes(1);
      expect(cbs.onError).toBeCalledTimes(0);
      expect(cbs.onStart).toBeCalledTimes(1);
      done();
    });
  });

  it("properly handles error", done => {
    const cbs = {
      onAfterUpload: jest.fn(),
      onBeforeUpload: jest.fn(),
      onCompleted: jest.fn(files =>
        expect(files.length).toBe(testFiles.length),
      ),
      onError: jest.fn(),
      onStart: jest.fn(),
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

    handle((testFiles as unknown) as FileList).then(() => {
      expect(cbs.onAfterUpload).toBeCalledTimes(testFiles.length - 1);
      expect(cbs.onBeforeUpload).toBeCalledTimes(testFiles.length);
      expect(cbs.onCompleted).toBeCalledTimes(1);
      expect(cbs.onError).toBeCalledTimes(1);
      done();
    });
  });
});
