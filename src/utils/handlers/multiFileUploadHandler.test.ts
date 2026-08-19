import createMultiFileUploadHandler from "./multiFileUploadHandler";

const testFiles = Array(5)
  .fill(0)
  .map(() => new File([""], "mockFile"));

describe("Multiple file upload handler", () => {
  it("properly handles success", done => {
    const cbs = {
      onAfterUpload: jest.fn(),
      onBeforeUpload: jest.fn(),
      onCompleted: jest.fn(files => expect(files.length).toBe(testFiles.length)),
      onError: jest.fn(),
      onStart: jest.fn(),
    };
    const handle = createMultiFileUploadHandler(() => {
      const promise = new Promise<void>(resolve => {
        expect(cbs.onBeforeUpload).toBeCalledTimes(cbs.onAfterUpload.mock.calls.length + 1);
        resolve();
      });

      return promise;
    }, cbs);

    handle(testFiles as unknown as FileList).then(() => {
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
      onCompleted: jest.fn(files => expect(files.length).toBe(testFiles.length)),
      onError: jest.fn(),
    };
    const handle = createMultiFileUploadHandler((_, fileIndex) => {
      const promise = new Promise<void>((resolve, reject) => {
        if (fileIndex === 2) {
          reject(new Error("mock error"));
        } else {
          resolve();
        }
      });

      return promise;
    }, cbs);

    handle(testFiles as unknown as FileList).then(() => {
      expect(cbs.onAfterUpload).toBeCalledTimes(testFiles.length - 1);
      expect(cbs.onBeforeUpload).toBeCalledTimes(testFiles.length);
      expect(cbs.onCompleted).toBeCalledTimes(1);
      expect(cbs.onError).toBeCalledTimes(1);
      done();
    });
  });

  it("uploads with limited concurrency", async () => {
    // Arrange
    let inFlight = 0;
    let maxInFlight = 0;
    const uploadOrder: number[] = [];
    const cbs = {
      onAfterUpload: jest.fn(),
      onError: jest.fn(),
      onCompleted: jest.fn(),
    };
    const handle = createMultiFileUploadHandler(
      async (_file, fileIndex) => {
        inFlight += 1;
        maxInFlight = Math.max(maxInFlight, inFlight);
        uploadOrder.push(fileIndex);
        await Promise.resolve();
        inFlight -= 1;

        return `result-${fileIndex}`;
      },
      { ...cbs, concurrency: 2 },
    );

    // Act
    await handle(testFiles);

    // Assert
    expect(maxInFlight).toBe(2);
    expect(cbs.onAfterUpload).toHaveBeenCalledTimes(testFiles.length);
    expect(cbs.onAfterUpload.mock.calls[0][2]).toBe("result-0");
    expect(cbs.onError).not.toHaveBeenCalled();
    expect(cbs.onCompleted).toHaveBeenCalledTimes(1);
    expect(uploadOrder).toHaveLength(testFiles.length);
  });
});
