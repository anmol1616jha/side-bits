import { describe, expect, it } from "vitest";
import { HISTORY_LIMIT } from "../constants";
import { historyReducer, initialHistory } from "../lib/history";

describe("historyReducer", () => {
  it("undoes and redoes committed changes", () => {
    let state = historyReducer(initialHistory, { type: "edit", text: "hello" });
    state = historyReducer(state, { type: "commit", text: "HELLO" });
    state = historyReducer(state, { type: "undo" });
    expect(state.present).toBe("hello");
    state = historyReducer(state, { type: "redo" });
    expect(state.present).toBe("HELLO");
  });

  it("ignores commits that change nothing", () => {
    const state = historyReducer(
      { ...initialHistory, present: "same" },
      { type: "commit", text: "same" },
    );
    expect(state.past).toEqual([]);
  });

  it("clears redo after an edit", () => {
    let state = historyReducer({ ...initialHistory, present: "a" }, { type: "commit", text: "b" });
    state = historyReducer(state, { type: "undo" });
    state = historyReducer(state, { type: "edit", text: "c" });
    expect(state.future).toEqual([]);
  });

  it("does nothing when there is nothing to undo or redo", () => {
    expect(historyReducer(initialHistory, { type: "undo" })).toBe(initialHistory);
    expect(historyReducer(initialHistory, { type: "redo" })).toBe(initialHistory);
  });

  it("caps the number of undo steps", () => {
    let state = initialHistory;
    for (let i = 0; i < HISTORY_LIMIT + 10; i++)
      state = historyReducer(state, { type: "commit", text: String(i) });
    expect(state.past).toHaveLength(HISTORY_LIMIT);
  });
});
