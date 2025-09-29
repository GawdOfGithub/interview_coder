import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

// Async thunk to fetch candidate scores
export const fetchCandidateScores = createAsyncThunk(
    'candidates/fetchCandidateScores',
    async (candidateId, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:3000/scores/${candidateId}`);
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData);
            }
            const scores = await response.json();
            return { candidateId, scores };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to fetch all candidates
export const fetchAllCandidates = createAsyncThunk(
    'candidates/fetchAllCandidates',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:3000/candidates`);
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData);
            }
            const candidates = await response.json();
            return candidates;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Define initialState at the top so it can be reused by the reset action
const initialState = {
    list: [],
    status: 'idle',
    error: null,
};

const candidatesSlice = createSlice({
    name: 'candidates',
    initialState,
    reducers: {
        resetCandidatesState: () => initialState,
        
        updateCandidateAiSummary: (state, action) => {
            const { candidateId, aiSummary } = action.payload;
            const candidateToUpdate = state.list.find(c => c.id === candidateId);
            if (candidateToUpdate) {
                candidateToUpdate.aiSummary = aiSummary;
            }
        },
        clearCandidateAiSummary: (state, action) => {
            const candidateId = action.payload;
            const candidateToUpdate = state.list.find(c => c.id === candidateId);
            if (candidateToUpdate) {
                candidateToUpdate.aiSummary = null;
            }
        },
        addCandidate: (state, action) => {
            const newCandidate = action.payload;
            const existingCandidate = state.list.find(c => c.id === newCandidate.id);
            if (!existingCandidate) {
                state.list.push(newCandidate);
            }
        },
        updateCandidateChatHistory: (state, action) => {
            const { candidateId, message } = action.payload;
            const candidate = state.list.find(c => c.id === candidateId);
            if (candidate) {
                if (!Array.isArray(candidate.chatHistory)) {
                    candidate.chatHistory = [];
                }
                candidate.chatHistory.push(message);
            }
        },
        updateCandidateScore: (state, action) => {
            const { candidateId, scoreValue } = action.payload;
            const candidate = state.list.find(c => c.id === candidateId);
            if (candidate) {
                candidate.score = scoreValue;
            }
        },
        clearChatHistory: (state, action) => {
            const candidateId = action.payload;
            const candidateToUpdate = state.list.find(c => c.id === candidateId);
            if (candidateToUpdate) {
                candidateToUpdate.chatHistory = [];
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCandidateScores.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCandidateScores.fulfilled, (state, action) => {
                const { candidateId, scores } = action.payload;
                let candidateToUpdate = state.list.find(c => c.id === candidateId);

                if (!candidateToUpdate) {
                    candidateToUpdate = state.list.find(c => c.id === action.meta.arg);
                }

                if (candidateToUpdate) {
                    if (scores.length > 0) {
                        candidateToUpdate.score = scores[0].score;
                    } else {
                        candidateToUpdate.score = null;
                    }
                }
            })
            .addCase(fetchCandidateScores.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchAllCandidates.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllCandidates.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const existingCandidatesMap = new Map(state.list.map(c => [c.id, c]));
                
                action.payload.forEach(candidate => {
                    const candidateData = {
                        ...candidate,
                        id: candidate.candidateId,
                        chatHistory: candidate.chatHistory || []
                    };
                    const existingData = existingCandidatesMap.get(candidateData.id) || {};
                    existingCandidatesMap.set(candidateData.id, { ...existingData, ...candidateData });
                });

                state.list = Array.from(existingCandidatesMap.values());
            })
            .addCase(fetchAllCandidates.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const selectChatHistoryByCandidateId = createSelector(
    [(state) => state.candidates.list, (state, candidateId) => candidateId],
    (candidates, candidateId) => 
        candidates.find(c => c.id === candidateId)?.chatHistory || []
);
export const selectCandidateById = (state, candidateId) => 
    state.candidates.list.find(candidate => candidate.id === candidateId);

export const {
    addCandidate, 
    updateCandidateChatHistory, 
    updateCandidateScore, 
    updateCandidateAiSummary, 
    clearCandidateAiSummary,
    clearChatHistory,
    resetCandidatesState,

} = candidatesSlice.actions;

export default candidatesSlice.reducer;