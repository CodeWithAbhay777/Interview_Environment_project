import { createSlice } from "@reduxjs/toolkit";

const userProfileSlice = createSlice({
    name:"auth",
    initialState:{
        
        
        userProfile:null,
        
    },
    reducers:{
        
        
        setProfile:(state, action) => {
            state.userProfile = action.payload.profile;
        }
    }
});
export const {setProfile} = userProfileSlice.actions;
export default userProfileSlice.reducer;