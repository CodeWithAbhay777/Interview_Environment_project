import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import userProfileSlice from "./userProfileSlice";
import interviewSessionDataSlice from "./interviewSessionDataSlice";

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth'] 
}

const rootReducer = combineReducers({
    auth:authSlice,
    profile:userProfileSlice,
    interviewSession:interviewSessionDataSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export default store;