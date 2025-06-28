import runReducer, { addLocation, startRun, resetRun } from "../runSlice";

describe("runSlice", () => {
  it("should return initial state", () => {
    const initialState = runReducer(undefined, {});
    expect(initialState).toEqual({
      isRunning: false,
      startTime: null,
      locations: [],
    });
  });

  it("should handle startRun", () => {
    const state = runReducer(undefined, startRun());
    expect(state.isRunning).toBe(true);
    expect(state.startTime).toBeDefined(); //czy nie jest null ani undefined
    expect(state.locations).toEqual([]); //czy poprzednia trasa została wyczyszczona
  });

  it("should add valid location", () => {
    const validLocation = {
      latitude: 52.23,
      longitude: 21.01,
      timestamp: 1234567890,
    };

    const state = runReducer(
      { isRunning: true, startTime: 1000, locations: [] },
      addLocation(validLocation),
    );

    expect(state.locations.length).toBe(1);
    expect(state.locations[0]).toEqual(validLocation);
  });

  it("should not add invalid location", () => {
    const invalidLocation = {
      latitude: "abc", // <- niepoprawny typ
      longitude: 21.01,
    };

    const state = runReducer(
      { isRunning: true, startTime: 1000, locations: [] },
      addLocation(invalidLocation),
    );

    expect(state.locations.length).toBe(0); // nie dodano nic
  });

  it("should reset run state", () => {
    const runningState = {
      isRunning: true,
      startTime: 123,
      locations: [{ latitude: 1, longitude: 2, timestamp: 123 }],
    };

    const state = runReducer(runningState, resetRun());
    expect(state).toEqual({
      isRunning: false,
      startTime: null,
      locations: [],
    });
  });
});
