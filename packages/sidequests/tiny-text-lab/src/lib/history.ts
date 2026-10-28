import { HISTORY_LIMIT } from "../constants";

export interface TextHistory {
  past: string[];
  present: string;
  future: string[];
}

export type HistoryAction =
  /** Typing: replaces the text without an undo step (the browser handles typing undo). */
  | { type: "edit"; text: string }
  /** A transform or clear: records an undo step. */
  | { type: "commit"; text: string }
  | { type: "undo" }
  | { type: "redo" };

export const initialHistory: TextHistory = { past: [], present: "", future: [] };

export function historyReducer(state: TextHistory, action: HistoryAction): TextHistory {
  switch (action.type) {
    case "edit":
      return { ...state, present: action.text, future: [] };
    case "commit":
      if (action.text === state.present) return state;
      return {
        past: [...state.past, state.present].slice(-HISTORY_LIMIT),
        present: action.text,
        future: [],
      };
    case "undo": {
      const previous = state.past.at(-1);
      if (previous === undefined) return state;
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case "redo": {
      const [next, ...rest] = state.future;
      if (next === undefined) return state;
      return { past: [...state.past, state.present], present: next, future: rest };
    }
  }
}
