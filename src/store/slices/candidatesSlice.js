import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from 'reselect'; // Import createSelector

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
            console.log("scores",scores);
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
            return candidates; // This will be the new list of candidates
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const candidatesSlice = createSlice({
    name: 'candidates',
    initialState: {
        list: [], // Initialize as an empty array to allow Redux Persist to manage the list
        status: 'idle',
        error: null,
    },
    reducers: {
        addCandidate: (state, action) => {
            // Ensure incoming payload has an `id` matching backend's `candidateId` and initialize chatHistory
            const newCandidate = { 
                ...action.payload, 
                id: action.payload.candidateId || action.payload.id, 
                chatHistory: action.payload.chatHistory || [] // Ensure chatHistory is an array
            };
            state.list.push(newCandidate);
            console.log('Candidate added:', newCandidate); // Debugging
        },
        updateCandidateChatHistory: (state, action) => {
            const { candidateId, message } = action.payload;
            const candidate = state.list.find(c => c.id === candidateId);
            if (candidate) {
                if (!Array.isArray(candidate.chatHistory)) {
                    candidate.chatHistory = []; // Initialize if not an array
                }
                candidate.chatHistory.push(message);
                console.log(`Chat history updated for ${candidateId}:`, message); // Debugging
            }
        },
        updateCandidateScore: (state, action) => {
            const { candidateId, scoreValue } = action.payload; // Removed scoreType
            const candidate = state.list.find(c => c.id === candidateId);
            if (candidate) {
                console.log(`Pre-update candidate state for ${candidateId}:`, JSON.parse(JSON.stringify(candidate))); // Debugging
                candidate.score = scoreValue; // Update the single score field
                console.log(`Post-update candidate state for ${candidateId}:`, JSON.parse(JSON.stringify(candidate))); // Debugging
                console.log(`Score updated for ${candidateId}:`, scoreValue); // Debugging
            }
        },
        updateCandidateAiSummary: (state, action) => {
            const { candidateId, aiSummary } = action.payload;
            const candidate = state.list.find(c => c.id === candidateId);
            if (candidate) {
                candidate.aiSummary = aiSummary;
                console.log(`AI summary updated for ${candidateId}:`, aiSummary); // Debugging
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCandidateScores.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCandidateScores.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { candidateId, scores } = action.payload;
                let candidateToUpdate = state.list.find(c => c.id === candidateId); // Find by backend candidateId

                if (!candidateToUpdate) {
                    // Fallback: If not found by backend candidateId (e.g., old persisted state),
                    // try finding by the ID used when dispatching the thunk (action.meta.arg).
                    candidateToUpdate = state.list.find(c => c.id === action.meta.arg);
                    if (candidateToUpdate) {
                        // console.warn(`Redux: Candidate ID mismatch detected. Updating old Redux ID '${candidateToUpdate.id}' to new backend ID '${candidateId}'.`); // Clean up debug log
                        candidateToUpdate.id = candidateId; // Update the ID in the Redux store
                    }
                }

                if (candidateToUpdate) {
                    console.log(`Redux: Pre-fetch fulfilled candidate state for ID ${candidateId}:`, JSON.parse(JSON.stringify(candidateToUpdate))); // Debugging
                    if (scores.length > 0) {
                        candidateToUpdate.score = scores[0].score; // Update the single score field
                    } else {
                        candidateToUpdate.score = null; // Explicitly set to null if no scores found
                    }
                    console.log(`Redux: Post-fetch fulfilled candidate state for ID ${candidateId}:`, JSON.parse(JSON.stringify(candidateToUpdate))); // Debugging
                } else {
                    console.error(`Redux: Candidate with ID ${candidateId} not found in state after fetch!`); // Debugging
                }
            })
            .addCase(fetchCandidateScores.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                console.error('Failed to fetch scores:', action.payload);
            })
            .addCase(fetchAllCandidates.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllCandidates.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Map backend's candidateId to frontend's id and ensure chatHistory is an array
                state.list = action.payload.map(candidate => ({
                    ...candidate,
                    id: candidate.candidateId, // Map candidateId to id
                    chatHistory: candidate.chatHistory || [] // Ensure chatHistory is an array
                }));
                console.log('fetchAllCandidates.fulfilled: Setting state.list to:', state.list); // Debugging
                console.log('fetchAllCandidates.fulfilled: Updated state.list now:', state.list); // Debugging
                console.log('All candidates fetched and updated:', state.list); // Debugging
            })
            .addCase(fetchAllCandidates.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                console.error('Failed to fetch all candidates:', action.payload);
            });
    },
});

// Memoized selector for chat history
export const selectChatHistoryByCandidateId = createSelector(
    [(state) => state.candidates.list, (state, candidateId) => candidateId],
    (candidates, candidateId) => 
        candidates.find(c => c.id === candidateId)?.chatHistory || []
);

export const { addCandidate, updateCandidateChatHistory, updateCandidateScore, updateCandidateAiSummary } = candidatesSlice.actions;
export default candidatesSlice.reducer;
