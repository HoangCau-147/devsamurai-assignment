import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type DateRangeMode = "preset" | "custom";

export interface DateRangeState {
  mode: DateRangeMode;
  days: number; // used when mode === 'preset'
  from?: string; // ISO date string when custom
  to?: string;
}

const defaultDays = 30;

const initialState: DateRangeState = {
  mode: "preset",
  days: defaultDays,
};

const slice = createSlice({
  name: "dateRange",
  initialState,
  reducers: {
    setPresetDays(state, action: PayloadAction<number>) {
      state.mode = "preset";
      state.days = action.payload;
      state.from = undefined;
      state.to = undefined;
    },
    setCustomRange(state, action: PayloadAction<{ from: string; to: string }>) {
      state.mode = "custom";
      state.days = 0;
      state.from = action.payload.from;
      state.to = action.payload.to;
    },
  },
});

export const { setPresetDays, setCustomRange } = slice.actions;
export default slice.reducer;
