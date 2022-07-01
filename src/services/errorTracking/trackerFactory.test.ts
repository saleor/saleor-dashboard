import { ErrorTrackerFactory } from "./trackerFactory";
import { TrackerMethods, TrackerPermission } from "./types";

const testErrorId = "testId";
const initMockFn = jest.fn();
const captureExceptionMockFn = jest.fn(_ => testErrorId);
const setUserDataMockFn = jest.fn();

const TestAdapter = (): TrackerMethods => {
  const init: TrackerMethods["init"] = () => {
    initMockFn();
    return true;
  };

  const setUserData: TrackerMethods["setUserData"] = userData =>
    setUserDataMockFn(userData);

  const captureException: TrackerMethods["captureException"] = (e: Error) =>
    captureExceptionMockFn(e);

  return {
    captureException,
    init,
    setUserData,
  };
};

describe("Error Tracking", () => {
  it("Initiates the tracker", () => {
    const errorTracking = ErrorTrackerFactory(TestAdapter());
    const enabled = errorTracking.init();

    expect(enabled).toBe(true);
    expect(initMockFn).toHaveBeenCalled();
  });

  it("Does not fire events when is not initiated", () => {
    const errorTracking = ErrorTrackerFactory(TestAdapter());
    const sampleError = new Error("test");
    const id = errorTracking.captureException(sampleError);

    expect(id).toBe(undefined);
    expect(captureExceptionMockFn).toHaveBeenCalledTimes(0);
  });

  it("Sends a captured exception", () => {
    const errorTracking = ErrorTrackerFactory(TestAdapter());
    errorTracking.init();
    const sampleError = new Error("test");
    const id = errorTracking.captureException(sampleError);

    expect(id).toBe(testErrorId);
    expect(captureExceptionMockFn).toHaveBeenCalledWith(sampleError);
  });

  it("Does not save user data without permission", () => {
    const errorTracking = ErrorTrackerFactory(TestAdapter());
    errorTracking.init();
    const userData = {
      email: "john@example.com",
      id: "id",
      username: "John Doe",
    };
    errorTracking.setUserData(userData);

    expect(setUserDataMockFn).toHaveBeenCalledTimes(0);
  });

  it("Does save user data with proper permission", () => {
    const errorTracking = ErrorTrackerFactory(TestAdapter(), [
      TrackerPermission.USER_DATA,
    ]);
    errorTracking.init();
    const userData = {
      email: "john@example.com",
      id: "id",
      username: "John Doe",
    };
    errorTracking.setUserData(userData);

    expect(setUserDataMockFn).toHaveBeenCalledWith(userData);
  });
});
