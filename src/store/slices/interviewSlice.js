import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeTab: 'interviewee',
    currentCandidateId: null,
    resumeFile: null,
    extractedName: null,
    isLoading: false,
    error: null,
    interviewStarted: false,
    currentQuestionIndex: 0,
    selectedOption: null,
    quizFinished: false,
    score: 0,
    userAnswers: [],
    quizQuestions: [],
    timeLeft: 0,
    loadingQuestions: false, // Set to false initially, let component trigger loading
};

const interviewSlice = createSlice({
    name: 'interview',
    initialState, // Use the constant defined above
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        setResumeFile: (state, action) => {
            state.resumeFile = action.payload;
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
        },
        setCurrentQuestionIndex: (state, action) => {
            state.currentQuestionIndex = action.payload;
        },
        setSelectedOption: (state, action) => {
            state.selectedOption = action.payload;
        },
        setQuizFinished: (state, action) => {
            state.quizFinished = action.payload;
        },
        setScore: (state, action) => {
            state.score = action.payload;
        },
        setUserAnswers: (state, action) => {
            state.userAnswers = action.payload;
        },
        setQuizQuestions: (state, action) => {
            state.quizQuestions = action.payload;
        },
        setTimeLeft: (state, action) => {
            state.timeLeft = action.payload;
        },
        setLoadingQuestions: (state, action) => {
            state.loadingQuestions = action.payload;
        },
        
        // ✅ MOVED THE NEW REDUCERS INSIDE THIS OBJECT
        incrementScore(state) {
            state.score += 1;
        },
        addAnswer(state, action) {
            state.userAnswers.push(action.payload);
        },
        decrementTime(state) {
            if (state.timeLeft > 0) {
                state.timeLeft -= 1;
            }
        },

        resetInterviewState: (state) => {
            // Reset to the original initial state, but keep the activeTab and currentCandidateId
            // This is useful if a user wants to restart a quiz for the same session
            return {
                ...initialState,
                activeTab: state.activeTab,
                currentCandidateId: state.currentCandidateId,
            };
        },
    },
});

// ✅ ADDED THE NEW ACTIONS TO THE EXPORT LIST
export const { 
    setActiveTab, 
    setResumeFile, 
    setExtractedName, 
    setIsLoading, 
    setError, 
    setInterviewStarted, 
    setCurrentCandidateId, 
    setCurrentQuestionIndex, 
    setSelectedOption, 
    setQuizFinished, 
    setScore, 
    setUserAnswers, 
    setQuizQuestions, 
    setTimeLeft, 
    setLoadingQuestions, 
    resetInterviewState,
    // New actions
    incrementScore,
    addAnswer,
    decrementTime,
} = interviewSlice.actions;

export default interviewSlice.reducer;