import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      
      state.user = action.payload.user;
      if (action.payload.isAuthenticated !== undefined) {
        state.isAuthenticated = action.payload.isAuthenticated;
      }
    },

    setIsEmailVerification: (state , action) => {
      state.user.isEmailVerified = action.payload.isEmailVerified;
    },
  },
});
export const { setUser,setIsEmailVerification } = authSlice.actions;
export default authSlice.reducer;
