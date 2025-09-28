import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
    persistStore, 
    persistReducer,
    // ✅ 1. Import all the action types
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import candidatesReducer from './slices/candidatesSlice';
import interviewReducer from './slices/interviewSlice';

const rootReducer = combineReducers({
    candidates: candidatesReducer,
    interview: interviewReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    // Best practice: only persist the slice you need
    whitelist: ['interview'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // ✅ 2. Use the full list of ignored actions
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);