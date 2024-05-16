import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      console.log(action.payload);
    },
  },
});

export const { setUserDetails } = userSlice.actions;

export default userSlice.reducer;
