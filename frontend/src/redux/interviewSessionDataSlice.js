import { createSlice } from "@reduxjs/toolkit";

const interviewSessionDataSlice = createSlice({
    name:"interviewSession",
    initialState:{
        interviewSessionData:null,
    },
    reducers:{
        setInterviewSessionData:(state, action) => {
            state.interviewSessionData = action.payload.sessionData;
        }
    }
});

export const { setInterviewSessionData } = interviewSessionDataSlice.actions;
export default interviewSessionDataSlice.reducer;

 