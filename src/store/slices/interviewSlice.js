import { createSlice } from '@reduxjs/toolkit';

const interviewSlice = createSlice({
    name: 'interview',
    initialState: {
        activeTab: 'interviewee',
        currentCandidateId: null,
        resumeFile: null,
        extractedName: null,
        isLoading: false,
        error: null,
        interviewStarted: false,
    },
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        setResumeFile: (state, action) => {
            state.resumeFile = action.payload; // Now expects a string (filename) or null
        },
        setExtractedName: (state, action) => {
            state.extractedName = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setInterviewStarted: (state, action) => {
            state.interviewStarted = action.payload;
        },
        setCurrentCandidateId: (state, action) => {
            state.currentCandidateId = action.payload;
        }
    },
});

export const { setActiveTab, setResumeFile, setExtractedName, setIsLoading, setError, setInterviewStarted, setCurrentCandidateId } = interviewSlice.actions;
export default interviewSlice.reducer;
